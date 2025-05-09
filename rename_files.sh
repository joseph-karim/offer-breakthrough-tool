#!/bin/bash

# Navigate to the project directory
cd /Users/josephkarim/Desktop/offer-breakthrough-tool/offer-breakthrough-tool

# Create a backup directory
mkdir -p src/components/workshop/steps/backup

# Rename files to the new naming convention
mv src/components/workshop/steps/Step01_Intro.tsx src/components/workshop/steps/Intro_LandingPage.tsx
mv src/components/workshop/steps/Step02_BigIdea.tsx src/components/workshop/steps/Step01_BigIdea.tsx
mv src/components/workshop/steps/Step03_UnderlyingGoal.tsx src/components/workshop/steps/Step02_UnderlyingGoal.tsx
mv src/components/workshop/steps/Step04_TriggerEvents.tsx src/components/workshop/steps/Step03_TriggerEvents.tsx
mv src/components/workshop/steps/Step05_Jobs.tsx src/components/workshop/steps/Step04_Jobs.tsx
mv src/components/workshop/steps/Step06_TargetBuyers.tsx src/components/workshop/steps/Step05_TargetBuyers.tsx
mv src/components/workshop/steps/Step07_Painstorming.tsx src/components/workshop/steps/Step06_Painstorming.tsx
mv src/components/workshop/steps/Step08_ProblemUp.tsx src/components/workshop/steps/Step07_ProblemUp.tsx
# Step08_TargetMarket.tsx is already correctly named
# Step09_RefineIdea.tsx is already correctly named
# Step10_Summary.tsx is already correctly named

# Move backup files to the backup directory
mv src/components/workshop/steps/*.bak src/components/workshop/steps/backup/

echo "Files renamed successfully!"
