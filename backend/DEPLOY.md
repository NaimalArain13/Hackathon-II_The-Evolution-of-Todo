# Deploying to Hugging Face Spaces

This guide will help you deploy the Todo App Backend to Hugging Face Spaces.

## Prerequisites

1. Hugging Face account with access token
2. PostgreSQL database (e.g., Neon PostgreSQL)
3. Git installed

## Step 1: Clone the Hugging Face Space

```bash
# Clone the space repository
git clone https://huggingface.co/spaces/NaimalcreativityAI/sdd-todo-app

# Navigate to the cloned directory
cd sdd-todo-app
```

## Step 2: Copy Backend Files

Copy all files from the `backend` folder to the cloned space directory:

```bash
# From the project root
cp -r backend/* sdd-todo-app/
```

Or manually copy these files:
- `app.py`
- `main.py`
- `Dockerfile`
- `requirements.txt`
- `README.md`
- `db.py`
- `models.py`
- All folders: `lib/`, `middleware/`, `routes/`, `schemas/`

## Step 3: Set Environment Variables (Secrets)

Go to your Hugging Face Space settings and add these secrets:

1. **DATABASE_URL**: Your PostgreSQL connection string
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

2. **BETTER_AUTH_SECRET**: JWT secret key (generate a strong random string)
   ```bash
   # Generate a secure secret (256-bit)
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **SPACE_ID** (optional): Your space ID for CORS
   ```
   NaimalcreativityAI/sdd-todo-app
   ```

4. **ALLOW_ALL_ORIGINS** (optional): Set to "true" for testing
   ```
   true
   ```

## Step 4: Commit and Push

```bash
# Add all files
git add .

# Commit changes
git commit -m "Deploy Todo App Backend API"

# Push to Hugging Face
git push
```

## Step 5: Verify Deployment

1. Wait for the Space to build (usually 2-5 minutes)
2. Check the logs in the Space interface
3. Visit your Space URL: `https://NaimalcreativityAI-sdd-todo-app.hf.space`
4. Test the API:
   - Health check: `GET /`
   - API docs: `GET /docs`

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check logs in Hugging Face Space interface

### Database Connection Error
- Verify DATABASE_URL is set correctly in secrets
- Check database allows connections from Hugging Face IPs
- Ensure SSL mode is set in connection string

### CORS Errors
- Set SPACE_ID environment variable
- Or set ALLOW_ALL_ORIGINS=true for testing

### Port Issues
- Ensure app listens on port 7860 (already configured in Dockerfile)

## API Documentation

Once deployed, access:
- Swagger UI: `https://your-space.hf.space/docs`
- ReDoc: `https://your-space.hf.space/redoc`

