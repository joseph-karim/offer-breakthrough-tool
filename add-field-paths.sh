#!/bin/bash

# This script adds data-sb-field-path attributes to titles and descriptions

# Step 1: Find all step components
STEP_FILES=$(find src/components/workshop/steps -name "*.tsx" | sort)

# Step 2: Add data-sb-field-path to titles and descriptions
for file in $STEP_FILES; do
  # Check if the file already has data-sb-field-path for title
  if ! grep -q "data-sb-field-path=\"title\"" "$file"; then
    # Find the h2 tag and add data-sb-field-path="title"
    sed -i '' -E "s/(<h2[^>]*)(>)/\\1 data-sb-field-path=\"title\"\\2/" "$file"
    echo "Added data-sb-field-path=\"title\" to $file"
  fi
  
  # Check if the file already has data-sb-field-path for description
  if ! grep -q "data-sb-field-path=\"description\"" "$file"; then
    # Find the description div and add data-sb-field-path="description"
    sed -i '' -E "s/(style=\\{[^}]*stepDescriptionStyle[^}]*\\})(>)/\\1 data-sb-field-path=\"description\"\\2/" "$file"
    echo "Added data-sb-field-path=\"description\" to $file"
  fi
done

echo "Done adding data-sb-field-path attributes to step components"
