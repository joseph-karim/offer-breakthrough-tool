#!/bin/bash

# Restore the original files from git
git checkout -- src/components/workshop/steps/Step04_TriggerEvents.tsx
git checkout -- src/components/workshop/steps/Step05_Jobs.tsx
git checkout -- src/components/workshop/steps/Step06_TargetBuyers.tsx
git checkout -- src/components/workshop/steps/Step07_Painstorming.tsx
git checkout -- src/components/workshop/steps/Step08_ProblemUp.tsx
git checkout -- src/components/workshop/steps/Step09_RefineIdea.tsx
git checkout -- src/components/workshop/steps/Step10_Summary.tsx

# Now let's manually remove the "Get AI Help" button from each file
for file in src/components/workshop/steps/Step0{4,5,6,7,8,9,10}_*.tsx; do
  echo "Processing $file..."
  
  # Remove the MessageSquare import
  sed -i '' 's/import { .*MessageSquare.* } from '\''lucide-react'\'';/import { AlertCircle, HelpCircle } from '\''lucide-react'\'';/' "$file"
  
  # Remove the showChat state
  sed -i '' 's/const \[showChat, setShowChat\] = useState(false);//g' "$file"
  
  # Remove the AI Help button and ChatInterface
  sed -i '' '/variant="ghost"/,/Hide AI Assistant/d' "$file"
  sed -i '' '/{showChat && (/,/)})/d' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
