---
id: 0004
title: Fixed-React-Hooks-Order-Error
stage: red
date: 2026-01-27
surface: agent
model: claude-sonnet-4-5-20250929
feature: 009-phase3-frontend-chatkit-integration
branch: phase3/frontend
user: unknown
command: /sp.phr
labels: ["react", "hooks", "chatkit", "error-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/ChatKit/ChatWidget.tsx
tests:
  - none
---

## Prompt

when i signup and come to the dashboard so i getting these 2 errors;

Error no 1:
Console Error

React has detected a change in the order of Hooks called by ChatWidget. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
1. useContext                 useContext
2. useState                   useState
3. useCallback                useCallback
4. useCallback                useCallback
5. useSyncExternalStore       useSyncExternalStore
6. useDebugValue              useDebugValue
7. useEffect                  useEffect
8. useState                   useState
9. useEffect                  useEffect
10. undefined                 useEffect
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Source
src/components/ChatKit/ChatWidget.tsx (27:12) @ useEffect

  25 |
  26 |   // Track session events
> 27 |   useEffect(() => {
     |            ^
  28 |     if (userId) {
  29 |       analyticsTracker.setUserId(userId);
  30 |     }
Show ignored frames

Error no 2:
Unhandled Runtime Error

Error: Rendered more hooks than during the previous render.

Source
src/components/ChatKit/ChatWidget.tsx (27:12) @ useEffect

  25 |
  26 |   // Track session events
> 27 |   useEffect(() => {
     |            ^
  28 |     if (userId) {
  29 |       analyticsTracker.setUserId(userId);
  30 |     }

## Response snapshot

Fixed the React Hooks order error in ChatWidget.tsx by moving the useEffect hook before the conditional return statement to ensure hooks are always called in the same order on every render.

## Outcome

- ✅ Impact: Fixed React Hooks order violation that was causing runtime errors
- 🧪 Tests: none
- 📁 Files: frontend/src/components/ChatKit/ChatWidget.tsx
- 🔁 Next prompts: none
- 🧠 Reflection: Hooks must always be called in the same order on every render, even when conditional rendering occurs later in the component.

## Evaluation notes (flywheel)

- Failure modes observed: React Hooks Rule violation when useEffect is called after conditional return
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
