import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Tag, FileText, Image, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'food',       label: 'Food & Drink',  emoji: '🍜' },
  { id: 'attraction', label: 'Attraction',     emoji: '🏛️' },
  { id: 'nature',     label: 'Nature',         emoji: '🌿' },
  { id: 'hotel',      label: 'Stay',           emoji: '🛏️' },
  { id: 'shopping',   label: 'Shopping',       emoji: '🛍️' },
  { id: 'nightlife',  label: 'Nightlife',      emoji: '🌙' },
  { id: 'experience', label: 'Experience',     emoji: '✨' },
  { id: 'other',      label: 'Other',          emoji: '📍' },
];

const EMPTY = { name: '', address: '', category: '', notes: '', imageUrl: '' };

export default function ManualEntryForm({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.category)    { setError('Pick a category'); return; }
    setSaving(true);
    try {
      await onSave({
        name:     form.name.trim(),
        address:  form.address.trim(),
        category: form.category,
        notes:    form.notes.trim(),
        imageUrl: form.imageUrl.trim(),
        source:   'manual',
        coordinates: null,
      });
      onClose();
    } catch (err) {
      setError('Failed to save. Try again.');
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
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Add a Spot</h2>
              <p className="text-[11px] text-white/40 font-medium mt-0.5">Save a place you want to visit</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Place Name *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Nahm Restaurant"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Address or Area
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="e.g. Silom, Bangkok"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Category *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set('category', cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                      form.category === cat.id
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:border-teal-500/40'
                    }`}
                  >
                    <span>{cat.emoji}</span> {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-1.5">
                <Image className="w-3 h-3" /> Image URL
                <span className="normal-case tracking-normal font-medium opacity-60">(optional)</span>
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Notes
                <span className="normal-case tracking-normal font-medium opacity-60 ml-1">(optional)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Why you want to go, best time to visit…"
                rows={2}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-[12px] font-bold text-red-400">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-full bg-teal-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Spot'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
