---
title: Todo App Backend API
emoji: 📝
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Todo App Backend API

FastAPI backend for Todo application with JWT authentication and PostgreSQL database.

## Features

- 🔐 JWT-based authentication
- 📝 Task CRUD operations
- 🎯 Task priorities and categories
- 🔍 Search and filtering
- 📊 Sorting capabilities

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks` - List tasks (with filters)
- `GET /api/{user_id}/tasks/{task_id}` - Get task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

## Environment Variables

Set these in Hugging Face Space secrets:

- `DATABASE_URL` - PostgreSQL connection string (required)
- `BETTER_AUTH_SECRET` - JWT secret key (required, 256-bit recommended)
- `ALLOW_ALL_ORIGINS` - Set to "true" to allow all origins (default: "true", optional)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins if ALLOW_ALL_ORIGINS=false (optional)

## Documentation

API documentation available at `/docs` endpoint when the Space is running.
