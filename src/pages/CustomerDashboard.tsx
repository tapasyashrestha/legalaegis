import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileText, ArrowRight, Clock, AlertTriangle, Send, CheckCircle2, Search, Filter } from 'lucide-react';
import { Report, Invitation } from '../types';

export function CustomerDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Analyzed' | 'Pending' | 'Accepted'>('All');

  useEffect(() => {
    let unsubReports = () => {};
    let unsubInvs = () => {};

    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { collection, query, where, onSnapshot } = await import('firebase/firestore');
      const { useAuthStore } = await import('../store/useAuthStore');
      const user = useAuthStore.getState().user;
      
      if (user) {
        const qReports = query(collection(db, 'reports'), where('userId', '==', user.id));
        unsubReports = onSnapshot(qReports, (snapshot) => {
          setReports(snapshot.docs.map(doc => doc.data() as Report));
        });

        const qInvs = query(collection(db, 'invitations'), where('customer_id', '==', user.id));
        unsubInvs = onSnapshot(qInvs, (snapshot) => {
          setInvitations(snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as any)));
        });
      }
    };
    init();

    return () => {
      unsubReports();
      unsubInvs();
    };
  }, []);

  const reportsWithStatus = useMemo(() => {
    return reports.map(report => {
      const reportInvitations = invitations.filter(inv => inv.report_id === report.id);
      let status: 'Analyzed' | 'Pending' | 'Accepted' = 'Analyzed';
      
      if (reportInvitations.some(inv => inv.status === 'accepted')) {
        status = 'Accepted';
      } else if (reportInvitations.some(inv => inv.status === 'pending')) {
        status = 'Pending';
      }
      
      return { ...report, status };
    });
  }, [reports, invitations]);

  const filteredReports = useMemo(() => {
    return reportsWithStatus.filter(report => {
      const matchesSearch = 
        report.notice_type.toLowerCase().includes(searchQuery.toLowerCase()) || 
        report.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [reportsWithStatus, searchQuery, statusFilter]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Reports</h1>
            <p className="text-slate-500 mt-1">Manage your uploaded notices and AI analysis.</p>
          </div>
          <Link to="/dashboard/upload">
            <Button variant="emerald">Upload New Notice</Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search legal notices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
            <span className="text-sm text-slate-500 mr-2 flex-shrink-0">Status:</span>
            <div className="flex space-x-2">
              {['All', 'Analyzed', 'Pending', 'Accepted'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    statusFilter === status 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:border-emerald-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg text-slate-900">{report.notice_type}</h3>
                          <Badge 
                            variant={report.status === 'Pending' ? 'warning' : report.status === 'Accepted' ? 'success' : 'secondary'}
                            className="pl-1.5 pr-2.5 py-0.5 capitalize text-xs"
                          >
                            {report.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                            {report.status === 'Accepted' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {report.status === 'Analyzed' && <FileText className="w-3 h-3 mr-1" />}
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 space-x-2 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>Analyzed on {new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-2">
                      {report.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {report.applicable_sections.slice(0, 2).map((sec, idx) => (
                        <Badge key={idx} variant="secondary">{sec}</Badge>
                      ))}
                      {report.applicable_sections.length > 2 && (
                        <Badge variant="outline">+{report.applicable_sections.length - 2} more</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-4 min-w-[200px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-500">Severity:</span>
                      <Badge variant={report.severity === 'High' ? 'destructive' : report.severity === 'Medium' ? 'warning' : 'success'}>
                        {report.severity}
                      </Badge>
                    </div>
                    <Link to={`/dashboard/reports/${report.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Full Report
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredReports.length === 0 && (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-xl border-dashed">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No reports found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filters.</p>
              {(searchQuery || statusFilter !== 'All') && (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>
                  Clear Filters
                </Button>
              )}
              {reports.length === 0 && (
                <Link to="/dashboard/upload" className="ml-2">
                  <Button variant="emerald">Upload Notice</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {invitations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sent Invitations</h2>
          <p className="text-slate-500 mt-1 mb-6">Status of consultation requests sent to lawyers.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">Lawyer: {inv.lawyer_id}</span>
                      </div>
                      <p className="text-sm text-slate-500">Sent on {new Date(inv.created_at).toLocaleDateString()}</p>
                      <Link to={`/dashboard/reports/${inv.report_id}`} className="text-sm text-emerald-600 hover:underline">
                        View associated report
                      </Link>
                    </div>
                    <Badge className="capitalize pl-1.5 pr-2.5 py-1" variant={inv.status === 'pending' ? 'warning' : inv.status === 'accepted' ? 'success' : 'destructive'}>
                      {inv.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {inv.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {inv.status === 'rejected' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                      {inv.status}
                    </Badge>
                  </div>
                  {inv.status === 'accepted' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <Link to={`/dashboard/chat/${inv.id}`}>
                        <Button variant="emerald" className="w-full">Chat with Lawyer</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
