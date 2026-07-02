'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep]       = useState('request'); // request | reset | done
  const [email, setEmail]     = useState('');
  const [userId, setUserId]   = useState(null);
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Strength helpers
  const strength = (() => {
    let s = 0;
    if (password.length >= 8)          s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0-4
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'][strength];

  async function handleRequest(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'request', email }),
      });
      const json = await res.json();
      if (json.success) { setUserId(json.userId); setStep('reset'); }
      else setError(json.message);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) { setError('Password must include at least one letter and one number.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'reset', userId, password }),
      });
      const json = await res.json();
      if (json.success) setStep('done');
      else setError(json.message);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-slate-50 focus:bg-white transition-colors';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 'request' && 'Forgot password?'}
            {step === 'reset'   && 'Set new password'}
            {step === 'done'    && 'Password updated!'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 'request' && "Enter your email and we'll verify your account."}
            {step === 'reset'   && 'Choose a strong password for your account.'}
            {step === 'done'    && 'You can now sign in with your new password.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          {step === 'done' ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="text-sm text-slate-600">Your password has been updated successfully.</p>
              <Link href="/" className="block w-full py-2.5 bg-purple-700 text-white text-sm font-bold rounded-lg hover:bg-purple-800 transition-colors text-center">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              {step === 'request' && (
                <form onSubmit={handleRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email address</label>
                    <div className="relative">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        required placeholder="maria@dict.gov.ph" className={inputClass + ' pr-10'} />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-purple-700 text-white text-sm font-bold rounded-lg hover:bg-purple-800 disabled:opacity-60 transition-colors">
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </form>
              )}

              {step === 'reset' && (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">New password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} required
                        placeholder="At least 8 characters" className={inputClass + ' pr-10'} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(n => (
                            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= strength ? strengthColor : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">{strengthLabel}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Confirm password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={confirm}
                        onChange={e => setConfirm(e.target.value)} required
                        placeholder="Re-enter new password" className={inputClass + ' pr-10'} />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-purple-700 text-white text-sm font-bold rounded-lg hover:bg-purple-800 disabled:opacity-60 transition-colors">
                    {loading ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              )}

              <div className="text-center mt-4">
                <Link href="/" className="text-xs text-slate-400 hover:text-purple-700 transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
