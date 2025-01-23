#!/bin/bash

# Change to parent directory
cd "$(dirname "$0")/.."

# Extract version from manifest.json
version=$(grep '"version"' manifest.json | cut -d'"' -f4)

# Create zip file name with version
zipname="SeamlessAadSsoForEdge_v${version}.zip"

# Remove any existing zip files
echo "Cleaning up old packages..."
rm -f SeamlessAadSsoForEdge*.zip

# Create temporary file list and exclude unwanted files
echo "Creating package list..."
find . -maxdepth 1 \( \
    -name "*.json" -o \
    -name "*.js" -o \
    -name "*.md" -o \
    -name "LICENSE" \
    \) -type f \
    ! -path "./tools/*" \
    ! -name ".DS_Store" \
    -print0 | xargs -0 zip "$zipname"

# Then add image files, excluding screenshots directory
find ./images -maxdepth 1 \
    -type f \
    ! -path "*/screenshots/*" \
    ! -name ".DS_Store" \
    -print0 | xargs -0 zip -u "$zipname"

echo
echo "Package created successfully: $zipname"
echo