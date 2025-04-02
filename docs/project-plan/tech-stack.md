# Technical Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Vitest + React Testing Library

## Backend & Data
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Phase 6)
- **AI Integration**: OpenAI API

## Infrastructure
- **Hosting**: Netlify
- **Functions**: Netlify Functions (for AI integration)
- **CI/CD**: Netlify + GitHub Actions

## Development Tools
- **Version Control**: Git
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript
- **Package Management**: npm

## Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.x",
    "@supabase/supabase-js": "^2.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

## Database Schema

### workshop_sessions Table
```sql
CREATE TABLE public.workshop_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  current_step integer DEFAULT 1 NOT NULL,
  workshop_data jsonb NULL
);
```

## Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (Netlify Function Environment)
OPENAI_API_KEY=your_openai_api_key
```

## Project Structure
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── shared/
│   ├── layout/
│   └── workshop/
│       ├── steps/
│       └── bots/
├── hooks/
├── services/
├── store/
├── types/
└── utils/
``` 