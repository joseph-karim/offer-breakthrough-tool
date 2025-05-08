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
  
  # Create a backup of the file
  cp "$file" "${file}.bak"
  
  # Remove the "Get AI Help" button section
  # This pattern looks for a div with display: 'flex', justifyContent: 'flex-end' that contains a Button with MessageSquare
  # and removes it along with the following showChat conditional section
  perl -0777 -i -pe 's/<div style=\{\{ display: .flex., justifyContent: .flex-end.[\s\S]*?MessageSquare[\s\S]*?<\/Button>\n\s*<\/div>\n\n\s*\{showChat[\s\S]*?<\/Card>\n\s*\}\)//g' "$file"
  
  # Remove the showChat state
  perl -0777 -i -pe 's/const \[showChat, setShowChat\] = useState\(false\);//g' "$file"
  
  # Remove the MessageSquare import
  perl -0777 -i -pe 's/, MessageSquare//g' "$file"
  perl -0777 -i -pe 's/MessageSquare, //g' "$file"
  
  echo "Completed processing $file"
done

echo "All files updated successfully!"
