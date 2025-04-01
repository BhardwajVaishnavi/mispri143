// This script compiles and runs the TypeScript script to update existing products
const { execSync } = require('child_process');
const path = require('path');

// Compile the TypeScript file
console.log('Compiling TypeScript file...');
execSync('npx tsc scripts/update-existing-products.ts --esModuleInterop --target es2020 --module commonjs --outDir scripts/dist');

// Run the compiled JavaScript file
console.log('Running script to update existing products...');
execSync('node scripts/dist/update-existing-products.js', { stdio: 'inherit' });

console.log('Script execution completed.');
