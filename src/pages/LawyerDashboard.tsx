import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Invitation } from '../types';

export function LawyerDashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    let unsubInvs = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { collection, query, where, onSnapshot } = await import('firebase/firestore');
      const { useAuthStore } = await import('../store/useAuthStore');
      const user = useAuthStore.getState().user;
      
      if (user) {
        const qInvs = query(collection(db, 'invitations'), where('lawyer_id', '==', user.id));
        unsubInvs = onSnapshot(qInvs, (snapshot) => {
          const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as any));
          // Sort pending first, then by date descending
          const sorted = data.sort((a: Invitation, b: Invitation) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          setInvitations(sorted);
        });
      }
    };
    init();

    return () => unsubInvs();
  }, []);

  const handleAction = async (id: string, action: 'accepted' | 'rejected') => {
    try {
      const { db } = await import('../lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'invitations', id), {
        status: action
      });
      // the onSnapshot will automatically update the UI
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invitations</h1>
        <p className="text-slate-500 mt-1">Review AI-analyzed cases and consultation requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {invitations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No invitations.</p>
          </div>
        )}
        
        {invitations.map(inv => (
          <Card key={inv.id} className={inv.status === 'pending' ? 'border-emerald-200 shadow-sm' : 'opacity-75 hover:opacity-100 transition-opacity'}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg text-slate-900">Case: {inv.report_id}</span>
                    <Badge className="capitalize pl-1.5 pr-2.5 py-1" variant={inv.status === 'pending' ? 'warning' : inv.status === 'accepted' ? 'success' : 'destructive'}>
                      {inv.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {inv.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {inv.status === 'rejected' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                      {inv.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">Received on {new Date(inv.created_at).toLocaleDateString()}</p>
                  
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100 mt-4 max-w-2xl flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">AI Report Summary attached</p>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        This is a show cause notice issued under Section 73... 
                        <Link to={`/dashboard/reports/${inv.report_id}`} className="text-emerald-600 hover:underline ml-1">
                          [View Full Report]
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {inv.status === 'pending' && (
                  <div className="flex flex-col space-y-2 min-w-[140px]">
                    <Button variant="emerald" onClick={() => handleAction(inv.id, 'accepted')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Accept Case
                    </Button>
                    <Button variant="outline" onClick={() => handleAction(inv.id, 'rejected')}>
                      <XCircle className="w-4 h-4 mr-2" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
