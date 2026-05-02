import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Loader2, CalendarDays, MapPin,
  Clock, DollarSign, CheckCircle, ChevronDown, ChevronUp,
  Lightbulb, AlertCircle, Pencil, Trash2, Plus, Map, List,
  Share2, Copy, Check, FileText, FileJson, FileDown,
  ChevronDown as Caret, UserPlus, Users, MessageCircle, Send,
} from 'lucide-react';
import {
  getSpots, saveItinerary, updateTrip,
  subscribeTrip, createInvite,
  addComment, subscribeComments,
} from '../services/firestoreService';
import { streamItinerary } from '../services/claudeService';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
import LandingNav from '../components/Landing/LandingNav';
import ProGate from '../components/ProGate';
import MapView from '../components/Map/MapView';
import { exportMarkdown, exportJSON, exportPDF } from '../utils/exportItinerary';

const CATEGORY_EMOJI = {
  food: '🍜', attraction: '🏛️', nature: '🌿', hotel: '🛏️',
  shopping: '🛍️', nightlife: '🌙', experience: '✨', other: '📍',
};
const COST_COLOR = { '$': 'text-emerald-400', '$$': 'text-amber-400', '$$$': 'text-rose-400' };
const COST_OPTIONS = ['', '$', '$$', '$$$'];

