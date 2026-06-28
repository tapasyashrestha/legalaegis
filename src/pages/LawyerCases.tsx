import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import { Invitation } from '../types';

export function LawyerCases() {
  const [cases, setCases] = useState<Invitation[]>([]);

  useEffect(() => {
    fetch('/api/lawyer/invitations')
      .then(res => res.json())
      .then(data => setCases(data.filter((inv: Invitation) => inv.status === 'accepted')));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accepted Cases</h1>
        <p className="text-slate-500 mt-1">Manage your active clients and cases.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No accepted cases yet.</p>
          </div>
        )}
        
        {cases.map(inv => (
          <Card key={inv.id} className="hover:border-emerald-200 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">Case ID: {inv.report_id}</h3>
                      <div className="flex items-center text-sm text-slate-500 space-x-2 mt-1">
                        <span>Accepted on {new Date(inv.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="success" className="ml-4 pl-1.5 pr-2.5 py-1 capitalize">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    <span>Client Demo User</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 min-w-[200px]">
                  <Link to={`/dashboard/reports/${inv.report_id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Case Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to={`/lawyer/chat/${inv.id}`} className="w-full">
                    <Button variant="emerald" className="w-full">
                      Chat with Client
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
