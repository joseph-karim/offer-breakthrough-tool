#!/bin/bash

# This script adds data-sb-object-id attributes to all step components

# Step 1: Find all step components
STEP_FILES=$(find src/components/workshop/steps -name "*.tsx" | sort)

# Step 2: Add data-sb-object-id to each component
for file in $STEP_FILES; do
  # Extract step number from filename
  filename=$(basename "$file")
  if [[ $filename == Intro* ]]; then
    step_id="intro"
  elif [[ $filename =~ Step([0-9]+)_ ]]; then
    step_number="${BASH_REMATCH[1]}"
    step_id="step$step_number"
  else
    continue
  fi
  
  # Check if the file already has data-sb-object-id
  if grep -q "data-sb-object-id" "$file"; then
    echo "Skipping $file - already has data-sb-object-id"
    continue
  fi
  
  # Find the main container div and add data-sb-object-id
  sed -i '' -E "s/(return \\([[:space:]]*<div[^>]*)(>)/\\1 data-sb-object-id=\"$step_id\"\\2/" "$file"
  
  echo "Added data-sb-object-id=\"$step_id\" to $file"
done

echo "Done adding data-sb-object-id attributes to step components"
