const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

const DEST_IMAGES = {
  'Phuket':      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80&w=1200',
  'Krabi':       'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200',
  'Bangkok':     'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1200',
  'Chiang Mai':  'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=1200',
  'Koh Samui':   'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=1200',
  'Koh Phangan': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
  'Koh Tao':     'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
  'Chiang Rai':  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1200',
  'Ayutthaya':   'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=80&w=1200',
  'Hua Hin':     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200',
  'Pai':         'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=1200',
  'Koh Lanta':   'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1200',
};

const FALLBACK = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200';

const buildHtml = (trip, tripId, appBase) => {
  const dest   = trip.destination || 'Thailand';
  const image  = DEST_IMAGES[dest] || FALLBACK;
  const title  = `${dest} Itinerary — ${trip.persona || 'Traveller'} · ${trip.budget || '$$'} · TRVLTOO`;
  const desc   = trip.insight
    ? trip.insight.substring(0, 200)
    : `A ${trip.persona || 'curated'} day in ${dest}. Planned with TRVLTOO.`;
  const url    = `${appBase}/trip/${tripId}`;
  const slots  = trip.slots || {};
  const tags   = [trip.arrivalDate, trip.persona, trip.budget, trip.area].filter(Boolean);

  const slotHtml = ['Morning', 'Afternoon', 'Evening'].map(slot => {
    const act = slots[slot];
    return `<div class="slot">
      <div class="slot-label ${slot.toLowerCase()}">${slot}</div>
      ${act
        ? `<div class="slot-title">${act.title}</div><div class="slot-sub">${act.subtitle || ''}</div>`
        : `<div class="slot-title empty">—</div>`}
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${url}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${image}" />
  <meta property="og:site_name"   content="TRVLTOO" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${image}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#020617;color:#f8fafc;font-family:'DM Sans',sans-serif;min-height:100vh}
    .wrap{max-width:680px;margin:0 auto;padding:48px 24px 80px}
    .brand{font-size:11px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:#14b8a6;margin-bottom:40px}
    .hero{position:relative;height:240px;border-radius:28px;overflow:hidden;margin-bottom:32px}
    .hero img{width:100%;height:100%;object-fit:cover}
    .hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(2,6,23,.9) 0%,transparent 60%)}
    .dest{position:absolute;bottom:20px;left:24px}
    .dest-label{font-size:10px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:#14b8a6;margin-bottom:4px}
    .dest-name{font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;letter-spacing:-.04em;text-transform:uppercase;line-height:1}
    .tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
    .tag{padding:6px 14px;border-radius:100px;background:rgba(255,255,255,.08);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5)}
    .insight{padding:20px 24px;border-radius:20px;background:rgba(20,184,166,.08);border:1px solid rgba(20,184,166,.2);margin-bottom:32px}
    .insight-label{font-size:10px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:#14b8a6;margin-bottom:8px}
    .insight-text{font-size:15px;line-height:1.6;color:rgba(255,255,255,.7);font-style:italic}
    .slots{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:40px}
    .slot{padding:16px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
    .slot-label{font-size:9px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;margin-bottom:6px}
    .slot-label.morning{color:#fbbf24}.slot-label.afternoon{color:#38bdf8}.slot-label.evening{color:#818cf8}
    .slot-title{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;line-height:1.3;color:#fff}
    .slot-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:4px}
    .empty{color:rgba(255,255,255,.2);font-style:italic}
    .cta{display:block;text-align:center;padding:18px 32px;border-radius:100px;background:#fff;color:#020617;font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;text-decoration:none}
    .cta:hover{opacity:.9}
    @media(max-width:480px){.slots{grid-template-columns:1fr}.dest-name{font-size:32px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="brand">TRVLTOO — Shared Itinerary</div>
    <div class="hero">
      <img src="${image}" alt="${dest}" />
      <div class="hero-overlay"></div>
      <div class="dest">
        <div class="dest-label">Destination</div>
        <div class="dest-name">${dest}</div>
      </div>
    </div>
    ${tags.length ? `<div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    ${trip.insight ? `<div class="insight"><div class="insight-label">Agent Insight</div><div class="insight-text">${trip.insight}</div></div>` : ''}
    <div class="slots">${slotHtml}</div>
    <a href="${appBase}" class="cta">Plan Your Own Trip →</a>
  </div>
</body>
</html>`;
};

exports.tripcard = onRequest(
  { cors: false, region: 'us-central1', timeoutSeconds: 10 },
  async (req, res) => {
    const parts  = req.path.split('/').filter(Boolean);
    const tripId = parts[parts.length - 1];
    const appBase = 'https://mnotice.github.io/trvltoo';

    if (!tripId || tripId === 'trip') {
      res.redirect(302, appBase);
      return;
    }

    try {
      const snap = await db.collection('trips').doc(tripId).get();
      if (!snap.exists) {
        res.redirect(302, appBase);
        return;
      }
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
      res.set('Content-Type', 'text/html; charset=utf-8');
      res.send(buildHtml(snap.data(), tripId, appBase));
    } catch {
      res.redirect(302, appBase);
    }
  }
);
