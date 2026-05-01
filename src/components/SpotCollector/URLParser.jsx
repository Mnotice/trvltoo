import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Loader2, CheckCircle, AlertCircle, MapPin, Tag } from 'lucide-react';
import { detectSource, parseGoogleMapsUrl, hostnameToName, SOURCE_LABELS } from '../../utils/urlParser';

const CATEGORIES = [
  { id: 'food', emoji: '🍜' }, { id: 'attraction', emoji: '🏛️' },
  { id: 'nature', emoji: '🌿' }, { id: 'hotel', emoji: '🛏️' },
  { id: 'shopping', emoji: '🛍️' }, { id: 'nightlife', emoji: '🌙' },
  { id: 'experience', emoji: '✨' }, { id: 'other', emoji: '📍' },
];

async function parseUrl(url) {
  // Fast path: Google Maps long URLs can be parsed client-side
  const source = detectSource(url);
  if (source === 'google-maps') {
    const result = parseGoogleMapsUrl(url);
    if (result) return { ...result, source };
  }

  // Slow path: Vercel API route (follows redirects, fetches OG tags)
  try {
    const resp = await fetch(`/api/parse-url?url=${encodeURIComponent(url)}`);
    if (resp.ok) return await resp.json();
  } catch { /* network error — fall back to hostname extraction */ }

  // Last resort: return hostname as name
  return { name: hostnameToName(url), address: '', imageUrl: '', notes: '', coordinates: null, source };
}

export default function URLParser({ onSave, onClose }) {
  const [url, setUrl]       = useState('');
  const [status, setStatus] = useState('idle'); // idle | parsing | done | error
  const [parsed, setParsed] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm]     = useState({ name: '', address: '', category: '', notes: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  const source = url ? detectSource(url) : null;
  const srcMeta = source ? SOURCE_LABELS[source] : null;

  async function handleParse() {
    if (!url.trim()) return;
    setStatus('parsing');
    setErrMsg('');
    try {
      const data = await parseUrl(url.trim());
      if (data.error) { setStatus('error'); setErrMsg(data.error); return; }
      setParsed(data);
      setForm({
        name:     data.name     || '',
        address:  data.address  || '',
        category: '',
        notes:    data.notes    || '',
        imageUrl: data.imageUrl || '',
      });
      setStatus('done');
    } catch {
      setStatus('error');
      setErrMsg('Something went wrong. You can still fill in the details manually below.');
      setForm({ name: '', address: '', category: '', notes: '', imageUrl: '' });
      setStatus('done');
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData?.getData('text') || '';
    if (pasted.startsWith('http')) {
      setTimeout(() => handleParse(), 50);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (!form.category) return;
    setSaving(true);
    try {
      await onSave({
        name:        form.name.trim(),
        address:     form.address.trim(),
        category:    form.category,
        notes:       form.notes.trim(),
        imageUrl:    form.imageUrl.trim(),
        source:      parsed?.source || 'url',
        sourceUrl:   url.trim(),
        coordinates: parsed?.coordinates || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5">
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Paste a Link</h2>
              <p className="text-[11px] text-white/40 font-medium mt-0.5">Google Maps, Instagram, TikTok, or any page</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          <div className="px-7 pb-7 space-y-5">
            {/* URL input */}
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setStatus('idle'); }}
                onPaste={handlePaste}
                placeholder="Paste a URL…"
                className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleParse}
                disabled={!url.trim() || status === 'parsing'}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-teal-500 text-white text-[11px] font-black uppercase tracking-wider disabled:opacity-40 hover:bg-teal-400 transition-colors"
              >
                {status === 'parsing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Extract'}
              </motion.button>
            </div>

            {/* Source badge */}
            {srcMeta && url && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-wider ${srcMeta.bg} ${srcMeta.color}`}>
                <span>{srcMeta.emoji}</span> {srcMeta.label}
              </motion.div>
            )}

            {/* Error */}
            {status === 'error' && errMsg && (
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-300">{errMsg}</p>
              </div>
            )}

            {/* Preview image */}
            {status === 'done' && form.imageUrl && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="h-36 rounded-2xl overflow-hidden">
                <img src={form.imageUrl} alt="" onError={e => e.target.style.display = 'none'}
                  className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Editable fields — shown after extraction (or on error as manual fallback) */}
            {status === 'done' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {parsed?.name && (
                  <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Data extracted — review and confirm below
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Place Name *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Nahm Restaurant"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Address or Area</label>
                  <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g. Silom, Bangkok"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors" />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Category *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} type="button" onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                          form.category === cat.id
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                            : 'bg-white/5 border border-white/10 text-white/50 hover:border-teal-500/40'
                        }`}>
                        <span>{cat.emoji}</span> {cat.id}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.category || saving}
                  className="w-full py-4 rounded-full bg-teal-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Spot'}
                </motion.button>
              </motion.div>
            )}

            {/* Idle hint */}
            {status === 'idle' && (
              <p className="text-[11px] text-white/25 text-center">
                Paste any URL above — we'll try to extract the name, photo, and location automatically.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
