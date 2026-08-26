#!/usr/bin/env bash
set -e

echo "🌟 Building Celys Care Android Production Bundle..."

# 1. Install dependencies
npm install

# 2. Build Next.js server production bundle
npm run build

# 3. Add or sync Capacitor Android platform
if [ ! -d "android" ]; then
  npx cap add android
fi

npx cap sync android

echo "✅ Android Sync Complete. Open project in Android Studio via: npx cap open android"
