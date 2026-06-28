import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MapPin, Star, Shield, Briefcase, Mail, ArrowLeft } from 'lucide-react';
import { Lawyer } from '../types';

export function LawyerRecommendation() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const { db } = await import('../lib/firebase');
      const { collection, getDocs, setDoc, doc, onSnapshot } = await import('firebase/firestore');
      
      const q = collection(db, 'lawyers');
      const snap = await getDocs(q);
      
      if (snap.empty) {
        // Seed mock lawyers
        const mockLawyers = [
          { id: 'l_1', name: 'Adv. Sharma', specialties: ['GST & Tax Law'], experience_years: 12, rating: 4.8, cases_won: 150, hourly_rate: 5000, photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', city: 'New Delhi' },
          { id: 'l_2', name: 'R.K. Associates', specialties: ['Corporate & Tax'], experience_years: 8, rating: 4.6, cases_won: 98, hourly_rate: 4000, photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', city: 'Mumbai' },
          { id: 'l_3', name: 'Priya Desai', specialties: ['GST Litigation'], experience_years: 15, rating: 4.9, cases_won: 300, hourly_rate: 8000, photo: 'https://i.pravatar.cc/150?u=a04258114e29026702d', city: 'Bangalore' }
        ];
        
        for (const lawyer of mockLawyers) {
          const { id, city, photo, ...rest } = lawyer;
          await setDoc(doc(db, 'lawyers', id), { ...rest, city, photo }); // include city and photo though not strict in blueprint
        }
      }

      unsubscribe = onSnapshot(collection(db, 'lawyers'), (snapshot) => {
        setLawyers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as any)));
      });
    };
    init();

    return () => unsubscribe();
  }, []);

  const handleInvite = async (lawyerId: string) => {
    try {
      const { db } = await import('../lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const { useAuthStore } = await import('../store/useAuthStore');
      const user = useAuthStore.getState().user;
      
      if (!user) {
        alert("Please login first");
        return;
      }
      
      // We'll mock the report ID for now, or just send a generic invitation
      const inviteId = `inv_${Date.now()}`;
      await setDoc(doc(db, 'invitations', inviteId), {
        lawyer_id: lawyerId,
        customer_id: user.id,
        report_id: 'rep_123', // Hardcoded for this view's scope unless we get it from context
        status: 'pending',
        created_at: new Date().toISOString()
      });
      alert('Invitation sent successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to send invitation');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended Lawyers</h1>
        <p className="text-slate-500 mt-1">Experts matched to your case based on the AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map(lawyer => (
          <Card key={lawyer.id} className="overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1">
              <div className="bg-slate-50 p-6 flex items-center space-x-4 border-b border-slate-100">
                <img 
                  src={lawyer.photo} 
                  alt={lawyer.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{lawyer.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {lawyer.city}
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-600">
                    <Shield className="w-4 h-4 mr-2 text-slate-400" />
                    {lawyer.specialization}
                  </div>
                  <Badge variant="secondary">{lawyer.experience}</Badge>
                </div>
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-amber-500 font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {lawyer.rating}
                  </div>
                  <span className="text-slate-400 ml-2">(120+ cases)</span>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 border-t border-slate-100 mt-auto bg-slate-50">
              <Button 
                variant="emerald" 
                className="w-full mt-4" 
                onClick={() => handleInvite(lawyer.id)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Invite for Consultation
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
