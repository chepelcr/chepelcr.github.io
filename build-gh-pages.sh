#!/bin/bash

echo "🚀 Building portfolio for GitHub Pages..."

# Clean previous build
rm -rf dist/gh-pages

# Build the project using the standard vite build but with base path
cd client
npx vite build --outDir ../dist/gh-pages --base /portfolio/ --emptyOutDir

echo "✅ Build completed!"
echo "📁 Build files are in: dist/gh-pages"
echo ""
echo "🔗 To deploy to GitHub Pages:"
echo "1. Create a new repository named 'portfolio' on GitHub"
echo "2. Push this code to the main branch"
echo "3. Enable GitHub Pages in repository settings"
echo "4. Set source to 'GitHub Actions'"
echo "5. The site will be available at: https://yourusername.github.io/portfolio"