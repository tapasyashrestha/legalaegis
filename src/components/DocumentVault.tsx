import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { FileText, Upload, Download, Loader2 } from 'lucide-react';
import { SharedDocument, User } from '../types';

interface DocumentVaultProps {
  invitationId: string;
  currentUser: User;
}

export function DocumentVault({ invitationId, currentUser }: DocumentVaultProps) {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
      
      const q = query(
        collection(db, 'invitations', invitationId, 'documents'),
        orderBy('timestamp', 'desc')
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        setDocuments(snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as any)));
        setIsLoading(false);
      });
    };
    init();

    return () => unsubscribe();
  }, [invitationId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaded_by_id', currentUser.id);
    formData.append('uploaded_by_name', currentUser.name);

    try {
      const res = await fetch(`/api/invitations/${invitationId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.document) {
          const { db } = await import('../lib/firebase');
          const { collection, addDoc } = await import('firebase/firestore');
          const { id, ...docData } = data.document; // remove server generated id to let firestore generate one
          await addDoc(collection(db, 'invitations', invitationId, 'documents'), docData);
        }
      }
    } catch (err) {
      console.error('Failed to upload document', err);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-emerald-600" />
            Document Vault
          </CardTitle>
          <div>
            <input
              type="file"
              id={`upload-doc-${invitationId}`}
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor={`upload-doc-${invitationId}`}>
              <Button variant="emerald" size="sm" asChild className="cursor-pointer" disabled={isUploading}>
                <span>
                  {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-slate-500">
            Loading vault...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-slate-500 text-sm text-center">
            <FileText className="w-12 h-12 mb-3 text-slate-300" />
            <p>No documents uploaded yet.</p>
            <p className="mt-1 text-xs text-slate-400">Upload case files, invoices, or other evidence here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-slate-100 rounded-md shrink-0">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-900 truncate" title={doc.name}>
                      {doc.name}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5 space-x-2">
                      <span>{formatSize(doc.size)}</span>
                      <span>•</span>
                      <span>By {doc.uploaded_by_id === currentUser.id ? 'You' : doc.uploaded_by_name}</span>
                      <span>•</span>
                      <span>{new Date(doc.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
