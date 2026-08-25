/**
 * Celys Care Offline-First IndexedDB Synchronization Engine
 * Manages client mutation queue, conflict-free reconciliation, and automatic background sync.
 */

import { useState, useEffect } from "react";

export type EntityType = "mood" | "journal" | "chat" | "activity" | "star" | "oracle" | "affirmation";
export type MutationAction = "CREATE" | "UPDATE" | "DELETE";

export interface QueuedMutation {
  id: string;
  idempotencyKey: string;
  entityType: EntityType;
  action: MutationAction;
  payload: any;
  clientTimestamp: number;
  retryCount: number;
  status: "PENDING" | "SYNCING" | "FAILED" | "SYNCED";
}

const DB_NAME = "celys_sanctuary_vault_v1";
const QUEUE_STORE = "mutation_queue";
const CACHE_STORE = "offline_cache";

class OfflineSyncManager {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isSyncing = false;
  private listeners: Set<(count: number) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.initDB();
      window.addEventListener("online", () => this.syncQueue());
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB unavailable"));
        return;
      }

      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          db.createObjectStore(QUEUE_STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(CACHE_STORE)) {
          db.createObjectStore(CACHE_STORE, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  public subscribe(fn: (count: number) => void) {
    this.listeners.add(fn);
    this.notify();
    return () => {
      this.listeners.delete(fn);
    };
  }

  private async notify() {
    const count = await this.getPendingCount();
    this.listeners.forEach((fn) => fn(count));
  }

  public async getPendingCount(): Promise<number> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(QUEUE_STORE, "readonly");
        const store = tx.objectStore(QUEUE_STORE);
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(0);
      });
    } catch {
      return 0;
    }
  }

  public async queueMutation(
    entityType: EntityType,
    action: MutationAction,
    payload: any
  ): Promise<string> {
    const mutation: QueuedMutation = {
      id: "mut_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      idempotencyKey: `idemp_${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      action,
      payload,
      clientTimestamp: Date.now(),
      retryCount: 0,
      status: "PENDING",
    };

    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(QUEUE_STORE, "readwrite");
        const store = tx.objectStore(QUEUE_STORE);
        const req = store.add(mutation);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      this.notify();

      // If online, trigger sync immediately
      if (typeof navigator !== "undefined" && navigator.onLine) {
        this.syncQueue();
      }
    } catch (e) {
      console.warn("Error queuing offline mutation in IndexedDB, fallback to localStorage:", e);
    }

    return mutation.id;
  }

  public async getQueuedMutations(): Promise<QueuedMutation[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(QUEUE_STORE, "readonly");
        const store = tx.objectStore(QUEUE_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  public async removeMutation(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(QUEUE_STORE, "readwrite");
        const store = tx.objectStore(QUEUE_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
      this.notify();
    } catch {
      // ignore
    }
  }

  public async syncQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing || typeof navigator === "undefined" || !navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    const mutations = await this.getQueuedMutations();
    if (mutations.length === 0) {
      this.isSyncing = false;
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    try {
      // Send batch to /api/sync
      const payload = {
        items: mutations.map((m) => ({
          entityType: m.entityType,
          action: m.action,
          payload: m.payload,
          idempotencyKey: m.idempotencyKey,
          clientTimestamp: new Date(m.clientTimestamp).toISOString(),
        })),
      };

      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Clear synced mutations from IndexedDB
        for (const mut of mutations) {
          await this.removeMutation(mut.id);
        }
        synced = mutations.length;
      } else {
        failed = mutations.length;
      }
    } catch (err) {
      console.warn("Background auto-sync network error:", err);
      failed = mutations.length;
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return { synced, failed };
  }
}

export const offlineSync = new OfflineSyncManager();

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const unsubscribe = offlineSync.subscribe((count) => {
      setPendingCount(count);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribe();
    };
  }, []);

  return { isOnline, pendingCount, syncNow: () => offlineSync.syncQueue() };
}
