const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createSplash(width, height, isLandscape = false) {
  const profilePath = path.join(__dirname, '../public/images/profile.jpg');
  
  // Calculate emblem size: about 32% of min dimension
  const minDim = Math.min(width, height);
  const emblemSize = Math.max(120, Math.round(minDim * 0.32));
  
  // Create circular masked emblem with golden border glow
  const emblemRaw = await sharp(profilePath)
    .resize(emblemSize, emblemSize)
    .toBuffer();
    
  // Circle mask
  const circleSvg = Buffer.from(`
    <svg width="${emblemSize}" height="${emblemSize}">
      <circle cx="${emblemSize / 2}" cy="${emblemSize / 2}" r="${emblemSize / 2 - 2}" fill="#fff" />
    </svg>
  `);
  
  const circularEmblem = await sharp(emblemRaw)
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Typography & glow overlay as SVG
  const centerX = width / 2;
  const centerY = height / 2 - (isLandscape ? 10 : Math.round(height * 0.04));
  const emblemTop = Math.round(centerY - emblemSize / 2);
  const emblemLeft = Math.round(centerX - emblemSize / 2);
  
  const titleFontSize = Math.max(16, Math.round(minDim * 0.055));
  const subFontSize = Math.max(9, Math.round(minDim * 0.024));
  const textTop = emblemTop + emblemSize + Math.max(16, Math.round(minDim * 0.04));
  
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="${(centerY / height) * 100}%" r="60%">
          <stop offset="0%" stop-color="#2a114f" stop-opacity="0.85" />
          <stop offset="35%" stop-color="#1b0a38" stop-opacity="0.9" />
          <stop offset="70%" stop-color="#0d0a1e" stop-opacity="1" />
          <stop offset="100%" stop-color="#070512" stop-opacity="1" />
        </radialGradient>
        
        <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f5d76e" stop-opacity="0.4" />
          <stop offset="40%" stop-color="#c9a227" stop-opacity="0.25" />
          <stop offset="70%" stop-color="#7c3aed" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
        </radialGradient>

        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5d76e" />
          <stop offset="50%" stop-color="#e6c35c" />
          <stop offset="100%" stop-color="#c9a227" />
        </linearGradient>

        <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Deep cosmic background -->
      <rect width="${width}" height="${height}" fill="url(#bgGlow)" />

      <!-- Golden aura behind emblem -->
      <circle cx="${centerX}" cy="${centerY}" r="${emblemSize * 0.75}" fill="url(#emblemGlow)" />

      <!-- Concentric Golden Border around emblem -->
      <circle cx="${centerX}" cy="${centerY}" r="${emblemSize / 2 + 1}" fill="none" stroke="#f5d76e" stroke-width="2.5" opacity="0.85" />
      <circle cx="${centerX}" cy="${centerY}" r="${emblemSize / 2 + 4}" fill="none" stroke="#c9a227" stroke-width="1" opacity="0.4" />

      <!-- Title: CELYS CARE -->
      <text
        x="${centerX}"
        y="${textTop}"
        font-family="Cinzel, Georgia, 'Times New Roman', serif"
        font-size="${titleFontSize}px"
        font-weight="700"
        letter-spacing="${Math.round(titleFontSize * 0.15)}px"
        fill="url(#goldText)"
        text-anchor="middle"
        filter="url(#goldShadow)"
      >
        CELYS CARE
      </text>

      <!-- Subtitle: SANCTUARY FOR THE SOUL -->
      <text
        x="${centerX}"
        y="${textTop + titleFontSize + Math.max(10, Math.round(minDim * 0.025))}"
        font-family="'Plus Jakarta Sans', Inter, -apple-system, sans-serif"
        font-size="${subFontSize}px"
        font-weight="500"
        letter-spacing="${Math.round(subFontSize * 0.3)}px"
        fill="#c9a227"
        opacity="0.85"
        text-anchor="middle"
      >
        ✦ SANCTUARY FOR THE SOUL ✦
      </text>
    </svg>
  `);

  return sharp(svgOverlay)
    .composite([
      { input: circularEmblem, left: emblemLeft, top: emblemTop }
    ])
    .png()
    .toBuffer();
}

async function run() {
  console.log('✨ Generating Celys Care native & mobile splash screens...');
  
  const androidTargets = [
    { dir: 'drawable', w: 1080, h: 1920, land: false },
    { dir: 'drawable-port-mdpi', w: 320, h: 480, land: false },
    { dir: 'drawable-port-hdpi', w: 480, h: 800, land: false },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280, land: false },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600, land: false },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920, land: false },
    { dir: 'drawable-land-mdpi', w: 480, h: 320, land: true },
    { dir: 'drawable-land-hdpi', w: 800, h: 480, land: true },
    { dir: 'drawable-land-xhdpi', w: 1280, h: 720, land: true },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960, land: true },
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280, land: true },
  ];

  const resBase = path.join(__dirname, '../android/app/src/main/res');

  for (const t of androidTargets) {
    const outDir = path.join(resBase, t.dir);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'splash.png');
    const buf = await createSplash(t.w, t.h, t.land);
    await sharp(buf).png({ compressionLevel: 8 }).toFile(outFile);
    console.log(`  ✓ Android: ${t.dir}/splash.png (${t.w}x${t.h})`);
  }

  // iOS Targets
  const iosDir = path.join(__dirname, '../ios/App/App/Assets.xcassets/Splash.imageset');
  if (fs.existsSync(iosDir)) {
    const iosBuf = await createSplash(2732, 2732, false);
    for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
      await sharp(iosBuf).png({ compressionLevel: 8 }).toFile(path.join(iosDir, name));
      console.log(`  ✓ iOS: ${name} (2732x2732)`);
    }
  }

  // Also save a web fallback splash in public/images/splash.png
  const webSplash = await createSplash(1080, 1920, false);
  await sharp(webSplash).png({ compressionLevel: 8 }).toFile(path.join(__dirname, '../public/images/splash.png'));
  console.log('  ✓ Web/PWA: public/images/splash.png (1080x1920)');

  console.log('🌟 All splash screens generated with perfection!');
}

run().catch(err => {
  console.error('Error generating splash:', err);
  process.exit(1);
});
