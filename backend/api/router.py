from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
from backend.services.ai_service import process_notice_pipeline

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/auth/login")
def login(user: UserLogin):
    # Integration with Supabase Auth goes here
    return {"token": "fake-jwt-token", "user": {"email": user.email}}

@router.post("/upload-notice")
async def upload_notice(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save file to Supabase Storage in production
    content = await file.read()
    
    # Trigger Multi-Agent Pipeline
    report_id = process_notice_pipeline(content, file.filename)
    
    return {"success": True, "report_id": report_id, "message": "Notice processed successfully."}

@router.get("/reports/{report_id}")
def get_report(report_id: str):
    # Fetch from Supabase
    pass

@router.get("/recommended-lawyers")
def get_lawyers():
    # Fetch matching lawyers from Supabase
    pass
