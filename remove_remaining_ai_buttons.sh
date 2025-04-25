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
  
  # 1. Remove MessageSquare from imports
  sed -i '' 's/, MessageSquare//g' "$file"
  
  # 2. Remove showChat state
  sed -i '' 's/const \[showChat, setShowChat\] = useState(false);//g' "$file"
  
  # 3. Remove the AI Help button section
  sed -i '' '/display: .flex., justifyContent: .flex-end., marginBottom: .16px./,/Get AI Help/d' "$file"
  
  # 4. Remove the ChatInterface section
  sed -i '' '/{showChat && (/,/)})/d' "$file"
  
  # 5. Remove unused imports
  sed -i '' '/import { ChatInterface } from ..\\/chat\\/ChatInterface.;/d' "$file"
  sed -i '' '/import { STEP_QUESTIONS } from ..\\/..\\/..\\/..\\/services\\/aiService.;/d' "$file"
  sed -i '' '/import { AIService } from ..\\/..\\/..\\/..\\/services\\/aiService.;/d' "$file"
  
  # 6. Remove unused variables
  sed -i '' '/const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);/d' "$file"
  sed -i '' '/const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;/d' "$file"
  sed -i '' '/const aiService = new AIService({/,/});/d' "$file"
  sed -i '' '/const stepContext = `/,/`;/d' "$file"
  
  # 7. Clean up extra blank lines
  sed -i '' 's/      \/>\\n\\n\\n\\n      <Card/      \/>\\n\\n      <Card/g' "$file"
  sed -i '' 's/\\n\\n\\n\\n/\\n\\n/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
