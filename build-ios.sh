#!/usr/bin/env bash
set -e

echo "🌟 Building Celys Care iOS Production Bundle..."

# 1. Install dependencies
npm install

# 2. Build Next.js static / export bundle
npm run build

# 3. Add or sync Capacitor iOS platform
if [ ! -d "ios" ]; then
  npx cap add ios
fi

npx cap sync ios

echo "✅ iOS Sync Complete. Open in Xcode via: npx cap open ios"
