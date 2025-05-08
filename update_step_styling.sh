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
  
  # Extract step number from filename
  STEP_NUM=$(echo "$file" | grep -o 'Step[0-9]\+' | grep -o '[0-9]\+')
  
  # 1. Add stepStyles import
  sed -i '' '/import React/a\
import * as styles from '\''../../../styles/stepStyles'\'';' "$file"
  
  # 2. Remove StepHeader and Card imports
  sed -i '' '/import { StepHeader } from/d' "$file"
  sed -i '' '/import { Card } from/d' "$file"
  
  # 3. Replace the container div and StepHeader with our new styling
  perl -0777 -i -pe 's/<div style=\{\{ maxWidth: .800px., margin: .0 auto. \}\}>\s*<StepHeader\s*stepNumber=\{[0-9]+\}\s*title="([^"]+)"\s*description="([^"]+)"\s*\/>/    <div style={styles.stepContainerStyle}>\n      {\/\* Step indicator \*\/}\n      <div style={styles.stepHeaderContainerStyle}>\n        <div style={styles.stepNumberStyle}>\n          '$STEP_NUM'\n        <\/div>\n        <h2 style={styles.stepTitleStyle}>\n          \1\n        <\/h2>\n      <\/div>\n\n      {\/\* Description \*\/}\n      <div style={styles.stepDescriptionStyle}>\n        <p>\2<\/p>\n      <\/div>\n\n      {\/\* Main content area \*\/}\n      <div style={styles.contentContainerStyle}>/g' "$file"
  
  # 4. Replace Card component with our styling
  perl -0777 -i -pe 's/<Card variant="default" padding="lg" shadow="md" style=\{\{ marginBottom: .32px. \}\}>/        /g' "$file"
  
  # 5. Fix closing tags
  perl -0777 -i -pe 's/<\/Card>\s*<\/div>/<\/div>\n      <\/div>\n    <\/div>/g' "$file"
  
  # 6. Update form element styling
  perl -0777 -i -pe 's/style=\{\{\s*fontWeight: 600,\s*color: .#[0-9a-fA-F]+.,\s*display: .block.,\s*marginBottom: .8px.\s*\}\}/style={styles.labelStyle}/g' "$file"
  
  # 7. Update textarea styling
  perl -0777 -i -pe 's/style=\{\{\s*width: .100%.,\s*minHeight: .100px.,\s*padding: .12px.,\s*borderRadius: .8px.,\s*border: .1px solid.,\s*borderColor:[^}]+\}\}/style={isFieldEmpty\(\S+\) \? styles.errorTextareaStyle : styles.textareaStyle}/g' "$file"
  
  # 8. Update input styling
  perl -0777 -i -pe 's/style=\{\{\s*flex: 1,\s*padding: .12px.,\s*borderRadius: .8px.,\s*border: .1px solid #d1d5db.,\s*fontSize: .16px.,\s*backgroundColor: .white.,\s*\}\}/style={styles.inputStyle}/g' "$file"
  
  # 9. Update info box styling
  perl -0777 -i -pe 's/style=\{\{\s*padding: .12px 16px.,\s*backgroundColor: .#[a-zA-Z0-9]+.,\s*borderLeft: .4px solid #[a-zA-Z0-9]+.,\s*borderRadius: .0 8px 8px 0.,\s*color: .#[a-zA-Z0-9]+.,\s*display: .flex.,\s*alignItems: .center.,\s*fontSize: .14px.,\s*fontWeight: 500,\s*\}\}/style={styles.infoBoxStyle}/g' "$file"
  
  # 10. Update examples container styling
  perl -0777 -i -pe 's/style=\{\{\s*padding: .16px.,\s*backgroundColor: .#f9fafb.,\s*borderRadius: .8px.,\s*border: .1px dashed #d1d5db.\s*\}\}/style={styles.examplesContainerStyle}/g' "$file"
  
  # 11. Update form group styling
  perl -0777 -i -pe 's/style=\{\{ marginBottom: .24px. \}\}/style={styles.formGroupStyle}/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
