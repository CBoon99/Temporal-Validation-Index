#!/bin/bash

echo "========================================="
echo "TVI Platform → GitHub Push Helper"
echo "========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  echo "✓ Git initialized"
else
  echo "✓ Git already initialized"
fi

echo ""
echo "Files to be committed:"
echo "----------------------------------------"

# Show what will be tracked
git add -n . 2>/dev/null | head -20
echo "... (and more)"

echo ""
echo "Checking for secrets..."
echo "----------------------------------------"

# Check .env is ignored
if [ -f ".env" ]; then
  if git check-ignore .env > /dev/null 2>&1; then
    echo "✓ .env is properly ignored"
  else
    echo "⚠️  WARNING: .env is NOT ignored! Add it to .gitignore"
    exit 1
  fi
fi

# Check for exposed keys
if grep -r "eyJ" . --exclude-dir=node_modules --exclude=".env*" --include="*.js" --include="*.html" > /dev/null 2>&1; then
  echo "⚠️  WARNING: Possible API keys found in tracked files!"
  echo "Review files before pushing."
  exit 1
else
  echo "✓ No exposed secrets detected"
fi

echo ""
echo "========================================="
echo "Ready to commit!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Review files to commit:"
echo "   git status"
echo ""
echo "2. Add all files:"
echo "   git add ."
echo ""
echo "3. Commit with message:"
echo '   git commit -m "Initial commit: TVI Platform v1.0.1 - Production SaaS"'
echo ""
echo "4. Add your GitHub remote:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/tvi-platform.git"
echo ""
echo "5. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "========================================="
echo ""
echo "Or run this one-liner (after creating GitHub repo):"
echo ""
echo 'git add . && git commit -m "Initial commit: TVI Platform v1.0.1" && git remote add origin YOUR-REPO-URL && git push -u origin main'
echo ""


