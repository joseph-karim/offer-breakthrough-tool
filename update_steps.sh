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

# For each file, remove the MessageSquare import, showChat state, and the AI Help button
for file in "${STEP_FILES[@]}"; do
  echo "Processing $file..."
  
  # Remove MessageSquare from imports
  sed -i '' 's/import { .*MessageSquare.* } from '\''lucide-react'\'';/import { AlertCircle, HelpCircle } from '\''lucide-react'\'';/' "$file"
  
  # Remove showChat state
  sed -i '' 's/const \[showChat, setShowChat\] = useState(false);//' "$file"
  
  # Remove the AI Help button and ChatInterface
  sed -i '' '/variant="ghost"/,/ChatInterface/d' "$file"
  
  # Clean up any remaining closing braces from the removed code
  sed -i '' '/^      })/d' "$file"
  sed -i '' '/^        <\/Card>/d' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
