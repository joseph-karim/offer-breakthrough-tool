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
  
  # 1. Fix indentation in the return statement
  perl -0777 -i -pe 's/return \(\n        <div/return \(\n    <div/g' "$file"
  
  # 2. Fix list item styling
  perl -0777 -i -pe 's/style=\{\{\s*backgroundColor: .#f9fafb.,\s*borderRadius: .8px.,\s*border: .1px solid #e5e7eb.,/style=\{\{\n                    backgroundColor: '\''#F0F9FF'\'',\n                    borderRadius: '\''15px'\'',\n                    border: '\''1px solid #DDDDDD'\'',/g' "$file"
  
  # 3. Fix text color
  perl -0777 -i -pe 's/color: .#374151./color: '\''#333333'\''/g' "$file"
  
  # 4. Fix button styling
  perl -0777 -i -pe 's/style=\{\{ display: .flex., alignItems: .center., gap: .8px. \}\}/style=\{\{ display: '\''flex'\'', alignItems: '\''center'\'', gap: '\''8px'\'', backgroundColor: '\''#FFDD00'\'', color: '\''#222222'\'' \}\}/g' "$file"
  
  # 5. Fix examples styling
  perl -0777 -i -pe 's/<div style=\{styles.examplesContainerStyle\}>\s*<p style=\{\{[^}]+\}\}>\s*Example[^<]+<\/p>/<div style={styles.examplesContainerStyle}>\n              <div style={styles.examplesLabelStyle}>\n                EXAMPLES\n              <\/div>/g' "$file"
  
  # 6. Fix example list styling
  perl -0777 -i -pe 's/<ul style=\{\{\s*listStyle: .disc.,\s*paddingLeft: .24px.,\s*color: .#6b7280.,\s*fontSize: .14px.\s*\}\}>/<ul style={styles.examplesListStyle}>/g' "$file"
  
  # 7. Fix example list items
  perl -0777 -i -pe 's/<li>([^<]+)<\/li>/<li style={styles.exampleItemStyle}>\n                <span style={styles.exampleBulletStyle}>•<\/span>\n                \1\n              <\/li>/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
