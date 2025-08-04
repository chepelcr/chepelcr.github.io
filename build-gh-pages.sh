#!/bin/bash

echo "🚀 Building portfolio for GitHub Pages..."

# Clean previous build
rm -rf dist/gh-pages

# Build the project using the standard vite build
npx vite build
mkdir -p dist/gh-pages
cp -r dist/public/* dist/gh-pages/
cp client/public/CNAME dist/gh-pages/

echo "✅ Build completed!"
echo "📁 Build files are in: dist/gh-pages"
echo ""
echo "🔗 To deploy to GitHub Pages:"
echo "1. Push this code to your chepelcr.github.io repository"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'GitHub Actions'"
echo "4. The site will be available at: https://jcampos.dev/"