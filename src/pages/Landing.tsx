import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  Scale, FileText, Search, ShieldCheck, 
  BrainCircuit, Users, FileWarning, CheckCircle2, ArrowRight
} from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:opacity-90 transition-opacity">
            <Scale className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold tracking-tight">Aegis</span>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="emerald" className="font-medium shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 mr-2"></span>
            Aegis Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            AI-Powered Legal Intelligence <br className="hidden md:block" />
            <span className="text-emerald-600">for GST & Legal Notices</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Understand complex legal notices instantly. Aegis uses a Multi-Agent RAG pipeline to generate citation-backed reports, decode legal jargon, and connect you with top specialized lawyers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup">
              <Button size="lg" variant="emerald" className="w-full sm:w-auto text-lg px-8 h-14 shadow-lg shadow-emerald-600/20">
                Analyze a Notice Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14">
                Lawyer Login
              </Button>
            </Link>
          </div>
        </section>

        {/* AI Pipeline Flow Diagram */}
        <section className="border-y border-slate-200 bg-white py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">The Aegis Analysis Pipeline</h2>
              <p className="text-lg text-slate-600">See how our multi-agent AI system transforms complex legal jargon into actionable insights.</p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Connecting line */}
              <div className="absolute top-8 left-0 w-full h-1 bg-emerald-100 hidden md:block z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center text-emerald-600 mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-center mb-2">1. Ingestion</h3>
                  <p className="text-sm text-slate-500 text-center max-w-[200px]">Secure PDF parsing & OCR text extraction</p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center text-emerald-600 mb-6">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-center mb-2">2. Discovery</h3>
                  <p className="text-sm text-slate-500 text-center max-w-[200px]">Legal entity & intent recognition</p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center text-emerald-600 mb-6">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-center mb-2">3. RAG Engine</h3>
                  <p className="text-sm text-slate-500 text-center max-w-[200px]">Precedent retrieval & citation checking</p>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 border-2 border-emerald-600 shadow-md flex items-center justify-center text-white mb-6 relative">
                    <ShieldCheck className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-300 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-center mb-2">4. Action Plan</h3>
                  <p className="text-sm text-slate-500 text-center max-w-[200px]">Structured report & lawyer matching</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Everything you need to handle legal notices</h2>
            <p className="text-lg text-slate-600">Our platform combines cutting-edge AI with a network of legal professionals to give you complete peace of mind.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-emerald-500" />}
              title="Multi-Agent AI Analysis"
              desc="Specialized AI agents work together to detect issues, retrieve relevant laws, and verify citations for maximum accuracy."
            />
            <FeatureCard 
              icon={<FileWarning className="w-8 h-8 text-emerald-500" />}
              title="Risk & Consequence Scoring"
              desc="Instantly understand the severity of your notice, potential penalties, and critical deadlines you cannot miss."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
              title="Actionable Action Plans"
              desc="Get a structured, step-by-step report detailing exactly what documents you need to gather and what steps to take next."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-emerald-500" />}
              title="Expert Lawyer Matching"
              desc="Our system automatically matches your specific case details with lawyers who have a proven track record in that exact domain."
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8 text-emerald-500" />}
              title="Automated Draft Generation"
              desc="Generate initial drafts for replies and appeals based on the AI's analysis, saving hours of legal groundwork."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
              title="Secure Case Management"
              desc="Keep all your notices, AI reports, and lawyer communications securely organized in one encrypted dashboard."
            />
          </div>
        </section>

        {/* How it Works Section */}
        <section className="bg-slate-900 text-white py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How Aegis Works</h2>
              <p className="text-lg text-slate-400">From a confusing PDF to a clear action plan in minutes.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800 -z-10"></div>
              
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700">
                  <span className="text-3xl font-bold text-emerald-400">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Notice</h3>
                <p className="text-slate-400">Securely upload your GST or legal notice PDF. We extract the raw text and prep it for analysis.</p>
              </div>
              
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700">
                  <span className="text-3xl font-bold text-emerald-400">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Processing</h3>
                <p className="text-slate-400">Our RAG pipeline cross-references your notice with the latest tax codes and legal precedents.</p>
              </div>
              
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700">
                  <span className="text-3xl font-bold text-emerald-400">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Connected</h3>
                <p className="text-slate-400">Review your detailed report and instantly share it with a matched, specialized lawyer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="bg-emerald-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-500 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-700 opacity-50 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to demystify your legal notices?</h2>
              <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses and individuals who trust Aegis to handle their legal documents with precision and speed.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-50 text-lg px-8 h-14 font-bold shadow-lg">
                  Create your free account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-900 mb-4 md:mb-0">
            <Scale className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight">Aegis</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Aegis Legal Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-left hover:shadow-md transition-shadow">
      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
