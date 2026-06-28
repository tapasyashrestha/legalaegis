import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Scale, ArrowLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer'|'lawyer'>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Store user role and info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });

      if (role === 'lawyer') {
        navigate('/lawyer/invitations');
      } else {
        navigate('/dashboard/reports');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Link to="/" className="flex items-center space-x-2 text-slate-900 mb-8 hover:opacity-90 transition-opacity">
        <Scale className="w-10 h-10 text-emerald-600" />
        <span className="text-3xl font-bold tracking-tight">Aegis</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Get started with Aegis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">I am a</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    value="customer" 
                    checked={role === 'customer'} 
                    onChange={() => setRole('customer')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Customer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    value="lawyer" 
                    checked={role === 'lawyer'} 
                    onChange={() => setRole('lawyer')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Lawyer</span>
                </label>
              </div>
            </div>

            <Button type="submit" variant="emerald" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
