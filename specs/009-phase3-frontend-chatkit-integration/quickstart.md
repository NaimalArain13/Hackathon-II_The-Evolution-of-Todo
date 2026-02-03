# Quickstart: ChatKit Frontend Integration

## Prerequisites

1. **Development Environment**
   - Node.js v18.17+ installed
   - pnpm installed globally (`npm install -g pnpm`)
   - Git installed for version control

2. **Backend Services**
   - Backend API running on http://localhost:8000 (or configured endpoint)
   - Backend authentication service operational
   - Chat API endpoints available at `/api/{user_id}/chat`

3. **Frontend Environment**
   - Next.js 14+ configured in `frontend/` directory
   - Existing authentication integration with Better Auth

## Installation Steps

### 1. Install Dependencies
```bash
cd frontend/
pnpm install @openai/chatkit-react
```

### 2. Environment Configuration
Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/api/ws  # if needed
```

### 3. Component Setup
Create the main chat widget component:

```typescript
// frontend/src/components/ChatKit/ChatWidget.tsx
'use client';

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { useSession } from "@/lib/auth-client";

export function ChatWidget() {
  const { data: session } = useSession();

  const { control } = useChatKit({
    api: {
      url: `${process.env.NEXT_PUBLIC_CHAT_API_URL}/${session?.user?.id}/chat`,
      fetch: async (input, init) => {
        const token = session?.session?.token || '';
        return fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        });
      },
    },
    theme: {
      colorScheme: "light",
    },
    header: {
      enabled: true,
      title: { text: "AI Task Assistant" },
    },
    composer: {
      placeholder: "Ask me to help manage your tasks...",
    },
  });

  return <ChatKit control={control} className="h-[500px] w-[380px]" />;
}
```

### 4. Integration into Layout
Add the floating widget to your main layout:

```tsx
// Example integration in your layout
import { ChatWidget } from '@/components/ChatKit/ChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

## Usage Examples

### Basic Usage
After installation, the chat widget will automatically appear in the bottom-right corner. Users can:
1. Click the floating button to expand the chat interface
2. Type natural language commands like "I need to buy groceries" to create tasks
3. Switch between conversations using the sidebar
4. Close the widget to return to the main application

### Natural Language Commands
The AI agent understands various commands:
- "Create a task to buy groceries" - Creates a new task
- "Show me my tasks" - Lists existing tasks
- "Mark the report task as complete" - Completes a task
- "Delete my old task" - Removes a task

## Testing

### 1. Component Testing
```bash
# Run component tests
cd frontend/
pnpm test:unit --watch
```

### 2. Integration Testing
```bash
# Test API integration
cd frontend/
pnpm test:integration
```

### 3. Manual Testing
1. Start the frontend: `pnpm dev`
2. Start the backend: `uvicorn main:app --reload --port 8000`
3. Open the application in a browser
4. Verify the chat widget appears and is functional
5. Test basic messaging and task creation

## Troubleshooting

### Widget Not Appearing
- Verify you've added the component to your layout
- Check that authentication is working properly
- Ensure environment variables are configured

### Authentication Issues
- Verify JWT tokens are properly passed in API requests
- Check that the backend API is returning proper authentication errors

### API Connection Problems
- Confirm the backend is running and accessible
- Verify the API endpoint URLs in environment variables
- Check that the user ID is being properly substituted in URL paths

## Development Commands

```bash
# Install dependencies
pnpm install @openai/chatkit-react

# Run frontend in development mode
pnpm dev

# Run tests
pnpm test
pnpm test:unit
pnpm test:integration

# Build for production
pnpm build
```