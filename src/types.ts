export interface User {
  id: string;
  email: string;
  role: 'customer' | 'lawyer';
  name: string;
}

export interface Report {
  id: string;
  notice_id: string;
  status: string;
  summary: string;
  severity: 'High' | 'Medium' | 'Low';
  notice_type: string;
  applicable_sections: string[];
  issues_found: string[];
  consequences: string[];
  required_documents: string[];
  relevant_laws: { title: string; text: string }[];
  relevant_circulars: { title: string; text: string }[];
  relevant_judgments: { title: string; text: string }[];
  recommended_next_steps: string[];
  confidence_score: number;
  user_questions?: string;
  ai_answers?: string;
  qa_history?: { question: string; answer: string; timestamp: string }[];
  created_at: string;
}

export interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  city: string;
  rating: number;
  photo: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'customer' | 'lawyer';
  text: string;
  timestamp: string;
}

export interface SharedDocument {
  id: string;
  name: string;
  uploaded_by_id: string;
  uploaded_by_name: string;
  timestamp: string;
  url: string;
  size: number;
}

export interface Invitation {
  id: string;
  lawyer_id: string;
  report_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  messages?: ChatMessage[];
  documents?: SharedDocument[];
}
