#!/usr/bin/env node
/**
 * Optimize critical images (logo) to their actual display sizes
 * This addresses the 24,593 KiB image delivery issue
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public');

async function optimizeImage(inputPath, outputPath, width, height, quality = 85) {
  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'contain',
        withoutEnlargement: true,
      })
      .png({ quality, compressionLevel: 9 })
      .toFile(outputPath);
    
    const stats = await sharp(outputPath).metadata();
    const originalStats = await sharp(inputPath).metadata();
    
    const originalSize = originalStats.width * originalStats.height;
    const newSize = stats.width * stats.height;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Optimized ${inputPath}`);
    console.log(`  Original: ${originalStats.width}x${originalStats.height}`);
    console.log(`  Optimized: ${stats.width}x${stats.height} (${reduction}% reduction)`);
    
    return true;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🖼️  Optimizing critical images...\n');
  
  const optimizations = [
    {
      input: join(PUBLIC_DIR, 'logo.png'),
      output: join(PUBLIC_DIR, 'logo-optimized.png'),
      width: 240, // 2x for retina (actual display is ~120px)
      height: 80,  // 2x for retina (actual display is ~40px)
      quality: 90,
    },
    {
      input: join(PUBLIC_DIR, 'logo.png'),
      output: join(PUBLIC_DIR, 'logo-favicon.png'),
      width: 180, // For favicon/apple-touch-icon
      height: 180,
      quality: 90,
    },
  ];
  
  for (const opt of optimizations) {
    if (!existsSync(opt.input)) {
      console.log(`⚠️  Skipping ${opt.input} - file not found`);
      continue;
    }
    
    await optimizeImage(opt.input, opt.output, opt.width, opt.height, opt.quality);
  }
  
  console.log('\n✅ Critical image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review the optimized images');
  console.log('   2. Replace originals if quality is acceptable:');
  console.log('      mv public/logo-optimized.png public/logo.png');
  console.log('   3. Or update components to use optimized versions');
}

main().catch(console.error);

