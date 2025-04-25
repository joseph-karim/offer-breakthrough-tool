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
  
  # Remove MessageSquare from imports
  sed -i '' 's/import { .*MessageSquare.* } from '\''lucide-react'\'';/import { HelpCircle, Info, X, Plus, Target, ArrowRight, Download, ExternalLink } from '\''lucide-react'\'';/' "$file"
  
  # Remove showChat state
  sed -i '' 's/const \[showChat, setShowChat\] = useState(false);//g' "$file"
  
  # Remove the AI Help button and ChatInterface
  sed -i '' '/variant="ghost"/,/Get AI Help/d' "$file"
  sed -i '' '/{showChat && (/,/)})/d' "$file"
  
  # Clean up extra blank lines
  sed -i '' 's/      \/>\\n\\n\\n\\n      <Card/      \/>\\n\\n      <Card/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
