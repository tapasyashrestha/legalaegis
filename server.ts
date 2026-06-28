import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Mock Database
  const db = {
    users: [],
    reports: [
      {
        id: 'rep_123',
        notice_id: 'not_123',
        status: 'completed',
        summary: 'This is a show cause notice issued under Section 73 of the CGST Act for a mismatch in Input Tax Credit (ITC) between GSTR-3B and GSTR-2A for the financial year 2019-20.',
        severity: 'High',
        notice_type: 'Show Cause Notice (SCN)',
        applicable_sections: ['Section 73(1) of CGST Act', 'Rule 142(1)(a) of CGST Rules'],
        issues_found: [
          'ITC claimed in GSTR-3B exceeds ITC available in GSTR-2A by ₹1,45,000.',
          'Failure to provide explanation within the stipulated 30-day period may lead to demand and recovery.'
        ],
        consequences: [
          'Demand of tax along with interest under Section 50.',
          'Penalty under Section 73(9) which is 10% of tax or ₹10,000, whichever is higher.'
        ],
        required_documents: [
          'Reconciliation statement of GSTR-3B and GSTR-2A',
          'Purchase invoices supporting the ITC claim',
          'Proof of payment to suppliers (bank statements)'
        ],
        relevant_laws: [
          { title: 'Section 73, CGST Act', text: 'Determination of tax not paid or short paid or erroneously refunded or input tax credit wrongly availed or utilised for any reason other than fraud or any wilful-misstatement or suppression of facts.' }
        ],
        relevant_circulars: [
          { title: 'Circular No. 183/15/2022-GST', text: 'Clarification to deal with difference in Input Tax Credit (ITC) availed in FORM GSTR-3B as compared to that detailed in FORM GSTR-2A for FY 2017-18 and 2018-19.' }
        ],
        relevant_judgments: [
          { title: 'Diya Agencies vs State Tax Officer (Kerala HC)', text: 'ITC cannot be denied solely based on GSTR-2A mismatch if the taxpayer can prove genuine purchase and payment of tax to the supplier.' }
        ],
        recommended_next_steps: [
          'Prepare a detailed reconciliation of ITC.',
          'Gather all relevant purchase invoices.',
          'Draft a reply citing Circular 183 and relevant High Court judgments.',
          'Consult a GST lawyer to review the reply before filing.'
        ],
        confidence_score: 92,
        created_at: new Date().toISOString()
      }
    ],
    lawyers: [
      { id: 'l_1', name: 'Adv. Sharma', specialization: 'GST & Tax Law', experience: '12 years', city: 'New Delhi', rating: 4.8, photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: 'l_2', name: 'R.K. Associates', specialization: 'Corporate & Tax', experience: '8 years', city: 'Mumbai', rating: 4.6, photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
      { id: 'l_3', name: 'Priya Desai', specialization: 'GST Litigation', experience: '15 years', city: 'Bangalore', rating: 4.9, photo: 'https://i.pravatar.cc/150?u=a04258114e29026702d' }
    ],
    invitations: []
  };

  // --- API Routes (Mocks for the UI to function in preview) ---

  app.post('/api/auth/login', (req, res) => {
    const { email, role } = req.body;
    res.json({ token: 'mock-jwt-token', user: { id: 'u_1', email, role: role || 'customer', name: 'Demo User' } });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { email, role, name } = req.body;
    res.json({ token: 'mock-jwt-token', user: { id: `u_${Date.now()}`, email, role: role || 'customer', name: name || 'New User' } });
  });

  app.post('/api/upload-notice', upload.single('file'), async (req, res) => {
    const questions = req.body.questions;
    const newReportId = `rep_${Date.now()}`;
    const baseReport = db.reports[0] as any;
    
    const newReport = {
      ...baseReport,
      id: newReportId,
      created_at: new Date().toISOString()
    } as any;

    if (questions) {
      newReport.user_questions = questions;
      try {
        let fileContent = null;
        let mimeType = 'application/pdf';
        if (req.file) {
          const fileBuffer = fs.readFileSync(req.file.path);
          fileContent = fileBuffer.toString('base64');
          mimeType = req.file.mimetype || 'application/pdf';
        }
        
        const parts = [];
        if (fileContent) {
          parts.push({
            inlineData: {
              data: fileContent,
              mimeType: mimeType
            }
          });
        }
        
        parts.push({
          text: `You are an expert legal AI assistant specializing in Indian legal notices, especially GST. 
The user has provided a legal notice document (if attached) and asked the following specific questions regarding it:
"${questions}"

Analyze the document context and provide a highly accurate, professional, and detailed answer to the user's questions. Base your answer strictly on the document provided. If no document is attached or the answer isn't in the document, answer based on general legal knowledge but state that it's a general answer.`
        });
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: 'user',
              parts
            }
          ]
        });
        
        newReport.ai_answers = response.text;
      } catch (err) {
        console.error("Gemini API Error:", err);
        newReport.ai_answers = "Sorry, an error occurred while generating the AI analysis for your questions. Please try again later.";
      }
    }
    
    // Clean up uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing uploaded file:", err);
      });
    }

    res.json({ success: true, report_id: newReportId, report: newReport, message: 'Notice processed successfully via Agent Pipeline.' });
  });

  app.get('/api/reports', (req, res) => {
    res.json(db.reports);
  });

  app.get('/api/reports/:id', (req, res) => {
    const report = db.reports.find(r => r.id === req.params.id);
    if (report) res.json(report);
    else res.status(404).json({ error: 'Report not found' });
  });

  app.post('/api/reports/:id/ask', async (req, res) => {
    const { question, reportContext } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (!reportContext) return res.status(400).json({ error: 'reportContext is required' });

    try {
      let historyText = "";
      if (reportContext.qa_history && reportContext.qa_history.length > 0) {
        historyText = reportContext.qa_history.map((qa: any) => `User: ${qa.question}\nAI: ${qa.answer}`).join('\n\n');
      }

      const prompt = `You are an expert legal AI assistant specializing in Indian legal notices.
Here is the context of a legal notice report:
Summary: ${reportContext.summary || ''}
Issues Found: ${(reportContext.issues_found || []).join(", ")}
Recommended Steps: ${(reportContext.recommended_next_steps || []).join(", ")}

Previous Q&A:
${historyText}

The user has a follow-up question:
"${question}"

Provide a highly accurate, professional, and detailed answer to the user's follow-up question based on this context.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      });

      const newQA = {
        id: `qa_${Date.now()}`,
        question,
        answer: response.text,
        timestamp: new Date().toISOString()
      };

      res.json({ success: true, answer: response.text, newQA });
    } catch (err) {
      console.error("Gemini API Error in follow-up:", err);
      res.status(500).json({ error: "Failed to generate answer. Please try again." });
    }
  });

  app.get('/api/recommended-lawyers', (req, res) => {
    res.json(db.lawyers);
  });

  app.post('/api/invite-lawyer', (req, res) => {
    const { lawyer_id, report_id } = req.body;
    const invite = { id: `inv_${Date.now()}`, lawyer_id, report_id, status: 'pending', created_at: new Date().toISOString() };
    db.invitations.push(invite);
    res.json({ success: true, invitation: invite });
  });

  app.get('/api/customer/invitations', (req, res) => {
    res.json(db.invitations); // Mocking it by returning all invitations for the user
  });

  app.get('/api/lawyer/invitations', (req, res) => {
    res.json(db.invitations);
  });

  app.post('/api/lawyer/invitations/:id', (req, res) => {
    const invite = db.invitations.find(i => i.id === req.params.id);
    if (invite) {
      invite.status = req.body.status;
      res.json({ success: true, invitation: invite });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.get('/api/invitations/:id/messages', (req, res) => {
    const invite = db.invitations.find(i => i.id === req.params.id) as any;
    if (invite) {
      res.json(invite.messages || []);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/invitations/:id/messages', (req, res) => {
    const invite = db.invitations.find(i => i.id === req.params.id) as any;
    if (!invite) return res.status(404).json({ error: 'Not found' });

    const { sender_id, sender_name, sender_role, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender_id,
      sender_name,
      sender_role,
      text,
      timestamp: new Date().toISOString()
    };

    if (!invite.messages) {
      invite.messages = [];
    }
    invite.messages.push(newMessage);

    res.json({ success: true, message: newMessage });
  });

  app.get('/api/invitations/:id/documents', (req, res) => {
    const invite = db.invitations.find(i => i.id === req.params.id) as any;
    if (invite) {
      res.json(invite.documents || []);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/invitations/:id/documents', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const { uploaded_by_id, uploaded_by_name } = req.body;

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: req.file.originalname,
      uploaded_by_id,
      uploaded_by_name,
      timestamp: new Date().toISOString(),
      url: `/uploads/${req.file.filename}`, // Serving this static directory
      size: req.file.size
    };

    res.json({ success: true, document: newDoc });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mock Node Server running on http://localhost:${PORT}`);
    console.log(`Real Python FastAPI backend code is available in the /backend directory.`);
  });
}

startServer();
