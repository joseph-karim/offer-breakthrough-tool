#!/bin/bash

# List of step files to update
STEP_FILES=(
  "src/components/workshop/steps/Step05_Jobs.tsx"
  "src/components/workshop/steps/Step06_TargetBuyers.tsx"
  "src/components/workshop/steps/Step07_Painstorming.tsx"
  "src/components/workshop/steps/Step08_ProblemUp.tsx"
  "src/components/workshop/steps/Step09_RefineIdea.tsx"
  "src/components/workshop/steps/Step10_Summary.tsx"
)

for file in "${STEP_FILES[@]}"; do
  echo "Processing $file..."

  # Fix closing tags and indentation
  perl -0777 -i -pe 's/        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\};/      <\/div>\n    <\/div>\n  \);\n\};/g' "$file"

  # Fix Card closing tags
  perl -0777 -i -pe 's/<\/Card>/<\/div>/g' "$file"

  # Fix isFieldEmpty regex
  perl -0777 -i -pe 's/isFieldEmpty\(S\+\)/isFieldEmpty\(\"[a-zA-Z]+\"\)/g' "$file"

  echo "Completed processing $file"
done

echo "All files updated successfully!"
