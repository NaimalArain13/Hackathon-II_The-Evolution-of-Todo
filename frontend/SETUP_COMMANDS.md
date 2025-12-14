# Frontend Setup Commands

Run these commands in order in your terminal (PowerShell or CMD):

## TASK-002: ✅ COMPLETED
- All directories created
- tsconfig.json updated with path aliases
- Test file created at `src/lib/test-utils.ts`

## TASK-003: ✅ COMPLETED
- `.env.local` template created (you need to add your actual values)
- `.env.example` created
- `src/lib/env.ts` created for type-safe env access

## TASK-004: Install Core Dependencies

Run these commands one by one:

```powershell
# Navigate to frontend directory
cd "E:\Q4 extension\Hackathon 2k25\Hackathon II\frontend"

# Install state management
npm install zustand @tanstack/react-query @tanstack/react-query-devtools

# Install HTTP client and utilities
npm install axios js-cookie jwt-decode
npm install -D @types/js-cookie

# Install form libraries
npm install react-hook-form @hookform/resolvers zod

# Install animation library
npm install framer-motion

# Install icon library
npm install lucide-react

# Install date utilities
npm install date-fns

# Install authentication
npm install better-auth
```

**Note**: If you get PowerShell execution policy errors, you can:
1. Run PowerShell as Administrator and execute: `Set-ExecutionPolicy RemoteSigned`
2. Or use CMD instead of PowerShell
3. Or run commands directly in your terminal/IDE

## Next Steps After Dependencies

1. Update `.env.local` with your actual values:
   - `NEXT_PUBLIC_API_URL`: Your Hugging Face Space URL
   - `BETTER_AUTH_SECRET`: Must match backend secret

2. Continue with remaining tasks from `tasks.md`

