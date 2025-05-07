#!/bin/bash

# List of step files to update
STEP_FILES=(
  "src/components/workshop/steps/Step06_TargetBuyers.tsx"
  "src/components/workshop/steps/Step07_Painstorming.tsx"
  "src/components/workshop/steps/Step08_ProblemUp.tsx"
  "src/components/workshop/steps/Step09_RefineIdea.tsx"
  "src/components/workshop/steps/Step10_Summary.tsx"
)

for file in "${STEP_FILES[@]}"; do
  echo "Processing $file..."
  
  # Extract step number from filename
  STEP_NUM=$(echo "$file" | grep -o 'Step[0-9]\+' | grep -o '[0-9]\+')
  
  # Fix the return statement indentation
  sed -i '' 's/return (/return (/g' "$file"
  sed -i '' 's/return (.*$/return (/g' "$file"
  sed -i '' '/return (/a\\
    <div style={styles.stepContainerStyle}>' "$file"
  
  # Fix the closing tags
  sed -i '' 's/      <\/div>$/      <\/div>\
    <\/div>\
  );/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
