import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Scale, ArrowLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch role to redirect to correct dashboard
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      let role = 'customer';
      if (docSnap.exists()) {
        role = docSnap.data().role || 'customer';
      }

      if (role === 'lawyer') {
        navigate('/lawyer');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login');
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
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

            <Button type="submit" variant="emerald" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="text-emerald-600 hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
