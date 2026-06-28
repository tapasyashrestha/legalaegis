import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatWindow } from '../components/ChatWindow';
import { DocumentVault } from '../components/DocumentVault';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Invitation } from '../types';

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { doc, onSnapshot } = await import('firebase/firestore');
      
      if (id) {
        unsubscribe = onSnapshot(doc(db, 'invitations', id), (docSnap) => {
          if (docSnap.exists()) {
            setInvitation({ ...docSnap.data(), id: docSnap.id } as any);
          }
        });
      }
    };
    init();

    return () => unsubscribe();
  }, [id, user]);

  if (!user || !id) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="px-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Case Workspace</h1>
          <p className="text-slate-500 mt-1">
            {user.role === 'lawyer' ? 'Communicate and share documents with your client' : 'Communicate and share documents with your lawyer'}
          </p>
        </div>
      </div>

      {invitation ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChatWindow invitationId={id} currentUser={user} />
          <DocumentVault invitationId={id} currentUser={user} />
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          Loading case workspace...
        </div>
      )}
    </div>
  );
}
