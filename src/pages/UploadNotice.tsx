import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud, File, X, Loader2, Bot, ArrowLeft } from 'lucide-react';

export function UploadNotice() {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatus('Initializing RAG Pipeline...');
    
    // Simulate multi-agent steps
    setTimeout(() => setStatus('Parser Agent: Extracting text & performing OCR...'), 1000);
    setTimeout(() => setStatus('Issue Spotter: Detecting notice type & sections...'), 2000);
    setTimeout(() => setStatus('Retrieval Agent: Searching legal vector database...'), 3500);
    setTimeout(() => setStatus('Report Generator: Synthesizing citations...'), 5000);

    const formData = new FormData();
    formData.append('file', file);
    if (questions) {
      formData.append('questions', questions);
    }

    try {
      const res = await fetch('/api/upload-notice', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.report) {
        // Import firestore inside function or at top
        const { db } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        const { useAuthStore } = await import('../store/useAuthStore');
        const user = useAuthStore.getState().user;
        
        if (user) {
          const reportToSave = {
            ...data.report,
            userId: user.id
          };
          await setDoc(doc(db, 'reports', data.report_id), reportToSave);
          navigate(`/dashboard/reports/${data.report_id}`);
        } else {
          console.error("User not logged in");
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Notice</h1>
        <p className="text-slate-500 mt-1">Upload a PDF of your GST or legal notice for AI analysis.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          {!isUploading ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer relative"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!file ? (
                <div className="space-y-4 pointer-events-none">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <UploadCloud className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900">Click or drag PDF here</p>
                    <p className="text-sm text-slate-500 mt-1">Maximum file size: 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <File className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 text-emerald-200 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Multi-Agent RAG in Progress</h3>
                <p className="text-emerald-600 font-medium animate-pulse">{status}</p>
              </div>
            </div>
          )}

          {file && !isUploading && (
            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Specific Questions (Optional)</label>
                <textarea 
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder="Ask any specific questions you have about this notice..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
                <Button variant="emerald" onClick={handleUpload}>Start AI Analysis</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
