"""File upload and management endpoints."""

import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile

router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "uploads")
ALLOWED_TYPES = {"image/png", "image/jpeg", "image/gif", "application/pdf", "text/plain"}
MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("/upload")
async def upload_file(file: UploadFile) -> dict:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds maximum size of 10MB")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "file")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(content)
    return {"filename": filename, "size": len(content), "content_type": file.content_type}


@router.get("/{filename}")
async def get_file(filename: str) -> dict:
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return {"filename": filename, "size": os.path.getsize(path)}
