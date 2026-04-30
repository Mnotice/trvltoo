import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Invalid email or password.';
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Something went wrong. Please try again.';
  }
}

function pwStrengthOf(pw) {
  if (!pw) return 0;
  if (pw.length < 6) return 1;
  if (pw.length < 8) return 2;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return 4;
  return 3;
}

const PW_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-teal-500'];
const PW_TEXT   = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-teal-400'];
const PW_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function AuthModal({ onClose, defaultTab = 'signin' }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();

  const [tab,     setTab]     = useState(defaultTab);
  const [email,   setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const strength = pwStrengthOf(password);

  function switchTab(t) {
    setTab(t);
    setError('');
    setSuccess('');
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setError(friendlyError(e.code));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
        onClose();
      } else if (tab === 'signup') {
        await signUpWithEmail(email, password);
        setSuccess('Account created! Check your inbox to verify your email address before signing in.');
      } else {
        await sendPasswordReset(email);
        setSuccess('Password reset email sent. Check your inbox.');
      }
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  const titles = {
    signin: ['Welcome Back',   'Sign In'],
    signup: ['Join TRVLTOO',   'Create Account'],
    reset:  ['Forgot Password?', 'Reset Password'],
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-0.5">
              {titles[tab][0]}
            </p>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              {titles[tab][1]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors mt-1"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Tab switcher */}
        {tab !== 'reset' && (
          <div className="flex gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className={`flex-1 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  tab === id ? 'bg-teal-500 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle className="w-10 h-10 text-teal-400" />
            <p className="text-sm text-white/70 leading-relaxed">{success}</p>
            <button
              onClick={() => tab === 'signup' ? switchTab('signin') : onClose()}
              className="px-6 py-2.5 rounded-full bg-teal-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors"
            >
              {tab === 'signup' ? 'Sign In' : 'Done'}
            </button>
          </div>
        ) : (
          <>
            {/* Google button */}
            {tab !== 'reset' && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.15em] hover:bg-white/90 disabled:opacity-60 transition-colors shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </motion.button>
            )}

            {tab !== 'reset' && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-teal-500/50 focus:bg-white/[0.07] transition-all"
                />
              </div>

              {/* Password */}
              {tab !== 'reset' && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={tab === 'signup' ? 'Create password' : 'Password'}
                      required
                      autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                      minLength={6}
                      className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-teal-500/50 focus:bg-white/[0.07] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter (sign-up only) */}
                  {tab === 'signup' && password.length > 0 && (
                    <div className="mt-2 space-y-1 px-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                              i <= strength ? PW_COLORS[strength] : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[10px] font-bold ${PW_TEXT[strength]}`}>
                        {PW_LABELS[strength]}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-teal-500 text-white font-black text-[12px] uppercase tracking-widest hover:bg-teal-400 disabled:opacity-60 transition-colors shadow-lg shadow-teal-500/20"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  : tab === 'signin' ? 'Sign In'
                  : tab === 'signup' ? 'Create Account'
                  : 'Send Reset Email'
                }
              </motion.button>
            </form>

            {/* Footer links */}
            <div className="text-center">
              {tab === 'signin' && (
                <button
                  onClick={() => switchTab('reset')}
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  Forgot your password?
                </button>
              )}
              {tab === 'reset' && (
                <button
                  onClick={() => switchTab('signin')}
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  ← Back to sign in
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
