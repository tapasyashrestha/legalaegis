import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Send, MessageSquare } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface ChatWindowProps {
  invitationId: string;
  currentUser: User;
}

export function ChatWindow({ invitationId, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
      
      const q = query(
        collection(db, 'invitations', invitationId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as any)));
        setIsLoading(false);
      });
    };
    init();

    return () => unsubscribe();
  }, [invitationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const { db } = await import('../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      await addDoc(collection(db, 'invitations', invitationId, 'messages'), {
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_role: currentUser.role,
        text: inputText,
        timestamp: new Date().toISOString()
      });

      setInputText('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
        <CardTitle className="flex items-center text-lg">
          <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" />
          Secure Case Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-slate-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-slate-500 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-slate-500">
                    {isMe ? 'You' : msg.sender_name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
                    isMe 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t border-slate-100 p-4">
        <div className="flex w-full space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <Button variant="emerald" onClick={handleSendMessage} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
