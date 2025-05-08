#!/bin/bash

# List of step files to update
STEP_FILES=(
  "src/components/workshop/steps/Step02_BigIdea.tsx"
  "src/components/workshop/steps/Step04_TriggerEvents.tsx"
  "src/components/workshop/steps/Step05_Jobs.tsx"
  "src/components/workshop/steps/Step06_TargetBuyers.tsx"
  "src/components/workshop/steps/Step07_Painstorming.tsx"
  "src/components/workshop/steps/Step08_ProblemUp.tsx"
  "src/components/workshop/steps/Step09_RefineIdea.tsx"
  "src/components/workshop/steps/Step10_Summary.tsx"
)

for file in "${STEP_FILES[@]}"; do
  echo "Processing $file..."
  
  # 1. Remove MessageSquare from imports
  sed -i '' 's/MessageSquare, //g' "$file"
  sed -i '' 's/, MessageSquare//g' "$file"
  
  # 2. Remove showChat state
  sed -i '' 's/const \[showChat, setShowChat\] = useState(false);//g' "$file"
  
  # 3. Remove the AI Help button section
  sed -i '' '/display: .flex., justifyContent: .flex-end., marginBottom: .16px./,/Get AI Help/d' "$file"
  
  # 4. Remove the ChatInterface section
  sed -i '' '/{showChat && (/,/)})/d' "$file"
  
  # 5. Clean up extra blank lines
  sed -i '' 's/      \/>\\n\\n\\n\\n      <Card/      \/>\\n\\n      <Card/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
