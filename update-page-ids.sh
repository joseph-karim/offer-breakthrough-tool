#!/bin/bash

# This script updates the pageId fields in all content files to match our data-sb-object-id

# Step 1: Find all content files
CONTENT_FILES=$(find src/content/workshop -name "step*.json" | sort)

# Step 2: Update pageId in each file
for file in $CONTENT_FILES; do
  # Extract step number from filename
  filename=$(basename "$file")
  step_number="${filename%.*}"
  step_number="${step_number#step}"
  
  # Update pageId field
  sed -i '' -E "s/\"pageId\": \"[^\"]*\"/\"pageId\": \"step$step_number\"/" "$file"
  
  echo "Updated pageId in $file to step$step_number"
done

echo "Done updating pageId fields in content files"
