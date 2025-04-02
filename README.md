# Offer Breakthrough Workshop Tool

This project is an interactive web application designed to guide users through the process of defining a scalable and marketable offer. It utilizes a step-by-step workshop format, enhanced by an AI assistant that provides suggestions and answers follow-up questions.

## Core Concept

The application leads users through a structured process, starting from defining anti-goals and trigger events to identifying target markets, problems, and finally, exploring potential offer solutions. The core interaction model is chat-based, allowing users to converse with an AI assistant at each step.

## Architecture

This application is built using:

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (via Shadcn UI components - implied)
- **State Management:** Zustand (`useWorkshopStore`)
- **AI Integration:** OpenAI API (via `openai` package)

### Key Components:

- **`StepX_...` Components:** Each step of the workshop has a dedicated component (e.g., `Step3_AntiGoals`, `Step11_Summary`).
- **`ChatInterface`:** The central component managing the chat UI, user input, message display, and interaction with the AI service.
- **`ChatMessage`:** Renders individual messages from the user or the AI assistant.
- **`SuggestionCard`:** Displays AI-generated suggestions with an option to accept.
- **`AIService`:** Handles communication with the OpenAI API. It constructs step-specific prompts, sends requests to OpenAI, parses responses (including structured JSON), and provides suggestions or answers follow-up questions.
- **`OpenAIService`:** A wrapper class for the `openai` library, providing methods for generating completions and structured JSON outputs.
- **`useWorkshopStore`:** A Zustand store managing the application's state, including the current step, all workshop data (anti-goals, jobs, markets, problems, offers, chat history), AI loading status, and session information.

### Data Flow:

1.  The user interacts with the `ChatInterface` for the current step.
2.  User messages are added to the `workshopStore`.
3.  When a question requires an AI response or suggestion, `ChatInterface` calls methods in `AIService`.
4.  `AIService` constructs appropriate prompts using context from `workshopStore` (chat history, workshop data) and sends requests to `OpenAIService`.
5.  `OpenAIService` interacts with the OpenAI API.
6.  `AIService` processes the response, potentially generating a `ChatSuggestion`.
7.  Suggestions are stored in `workshopStore` and displayed via `SuggestionCard`.
8.  Accepted suggestions update the relevant `workshopData` in the `workshopStore`.

## Workshop Steps

1.  Welcome
2.  Setup
3.  Anti-Goals
4.  Trigger Events
5.  Jobs to be Done
6.  Markets
7.  Problems
8.  Market Evaluation
9.  Offer Exploration
10. Pricing & Positioning (Placeholder)
11. **Summary & Action Plan:** Reviews the entire workshop output and helps the user plan concrete next steps for validation.

## Setup & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd offer-breakthrough-tool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure OpenAI API Key:**
    - Create a `.env.local` file in the project root.
    - Add your OpenAI API key:
      ```
      VITE_OPENAI_API_KEY=your_openai_api_key_here
      ```
    *Note: For security in a real application, API calls should ideally be proxied through a backend server.* 

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your browser to `http://localhost:5173` (or the port specified in the output).

## Planned Features / Next Steps

- Implement actual session saving/loading (e.g., using local storage or a backend).
- Refine AI prompts for better suggestions and responses.
- Implement Step 10 (Pricing & Positioning).
- Add more robust error handling.
- Enhance UI/UX based on user testing.
