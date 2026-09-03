const sharp = require('sharp');
const path = require('path');

async function generatePerfectLogo() {
  const sourcePath = 'C:/Users/mayan/.gemini/antigravity-ide/brain/7ee1ad40-6e4e-4512-825b-7c9ce3ab2198/.user_uploaded/media_1788434898516.jpg';
  
  // Scale 0.9345 provides exactly 20% outer padding (200px on 1000px canvas)
  // Perfectly balanced: not too small, not too zoomed in
  const scale = 600 / 642; // ~0.93458
  const scaledW = Math.round(941 * scale); // 879
  const scaledH = Math.round(689 * scale); // 644
  
  const resized = await sharp(sourcePath)
    .resize(scaledW, scaledH)
    .toBuffer();
    
  // Perfect mathematical center:
  // Original center: X = 474.5, Y = 363.0
  // Target on 1000x1000: (500, 500)
  const left = Math.round(500 - 474.5 * scale); // 56
  const top = Math.round(500 - 363.0 * scale);   // 161
  
  // Soft feather on outer 10px edges for seamless blend
  const feather = 10;
  const mask = Buffer.alloc(scaledW * scaledH);
  for (let y = 0; y < scaledH; y++) {
    for (let x = 0; x < scaledW; x++) {
      const d = Math.min(x, scaledW - 1 - x, y, scaledH - 1 - y);
      mask[y * scaledW + x] = d < feather ? Math.round(255 * (d / feather)) : 255;
    }
  }
  
  const feathered = await sharp(resized)
    .ensureAlpha()
    .composite([{
      input: await sharp(mask, { raw: { width: scaledW, height: scaledH, channels: 1 } }).png().toBuffer(),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();
    
  // 1000x1000 Deep Cosmic Background
  const svgBg = `
    <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e0d46" />
          <stop offset="35%" stop-color="#12062b" />
          <stop offset="65%" stop-color="#090318" />
          <stop offset="85%" stop-color="#05020f" />
          <stop offset="100%" stop-color="#030108" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#cosmicGlow)" />
    </svg>
  `;
  
  const canvas = await sharp(Buffer.from(svgBg)).png().toBuffer();
  const outputPath = path.join(__dirname, '../public/images/profile.jpg');
  
  await sharp(canvas)
    .composite([{ input: feathered, left, top }])
    .jpeg({ quality: 98 })
    .toFile(outputPath);
    
  // Verification
  const { data, info } = await sharp(outputPath).raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  let maxDist = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if ((r > 110 && g > 85 && r > b * 1.05) || (r > 150 && g > 150)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        const d = Math.sqrt((x - 500)**2 + (y - 500)**2);
        if (d > maxDist) maxDist = d;
      }
    }
  }
  
  console.log('20% Outer Padding Verified Result:', {
    minX, maxX, width: maxX - minX,
    minY, maxY, height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    topPadding: minY,
    topPaddingPct: (minY / 10).toFixed(1) + '%',
    bottomPadding: 1000 - maxY,
    bottomPaddingPct: ((1000 - maxY) / 10).toFixed(1) + '%',
    leftPadding: minX,
    rightPadding: 1000 - maxX,
    maxDistFromCenter: Math.round(maxDist),
    marginToCircleEdge: Math.round(500 - maxDist)
  });
}

generatePerfectLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
