# Buyer Breakthrough Workshop Tool

This project is an interactive web application designed to guide users through the process of defining a scalable and marketable offer. It utilizes a step-by-step workshop format with validation feedback and clear guidance at each step.

## Core Concept

The application leads users through a structured process, starting from defining anti-goals and trigger events to identifying target markets, problems, and finally, exploring potential offer solutions. Each step includes validation feedback to ensure users provide the necessary information before proceeding.

## Architecture

This application is built using:

- **Frontend:** React + TypeScript + Vite
- **Styling:** Custom CSS-in-JS with modern design patterns
- **State Management:** Zustand (`useWorkshopStore`)
- **Validation:** Built-in form validation with visual feedback
- **UI Components:** Custom components with consistent styling

### Key Components:

- **`WorkshopWizard`:** The main component orchestrating the workshop flow and navigation
- **`StepX_...` Components:** Each step of the workshop has a dedicated component (e.g., `Step03_AntiGoals`, `Step11_Summary`)
- **`StepHeader`:** Consistent header component for each step
- **`Card`:** Reusable card component with various style variants
- **`Button`:** Custom button component with multiple variants and states
- **`SaveIndicator`:** Shows auto-save status for form inputs
- **`useWorkshopStore`:** A Zustand store managing the application's state, including step completion logic and data persistence

### Data Flow:

1. User interacts with step-specific forms and inputs
2. Changes trigger auto-save functionality
3. Step completion is validated before allowing progression
4. Workshop data is maintained in the Zustand store
5. Navigation between steps is managed by the WorkshopWizard

## Workshop Steps

1. **Welcome:** Introduction to the workshop and its goals
2. **Market Demand Analysis:** Understanding current market demand
3. **Anti-Goals:** Defining what to avoid in the business
4. **Trigger Events:** Identifying key moments that drive purchases
5. **Jobs to be Done:** Understanding customer motivations
6. **Markets:** Defining potential target markets
7. **Problems:** Identifying key pain points and challenges
8. **Market Evaluation:** Scoring and selecting target markets
9. **Value Proposition:** Defining unique value and benefits
10. **Pricing:** Determining pricing strategy and justification
11. **Summary:** Review and next steps

## Setup & Running

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd offer-breakthrough-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to `http://localhost:5173` (or the port specified in the output).

## Features

### Implemented:
- Complete workshop flow with 11 steps
- Form validation with visual feedback
- Auto-saving functionality
- Progress tracking
- Modern, responsive UI
- Step completion validation
- Market evaluation scoring system
- Value proposition builder
- User authentication with Supabase
- Session persistence with database storage
- User dashboard for managing workshop sessions

### Planned Features / Next Steps:
- Add example suggestions for each step
- Enhance error handling and validation messages
- Add export functionality for workshop results
- Add collaborative features
- Enhance accessibility
- Add comprehensive testing suite
