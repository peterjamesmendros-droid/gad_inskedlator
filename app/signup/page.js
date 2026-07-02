'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DoorClosed, Eye, EyeOff, ShieldCheck, AlertCircle, UserPlus, IdCard, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  
  // Real-time room telemetry states
  const [rooms, setRooms] = useState({
    "Room 1": "Available",
    "Room 2": "Available",
    "Room 3": "Available"
  });

  // Interactive UI component state hooks
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Poll room states every 5 seconds to match the home interface
  useEffect(() => {
    async function updateLiveTelemetry() {
      try {
        const res = await fetch('/api/rooms');
        const data = await res.json();
        if (data.success) {
          // Flatten standard status mapping labels
          const parsed = {};
          Object.entries(data.rooms).forEach(([name, info]) => {
            parsed[name] = info.status === 'occupied' ? 'Occupied' : 'Available';
          });
          setRooms(parsed);
        }
      } catch (err) {
        console.error("Telemetry fetch error:", err);
      }
    }
    updateLiveTelemetry();
    const interval = setInterval(updateLiveTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password })
      });

      const data = await res.json();
      if (data.success) {
        // Route straight to login panel signaling completion criteria parameters
        router.push('/?success=1');
      } else {
        setErrorMsg(data.message || 'Registration operational error.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the registration server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-900 font-sans">
      
      {/* Left Column: Hero Container */}
      <div className="relative w-full md:w-1/2 bg-cover bg-center h-[380px] md:min-h-screen p-8 shrink-0" style={{ backgroundImage: "url('/background/loginbg.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-slate-900/50 to-transparent" />
        
        {/* Dynamic Telemetry Panel Repositioned: Centered at the Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white p-5 rounded-[24px] shadow-2xl border border-slate-100/80 space-y-4 z-10">
          
          {/* Header Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-800 text-sm font-extrabold tracking-tight">Live Room Status</span>
            </div>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 text-[11px] font-bold tabular-nums">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Strict Side-by-Side Horizontal Cards Grid (Forced 3 Columns) */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {Object.entries(rooms).map(([name, status]) => {
              const isOccupied = status === "Occupied";
              return (
                <div key={name} className="bg-white rounded-2xl border border-slate-100 p-2.5 flex flex-col items-center justify-center text-center space-y-2 w-full min-w-0">
                  
                  {/* Circular Icon Container */}
                  <div className={`p-2 rounded-full flex items-center justify-center shrink-0 ${
                    isOccupied ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <DoorClosed className="h-4 w-4 fill-current" />
                  </div>

                  {/* Room Label */}
                  <span className="text-slate-800 text-[11px] font-bold tracking-tight truncate w-full">
                    {name}
                  </span>

                  {/* Clean Status Badge */}
                  <span className={`w-full py-0.5 text-[10px] font-black tracking-wide rounded-md block text-center ${
                    isOccupied ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{status}</span>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Interaction Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6 relative">
          
          {/* Brand Logo and Title Headers */}
          <div className="text-center space-y-2">
            <h1 className="text-xs font-black tracking-widest text-slate-400 uppercase">GAD INSKEDLATOR</h1>
            <div className="inline-block p-3.5 bg-slate-50 border border-slate-100 rounded-full shadow-inner mx-auto">
              <img src="/logo/dlogo.png" alt="DICT Logo" className="h-12 w-12 object-contain" />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 font-medium">Please register your account details below</p>
          </div>

          {/* Fallback Alert Error Notice Message Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold rounded-xl flex gap-2 items-center">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Clean Core Interactive Fields Form Wrapper */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <IdCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input type="text" required value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Enter your full name" className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-purple-900 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-slate-800 font-medium transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your official email" className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-purple-900 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-slate-800 font-medium transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-purple-900 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-slate-800 font-medium transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-purple-900 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-slate-800 font-medium transition-all" />
              </div>
            </div>

            {/* Utility Switches Row */}
            <div className="flex items-center justify-between text-xs font-bold pt-1 select-none">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer group">
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="rounded text-purple-900 border-slate-300 focus:ring-0 h-3.5 w-3.5 cursor-pointer" />
                <span className="group-hover:text-slate-900 transition-colors">Show passwords</span>
              </label>
              <p className="text-slate-400 font-medium">
                Existing user? <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="text-purple-900 hover:underline font-bold ml-1">Login here</a>
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-900 hover:bg-purple-950 disabled:bg-purple-300 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
              <span>{isLoading ? 'Registering Account...' : 'Register New Account'}</span>
              <UserPlus className="h-4 w-4" />
            </button>
          </form>

          {/* Security Disclaimer Frame */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 text-slate-600 text-[11px] leading-tight relative z-10">
            <ShieldCheck className="h-4 w-4 text-purple-900 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">Secure Registration</strong>
              <p>All database records are securely handled using industry encryption frameworks in line with DICT regulatory policies.</p>
            </div>
          </div>

          {/* Bottom Official Government Seal Graphics */}
          <div className="flex items-center justify-center gap-4 opacity-30 select-none grayscale pt-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Department_of_Information_and_Communications_Technology_%28DICT%29_-_Seal_only.svg" alt="DICT Badge" className="h-8 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Coat_of_arms_of_the_Philippines.svg" alt="PH Seal" className="h-8 object-contain" />
          </div>

        </div>
      </div>

    </div>
  );
}