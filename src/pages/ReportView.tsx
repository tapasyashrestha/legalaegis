import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  AlertTriangle, BookOpen, Scale, FileText, CheckCircle2, ChevronRight, Users, Download, Loader2, Bot, ArrowLeft
} from 'lucide-react';
import { Report } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ReportView() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { doc, onSnapshot } = await import('firebase/firestore');
      if (id) {
        unsubscribe = onSnapshot(doc(db, 'reports', id), (docSnap) => {
          if (docSnap.exists()) {
            setReport(docSnap.data() as Report);
          } else {
            console.error('Report not found');
          }
        });
      }
    };
    init();
    return () => unsubscribe();
  }, [id]);

  const handleAskQuestion = async () => {
    const input = document.getElementById('followUpInput') as HTMLInputElement;
    const question = input.value;
    if (!question.trim() || !report || !id) return;
    input.disabled = true;
    
    try {
      const res = await fetch(`/api/reports/${report.id}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          reportContext: {
            summary: report.summary,
            issues_found: report.issues_found,
            recommended_next_steps: report.recommended_next_steps,
            qa_history: report.qa_history || []
          }
        })
      });
      const data = await res.json();
      if (data.success && data.newQA) {
        const { db } = await import('../lib/firebase');
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
        await updateDoc(doc(db, 'reports', id), {
          qa_history: arrayUnion(data.newQA)
        });
        input.value = '';
      }
    } catch (err) {
      console.error(err);
    } finally {
      input.disabled = false;
      input.focus();
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`Aegis_Report_${report?.id || 'export'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!report) return <div className="p-8 text-center text-slate-500">Loading report...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link to="/dashboard/reports" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{report.notice_type}</h1>
          <p className="text-slate-500 mt-2">Analyzed on {new Date(report.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isDownloading ? 'Generating...' : 'Download Report'}
          </Button>
          <Link to="/dashboard/lawyers">
            <Button variant="emerald">
              <Users className="w-4 h-4 mr-2" />
              Find Lawyers
            </Button>
          </Link>
        </div>
      </div>

      <div id="report-content" className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl -m-4">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Notice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-slate-700 leading-relaxed">
              {report.summary}
            </CardContent>
          </Card>

          {report.user_questions && (
            <Card>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="flex items-center text-lg">
                  <Bot className="w-5 h-5 mr-2 text-emerald-600" />
                  Your Questions & AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">You Asked</h4>
                  <div className="p-4 bg-slate-100 rounded-lg text-slate-700 border border-slate-200">
                    {report.user_questions}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Answer</h4>
                  <div className="p-4 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-100 whitespace-pre-wrap">
                    {report.ai_answers}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" />
                Issues & Consequences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Detected Issues</h4>
                <ul className="space-y-2">
                  {report.issues_found.map((issue, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-3">Possible Consequences</h4>
                <ul className="space-y-2">
                  {report.consequences.map((cons, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{cons}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg">
                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                Retrieved Legal Context (RAG Citations)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Applicable Laws</h4>
                <div className="space-y-3">
                  {report.relevant_laws.map((law, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="font-medium text-slate-900">{law.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{law.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Relevant Circulars & Notifications</h4>
                <div className="space-y-3">
                  {report.relevant_circulars.map((circ, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="font-medium text-slate-900">{circ.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{circ.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Case Law Precedents</h4>
                <div className="space-y-3">
                  {report.relevant_judgments.map((judge, idx) => (
                    <div key={idx} className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-medium text-indigo-900">{judge.title}</p>
                      <p className="text-sm text-indigo-700 mt-1">{judge.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="flex items-center text-lg">
                <Bot className="w-5 h-5 mr-2 text-emerald-600" />
                Ask a Follow-up Question
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {report.qa_history && report.qa_history.length > 0 && (
                <div className="space-y-4 mb-6">
                  {report.qa_history.map((qa, idx) => (
                    <div key={idx} className="space-y-2">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">You</h4>
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 text-sm border border-slate-200">
                          {qa.question}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">AI</h4>
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-sm border border-emerald-100 whitespace-pre-wrap">
                          {qa.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <input 
                  type="text"
                  placeholder="Ask anything about this notice or the analysis..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="followUpInput"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      await handleAskQuestion();
                    }
                  }}
                />
                <Button 
                  variant="emerald" 
                  onClick={handleAskQuestion}
                >
                  Ask
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center pb-6 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">AI Confidence Score</p>
                <div className="flex items-end justify-center space-x-1">
                  <span className="text-4xl font-extrabold text-emerald-600">{report.confidence_score}</span>
                  <span className="text-lg text-emerald-600 font-medium mb-1">%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Based on retrieved documents</p>
              </div>
              <div className="pt-6">
                <p className="text-sm font-medium text-slate-500 mb-3">Severity Level</p>
                <Badge variant={report.severity === 'High' ? 'destructive' : 'warning'} className="w-full justify-center text-sm py-1.5">
                  {report.severity} Priority
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {report.recommended_next_steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <ul className="space-y-2">
                {report.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
