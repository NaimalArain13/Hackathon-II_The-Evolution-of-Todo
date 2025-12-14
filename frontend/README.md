# Frontend - Todo App

Modern Next.js 16+ application with TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand (client) + TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update `NEXT_PUBLIC_API_URL` and `BETTER_AUTH_SECRET` in `.env.local`

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── features/    # Feature-specific components
│   │   ├── layout/      # Layout components
│   │   └── providers/   # Context providers
│   ├── lib/             # Utilities and API client
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── store/           # Zustand stores
│   ├── services/         # API service layer
│   └── constants/       # App constants
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - TypeScript type checking

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | https://naimalcreativityai-sdd-todo-app.hf.space |
| BETTER_AUTH_SECRET | Shared auth secret (must match backend) | your-secret-key |
| BETTER_AUTH_URL | Frontend URL | http://localhost:3000 |

## Development Guide

### Using shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<Button variant="default">Click me</Button>
<Input type="email" placeholder="Email" />
```

### Making API Calls

```typescript
import { tasksApi } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['tasks', user_id],
  queryFn: () => tasksApi.getTasks(user_id),
});
```

### Using Authentication Store

```typescript
import { useAuthStore } from '@/store/auth-store';

const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
```

### Using Toast Notifications

```typescript
import { toast } from 'sonner';

toast.success('Task created!');
toast.error('Something went wrong');
```

## Design System

### Colors

- **Primary**: Cyan (#3ABEFF)
- **Danger**: Red/Coral (#FF6767)
- **Neutral**: Custom grays (#F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB, #000000)

### Typography

- **Font**: Inter
- **Scale**: 12px - 48px

See `tailwind.config.ts` for full design tokens.

## API Integration

The app uses a singleton Axios service with automatic JWT token injection. All API calls go through `src/services/api.ts` and typed helpers in `src/lib/api-client.ts`.

### Backend Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/profile`
- **Tasks**: `/api/{user_id}/tasks` (with query params for filtering/sorting)

See `src/lib/api-client.ts` for all available API methods.
