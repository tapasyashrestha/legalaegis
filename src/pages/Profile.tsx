import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Briefcase, GraduationCap, Award, Edit2, CheckCircle2 } from 'lucide-react';

export function Profile() {
  const { user } = useAuthStore();
  
  // Lawyer profile state
  const [isEditing, setIsEditing] = useState(false);
  const [specialization, setSpecialization] = useState('GST & Tax Law');
  const [experience, setExperience] = useState('12 years');
  const [education, setEducation] = useState('LLB, National Law School of India University');
  const [achievements, setAchievements] = useState('Top 100 Tax Lawyers 2023, Bar Council Member');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save profile data
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and personal information.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-4xl font-bold border-4 border-white shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">{user.name}</CardTitle>
                <Badge variant={user.role === 'lawyer' ? 'default' : 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            {user.role === 'lawyer' && !isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 flex items-center">
                <User className="w-4 h-4 mr-2" /> Full Name
              </label>
              <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {user.name}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {user.email}
              </div>
            </div>
          </div>

          {user.role === 'lawyer' && (
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center">
                    <Shield className="w-4 h-4 mr-2" /> Fields of Expertise
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={specialization} 
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  ) : (
                    <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {specialization}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> Experience
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={experience} 
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  ) : (
                    <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {experience}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" /> Educational Background
                </label>
                {isEditing ? (
                  <textarea 
                    value={education} 
                    onChange={(e) => setEducation(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  />
                ) : (
                  <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {education}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 flex items-center">
                  <Award className="w-4 h-4 mr-2" /> Achievements & Honors
                </label>
                {isEditing ? (
                  <textarea 
                    value={achievements} 
                    onChange={(e) => setAchievements(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  />
                ) : (
                  <div className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {achievements}
                  </div>
                )}
              </div>
            </div>
          )}

          {isEditing && (
            <div className="pt-6 flex justify-end space-x-4 border-t border-slate-100 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="emerald" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
