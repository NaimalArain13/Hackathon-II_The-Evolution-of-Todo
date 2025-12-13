# Hugging Face Spaces Dockerfile for FastAPI Backend
# Based on: https://huggingface.co/docs/hub/spaces-sdks-docker

FROM python:3.13-slim

# Create user for security
RUN useradd -m -u 1000 user

# Switch to user
USER user

# Set PATH
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY --chown=user ./requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy all application files
COPY --chown=user . /app

# Expose port 7860 (required by Hugging Face Spaces)
EXPOSE 7860

# Run uvicorn on port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