function fromKey(k) { return new Date(k + 'T00:00:00'); }
function formatDate(k) {
  return fromKey(k).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ── Inline edit form ──────────────────────────────────────────────────────────
function ActivityEditForm({ act, onSave, onCancel }) {
  const [form, setForm] = useState({ ...act });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-3 pt-2 pb-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Time</label>
          <input value={form.time ?? ''} onChange={e => set('time', e.target.value)}
            placeholder="9:00 AM"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Cost</label>
          <select value={form.cost ?? ''} onChange={e => set('cost', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-teal-500/50">
            {COST_OPTIONS.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c || '—'}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Title</label>
        <input value={form.title ?? ''} onChange={e => set('title', e.target.value)}
          placeholder="Activity name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Description</label>
        <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)}
          placeholder="Details…" rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Duration</label>
          <input value={form.duration ?? ''} onChange={e => set('duration', e.target.value)}
            placeholder="2 hrs"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Transport</label>
          <input value={form.transport ?? ''} onChange={e => set('transport', e.target.value)}
            placeholder="Grab / walk"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Tip</label>
        <input value={form.tip ?? ''} onChange={e => set('tip', e.target.value)}
          placeholder="Local tip…"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)}
          className="flex-1 py-2 rounded-xl bg-teal-500 text-white font-black text-[11px] uppercase tracking-wider hover:bg-teal-400 transition-colors">
          Save
        </button>
        <button onClick={onCancel}
          className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-black text-[11px] uppercase tracking-wider hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ act, index, onEdit, onDelete }) {
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="border-l-2 border-teal-500/50 pl-5">
        <ActivityEditForm
          act={act}
          onSave={updated => { onEdit(index, updated); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group border-l-2 border-white/10 pl-5 space-y-1 hover:border-teal-500/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer flex-1" onClick={() => setOpen(o => !o)}>
          <span className="text-[11px] font-black text-teal-400/70 w-12 shrink-0">{act.time}</span>
          <span className="text-sm font-black italic uppercase tracking-tight text-white truncate">
            {CATEGORY_EMOJI[act.category] ?? '📍'} {act.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {act.cost && <span className={`text-[10px] font-black ${COST_COLOR[act.cost] ?? 'text-white/30'}`}>{act.cost}</span>}
          <button onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-teal-400 p-0.5">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-rose-400 p-0.5">
            <Trash2 className="w-3 h-3" />
          </button>
          <button onClick={() => setOpen(o => !o)} className="text-white/30 p-0.5">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 space-y-2">
              {act.description && <p className="text-[12px] text-white/50 leading-relaxed">{act.description}</p>}
              <div className="flex flex-wrap gap-3 text-[11px] text-white/35">
                {act.duration  && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}</span>}
                {act.transport && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{act.transport}</span>}
              </div>
              {act.tip && (
                <div className="flex items-start gap-2 mt-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-300/80">{act.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Add activity form ─────────────────────────────────────────────────────────
function AddActivityForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ time: '', title: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.title.trim().length > 0;

  return (
    <div className="border-l-2 border-teal-500/30 pl-5 space-y-3 pt-1">
      <div className="grid grid-cols-3 gap-2">
        <input value={form.time} onChange={e => set('time', e.target.value)}
          placeholder="Time"
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
        <input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="Activity name" autoFocus
          className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50" />
      </div>
      <div className="flex gap-2">
        <button disabled={!valid} onClick={() => onAdd(form)}
          className="flex-1 py-2 rounded-xl bg-teal-500 disabled:opacity-30 text-white font-black text-[11px] uppercase tracking-wider hover:bg-teal-400 transition-colors">
          Add
        </button>
        <button onClick={onCancel}
          className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-black text-[11px] uppercase tracking-wider hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Day card ──────────────────────────────────────────────────────────────────
function DayCard({ day, index, onEditActivity, onDeleteActivity, onAddActivity }) {
  const [collapsed, setCollapsed] = useState(false);
  const [adding,    setAdding]    = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">{day.day}</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400/70">{formatDate(day.date)}</p>
            <p className="text-base font-black italic uppercase tracking-tight text-white leading-tight">{day.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {day.dayBudget && (
            <span className="text-[11px] font-black text-white/30 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />~${day.dayBudget}
            </span>
          )}
          {collapsed ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronUp className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3">
              {day.daySummary && (
                <p className="text-[12px] text-white/40 italic border-l-2 border-teal-500/30 pl-3">{day.daySummary}</p>
              )}
              <div className="space-y-3 pt-1">
                {(day.activities ?? []).map((act, i) => (
                  <ActivityRow
                    key={i}
                    act={act}
                    index={i}
                    onEdit={(idx, updated) => onEditActivity(day.day, idx, updated)}
                    onDelete={idx => onDeleteActivity(day.day, idx)}
                  />
                ))}
              </div>

              {adding ? (
                <AddActivityForm
                  onAdd={act => { onAddActivity(day.day, act); setAdding(false); }}
                  onCancel={() => setAdding(false)}
                />
              ) : (
                <button onClick={() => setAdding(true)}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-teal-500/40 hover:text-teal-400 transition-colors mt-2">
                  <Plus className="w-3.5 h-3.5" /> Add activity
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Budget breakdown bar ──────────────────────────────────────────────────────
function BudgetBar({ days }) {
  const max = Math.max(...days.map(d => d.dayBudget ?? 0), 1);
  if (!days.some(d => d.dayBudget)) return null;

  return (
    <div className="space-y-2 p-4 rounded-2xl bg-white/3 border border-white/8">
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25 flex items-center gap-1.5">
        <DollarSign className="w-3 h-3" /> Daily Budget
      </p>
      <div className="space-y-1.5">
        {days.map(day => (
          <div key={day.day} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-white/25 w-8 shrink-0">D{day.day}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((day.dayBudget ?? 0) / max) * 100}%` }}
                transition={{ duration: 0.6, delay: day.day * 0.05 }}
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
              />
            </div>
            <span className="text-[10px] font-black text-white/35 w-10 text-right shrink-0">
              ${day.dayBudget ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Streaming progress ────────────────────────────────────────────────────────
function StreamingView({ rawText }) {
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [rawText]);
  const daysFound = (rawText.match(/"day"\s*:/g) || []).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-teal-500/30 border-t-teal-500" />
          <Sparkles className="absolute inset-0 m-auto w-3.5 h-3.5 text-teal-400" />
        </div>
        <div>
          <p className="text-sm font-black italic uppercase tracking-tight text-white">Claude is planning your trip…</p>
          {daysFound > 0 && (
            <p className="text-[11px] text-teal-400/70">{daysFound} day{daysFound !== 1 ? 's' : ''} drafted so far</p>
          )}
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-[11px] text-white/40 leading-relaxed max-h-64 overflow-y-auto">
        {rawText.slice(-600)}
        <span className="animate-pulse text-teal-400">▋</span>
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ── Comments section ──────────────────────────────────────────────────────────
function CommentsSection({ tripId, comments, user }) {
  const [text,    setText]    = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [comments.length]);

  async function send() {
    if (!text.trim() || !user) return;
    setSending(true);
    try {
      await addComment(tripId, {
        uid: user.uid,
        displayName: user.displayName ?? 'Traveller',
        photoURL: user.photoURL ?? null,
        text: text.trim(),
      });
      setText('');
    } finally {
      setSending(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="space-y-4 pt-2">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 flex items-center gap-2">
        <MessageCircle className="w-3.5 h-3.5" /> Notes & Comments
        {comments.length > 0 && <span className="text-white/20">({comments.length})</span>}
      </p>

      {comments.length > 0 && (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 overflow-hidden text-[11px] font-black text-teal-400">
                {c.photoURL
                  ? <img src={c.photoURL} alt="" className="w-full h-full object-cover" />
                  : (c.displayName?.[0] ?? '?').toUpperCase()
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[11px] font-black text-white/70">{c.displayName}</span>
                  <span className="text-[10px] text-white/20">
                    {c.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? ''}
                  </span>
                </div>
                <p className="text-[12px] text-white/50 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {user && (
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a note… (Enter to send)"
            rows={2}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-teal-500/30 resize-none"
          />
          <button onClick={send} disabled={!text.trim() || sending}
            className="p-3 rounded-2xl bg-teal-500 disabled:opacity-30 text-white hover:bg-teal-400 transition-colors shrink-0">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TripDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPro } = usePlan(user?.uid);

  const [trip,     setTrip]     = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [spots,    setSpots]    = useState([]);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [genState, setGenState] = useState('idle');
  const [rawText,  setRawText]  = useState('');
  const [errMsg,   setErrMsg]   = useState('');
  const [activeTab,    setActiveTab]    = useState('itinerary');
  const [shareOpen,    setShareOpen]    = useState(false);
  const [shareCopied,  setShareCopied]  = useState(false);
  const [exportOpen,   setExportOpen]   = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  // Real-time trip subscription
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeTrip(id, t => {
      if (!t) { navigate('/trips'); return; }
      setTrip(t);
      setLoading(false);
    });
    const unsubComments = subscribeComments(id, setComments);
    return () => { unsub(); unsubComments(); };
  }, [id, navigate]);

  // Load spots when spotIds change
  const spotIdsKey = trip?.spotIds?.join(',') ?? '';
  useEffect(() => {
    if (!trip?.spotIds?.length) { setSpots([]); return; }
    getSpots(trip.spotIds).then(setSpots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotIdsKey]);

  async function handleGenerate() {
    if (!trip) return;
    // Regenerating an existing itinerary is a Pro feature
    if (trip.itinerary && !isPro) { setShowGate(true); return; }
    setGenState('streaming');
    setRawText('');
    setErrMsg('');
    const nights = Math.round(
      (new Date(trip.endDate + 'T00:00:00') - new Date(trip.startDate + 'T00:00:00')) / 86400000
    );
    try {
      const itinerary = await streamItinerary(
        { destination: trip.destination, nights, startDate: trip.startDate, spots, prefs: trip.prefs ?? {} },
        text => setRawText(text),
      );
      await saveItinerary(id, itinerary);
      setGenState('done');
    } catch (err) {
      setErrMsg(err.message);
      setGenState('error');
    }
  }

  const mutateItinerary = useCallback(updater => {
    setTrip(t => {
      const next = { ...t, itinerary: updater(t.itinerary) };
      saveItinerary(id, next.itinerary);
      return next;
    });
  }, [id]);

  function handleEditActivity(dayNum, actIdx, updated) {
    mutateItinerary(itin => ({
      ...itin,
      days: itin.days.map(d =>
        d.day === dayNum
          ? { ...d, activities: d.activities.map((a, i) => i === actIdx ? updated : a) }
          : d
      ),
    }));
  }

  function handleDeleteActivity(dayNum, actIdx) {
    mutateItinerary(itin => ({
      ...itin,
      days: itin.days.map(d =>
        d.day === dayNum
          ? { ...d, activities: d.activities.filter((_, i) => i !== actIdx) }
          : d
      ),
    }));
  }

  function handleAddActivity(dayNum, act) {
    mutateItinerary(itin => ({
      ...itin,
      days: itin.days.map(d =>
        d.day === dayNum
          ? { ...d, activities: [...(d.activities ?? []), act] }
          : d
      ),
    }));
  }

  async function handleShare() {
    if (!trip.isPublic) {
      await updateTrip(id, { isPublic: true });
      setTrip(t => ({ ...t, isPublic: true }));
    }
    setShareOpen(o => !o);
    setExportOpen(false);
  }

  async function copyShareUrl() {
    await navigator.clipboard.writeText(`${window.location.origin}/trip/${id}`);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  async function handleInvite() {
    if (!user) return;
    const inviteId = await createInvite(id, user.uid);
    await navigator.clipboard.writeText(`${window.location.origin}/invite/${inviteId}`);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 3000);
  }

  function toggleExport() {
    setExportOpen(o => !o);
    setShareOpen(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
    </div>
  );

  if (!trip) return null;

  const nights = trip.startDate && trip.endDate
    ? Math.round((new Date(trip.endDate + 'T00:00:00') - new Date(trip.startDate + 'T00:00:00')) / 86400000)
    : null;

  const isOwner = user?.uid === trip.createdBy;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20 space-y-10">
        {/* Back */}
        <button onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> My Trips
        </button>

        {/* Trip header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-4xl">{trip.destination?.emoji}</p>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">{trip.name}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Invite collaborator — owner only */}
              {isOwner && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleInvite}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                    inviteCopied
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                  }`}>
                  {inviteCopied
                    ? <><Check className="w-3.5 h-3.5" /> Copied</>
                    : <><UserPlus className="w-3.5 h-3.5" /> Invite</>
                  }
                </motion.button>
              )}
              {/* Generate button — pre-itinerary */}
              {!trip.itinerary && genState === 'idle' && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors">
                  <Sparkles className="w-4 h-4" /> Generate with Claude
                </motion.button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />{trip.destination?.city}, {trip.destination?.country}
            </span>
            {trip.startDate && trip.endDate && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
                <CalendarDays className="w-3.5 h-3.5 text-teal-500" />
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)} · {nights} night{nights !== 1 ? 's' : ''}
              </span>
            )}
            {spots.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />{spots.length} spot{spots.length !== 1 ? 's' : ''}
              </span>
            )}
            {trip.collaborators?.length > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
                <Users className="w-3.5 h-3.5 text-teal-500" />
                {trip.collaborators.length + 1} collaborator{trip.collaborators.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Streaming progress */}
        {genState === 'streaming' && <StreamingView rawText={rawText} />}

        {/* Error */}
        {genState === 'error' && (
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-black text-red-300">Generation failed</p>
              <p className="text-[12px] text-red-300/70">{errMsg}</p>
              <button onClick={handleGenerate}
                className="text-[11px] font-black uppercase tracking-wider text-teal-400 hover:text-teal-300 transition-colors">
                Try again →
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!trip.itinerary && genState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 rounded-[2rem] bg-white/5 border border-white/10 border-dashed">
            <Sparkles className="w-10 h-10 text-teal-400/40" />
            <div className="space-y-2">
              <p className="text-lg font-black italic uppercase tracking-tight text-white/30">No itinerary yet</p>
              <p className="text-sm text-white/20 max-w-xs">
                Hit "Generate with Claude" and we'll build a full day-by-day plan around your saved spots.
              </p>
            </div>
          </div>
        )}

        {/* Itinerary */}
        {trip.itinerary && genState !== 'streaming' && (
          <div className="space-y-8">
            {/* Summary bar */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <p className="text-[11px] font-black uppercase tracking-wider text-teal-400">
                    {trip.itinerary.days?.length}-day · Claude
                  </p>
                </div>
                {trip.itinerary.totalBudget && (
                  <p className="text-[11px] font-bold text-white/40 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />~${trip.itinerary.totalBudget}
                  </p>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={handleShare}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${shareOpen ? 'bg-teal-500 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                  <button onClick={toggleExport}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${exportOpen ? 'bg-white/15 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                    <FileDown className="w-3 h-3" /> Export <Caret className={`w-3 h-3 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={handleGenerate}
                    className="text-[11px] font-black uppercase tracking-wider text-teal-400/50 hover:text-teal-400 transition-colors pl-1">
                    Regen →
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {shareOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <input readOnly value={`${window.location.origin}/trip/${id}`}
                      className="flex-1 bg-transparent text-[11px] text-white/50 font-mono outline-none select-all cursor-text" />
                    <button onClick={copyShareUrl}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${shareCopied ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/60 hover:text-white'}`}>
                      {shareCopied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {exportOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="flex gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                    {[
                      { label: 'Markdown', icon: FileText, fn: () => exportMarkdown(trip) },
                      { label: 'JSON',     icon: FileJson, fn: () => exportJSON(trip)     },
                      { label: 'PDF',      icon: FileDown, fn: () => isPro ? exportPDF(trip) : setShowGate(true) },
                    ].map(({ label, icon: Icon, fn }) => (
                      <button key={label} onClick={() => { fn(); setExportOpen(false); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-wider text-white/50 hover:text-white hover:border-teal-500/30 transition-all">
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Budget breakdown */}
            {trip.itinerary.days?.some(d => d.dayBudget) && (
              <BudgetBar days={trip.itinerary.days} />
            )}

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
              {[['itinerary', List, 'Itinerary'], ['map', Map, 'Map']].map(([tab, Icon, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                      : 'text-white/40 hover:text-white/70'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>

            {/* General tips */}
            {activeTab === 'itinerary' && trip.itinerary.generalTips?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">General Tips</p>
                <div className="flex flex-col gap-2">
                  {trip.itinerary.generalTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12px] text-white/50">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />{tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day cards */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {(trip.itinerary.days ?? []).map((day, i) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    index={i}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onAddActivity={handleAddActivity}
                  />
                ))}
              </div>
            )}

            {/* Map tab */}
            {activeTab === 'map' && (
              <MapView spots={spots} className="h-[60vh]" />
            )}
          </div>
        )}

        {/* Comments — always visible when signed in */}
        {user && (
          <div className="border-t border-white/5 pt-8">
            <CommentsSection tripId={id} comments={comments} user={user} />
          </div>
        )}
      </main>

      {showGate && <ProGate onClose={() => setShowGate(false)} />}
    </div>
  );
}
