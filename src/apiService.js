// Budget tiers: '$' = budget, '$$' = comfort, '$$$' = premium
const FEATURE_DATA = {
  Phuket: {
    Morning: [
      { id: 'p1', title: 'Big Buddha Sunrise', subtitle: 'Karon, Phuket', category: 'Sightseeing', budget: '$', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' },
      { id: 'p2', title: 'Kata Beach Morning Swim', subtitle: 'Kata Beach — quiet before 9am', category: 'Beach', budget: '$', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
      { id: 'p3', title: 'Chalong Temple Visit', subtitle: 'Chalong', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'p4', title: 'Private Yacht Breakfast', subtitle: 'Ao Po Grand Marina', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'p5', title: 'Nai Harn Beach Walk', subtitle: "Rawai — locals' favourite, rarely crowded", category: 'Beach', budget: '$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'p6', title: 'Freedom Beach by Longtail', subtitle: 'Patong — hidden cove, boat access only', category: 'Beach', budget: '$$', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'p7', title: 'Phi Phi Island Day Trip', subtitle: 'Maya Bay — book speedboat in advance', category: 'Day Trip', budget: '$$', image: 'https://images.unsplash.com/photo-1537953391402-d83049195007?auto=format&fit=crop&q=80&w=800' },
      { id: 'p8', title: 'Phang Nga Bay & James Bond Island', subtitle: 'Departs Ao Por Pier, 8am', category: 'Day Trip', budget: '$$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
    ],
    Afternoon: [
      { id: 'p9', title: 'Old Phuket Town Walk', subtitle: 'Thalang Road — Sino-Portuguese shophouses', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
      { id: 'p10', title: 'Surin Beach Afternoon', subtitle: "Millionaire's Mile — upscale, calm water", category: 'Beach', budget: '$', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'p11', title: 'Thai Cooking Class', subtitle: 'Phuket Town — 3-hr hands-on class', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
      { id: 'p12', title: 'Aqua Club Spa & Massage', subtitle: 'Surin Beach — traditional Thai massage', category: 'Wellness', budget: '$$$', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
      { id: 'p13', title: 'Snorkelling at Coral Island', subtitle: 'Ko Hae — 20-min boat from Chalong', category: 'Adventure', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'p14', title: 'Kata Noi Secret Beach', subtitle: 'South Kata — best snorkelling off Phuket', category: 'Beach', budget: '$', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
      { id: 'p15', title: 'Similan Islands Dive Trip', subtitle: 'Full-day boat — top 10 dive sites worldwide', category: 'Day Trip', budget: '$$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'p16', title: 'Racha Yai Island Snorkel', subtitle: 'Closest crystal water day trip — 45-min boat', category: 'Day Trip', budget: '$$', image: 'https://images.unsplash.com/photo-1537953391402-d83049195007?auto=format&fit=crop&q=80&w=800' },
    ],
    Evening: [
      { id: 'pe1', title: 'Naka Weekend Night Market', subtitle: 'Naka Market — Sat & Sun only, huge local food scene', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe2', title: 'Blue Elephant Fine Dining', subtitle: 'Krabi Road — Thai royal cuisine in a colonial mansion', category: 'Dining', budget: '$$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe3', title: 'Rooftop Sunset at SAii', subtitle: 'Karon Beach — golden hour views over Andaman', category: 'Nightlife', budget: '$$', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe4', title: 'Malin Plaza Street Food', subtitle: 'Patong — 60+ stalls, mango sticky rice & pad see ew', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe5', title: 'Muay Thai Fight Night', subtitle: 'Bangla Boxing Stadium — authentic fights Tue/Fri/Sat', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe6', title: 'Kopitiam Dinner in Old Town', subtitle: 'Thalang Rd — legendary Peranakan dishes, queue early', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe7', title: 'Seafood Dinner at Kan Eang 2', subtitle: 'Chalong Bay — fresh catch, tables on the pier', category: 'Dining', budget: '$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
      { id: 'pe8', title: 'Promthep Cape Sunset', subtitle: 'Rawai — best sunset on the island, arrive 30 min early', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  Krabi: {
    Morning: [
      { id: 'k1', title: 'Tiger Cave Temple Climb', subtitle: 'Krabi Town', category: 'Adventure', budget: '$', image: 'https://images.unsplash.com/photo-1601334808386-dd013c77ea1b?auto=format&fit=crop&q=80&w=800' },
      { id: 'k2', title: 'Railay Beach Rock Climbing', subtitle: 'Railay East', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800' },
      { id: 'k3', title: 'Kayaking Through Mangroves', subtitle: 'Ao Thalane', category: 'Nature', budget: '$$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'k4', title: 'Hot Spring Forest Trek', subtitle: 'Khlong Thom', category: 'Adventure', budget: '$', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=800' },
      { id: 'k5', title: 'Private Longtail to 4 Islands', subtitle: 'Krabi Pier', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1537953391402-d83049195007?auto=format&fit=crop&q=80&w=800' },
    ],
    Afternoon: [
      { id: 'k6', title: 'Phi Phi Island Tour', subtitle: 'Maya Bay', category: 'Nature', budget: '$$', image: 'https://images.unsplash.com/photo-1537953391402-d83049195007?auto=format&fit=crop&q=80&w=800' },
      { id: 'k7', title: 'Emerald Pool Dip', subtitle: 'Khao Phra Bang', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=800' },
      { id: 'k8', title: 'Inland Waterfall Hike', subtitle: 'Than Bok Khorani', category: 'Adventure', budget: '$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'k9', title: 'Thai Massage at Railay', subtitle: 'Railay West', category: 'Wellness', budget: '$$', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
      { id: 'k10', title: 'Sunset Cruise Premium', subtitle: 'Andaman Sea', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
    ],
    Evening: [
      { id: 'k11', title: 'Ao Nang Night Market', subtitle: 'Ao Nang', category: 'Lifestyle', budget: '$', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'k12', title: 'The Grotto Candlelit Dinner', subtitle: 'Railay', category: 'Dining', budget: '$$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
      { id: 'k13', title: 'Seafood BBQ on the Beach', subtitle: 'Ao Nang Beach', category: 'Dining', budget: '$$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'k14', title: 'Firefly Boat Tour', subtitle: 'Bang Ben River', category: 'Nature', budget: '$$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'k15', title: 'Reggae Bar Live Music', subtitle: 'Ao Nang', category: 'Nightlife', budget: '$', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  Bangkok: {
    Morning: [
      { id: 'b1', title: 'Grand Palace Tour', subtitle: 'Phra Nakhon', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'b2', title: 'Wat Arun Sunrise', subtitle: 'Chao Phraya River', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1563492063799-9aa770d3fdb2?auto=format&fit=crop&q=80&w=800' },
      { id: 'b3', title: 'Or Tor Kor Fresh Market', subtitle: 'Chatuchak', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'b4', title: 'Floating Market Boat Tour', subtitle: 'Damnoen Saduak', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'b5', title: 'Mandarin Oriental Breakfast', subtitle: 'Charoen Krung', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
    ],
    Afternoon: [
      { id: 'b6', title: 'Siam Square & MBK Shopping', subtitle: 'Pathum Wan', category: 'Lifestyle', budget: '$$', image: 'https://images.unsplash.com/photo-1502602898657-3e91764c9742?auto=format&fit=crop&q=80&w=800' },
      { id: 'b7', title: 'Lumphini Park Picnic', subtitle: 'Rama IV', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800' },
      { id: 'b8', title: 'Jim Thompson House', subtitle: 'Wang Mai', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'b9', title: 'Four Seasons Spa', subtitle: 'Chao Phraya', category: 'Wellness', budget: '$$$', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
      { id: 'b10', title: 'Chatuchak Weekend Market', subtitle: 'Chatuchak', category: 'Lifestyle', budget: '$', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
    ],
    Evening: [
      { id: 'b11', title: 'Sky Bar at Lebua State Tower', subtitle: 'Silom Road', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'b12', title: 'Yaowarat Chinatown Street Food', subtitle: 'Yaowarat', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'b13', title: 'Thonglor Rooftop Bar Hop', subtitle: 'Sukhumvit 55', category: 'Nightlife', budget: '$$', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'b14', title: 'Muay Thai Live at Rajadamnern', subtitle: 'Ratchadamnoen Nok', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'b15', title: 'Dinner Cruise on Chao Phraya', subtitle: 'River City Pier', category: 'Dining', budget: '$$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  'Chiang Mai': {
    Morning: [
      { id: 'cm1', title: 'Doi Suthep Trek', subtitle: 'Doi Suthep Mountain', category: 'Adventure', budget: '$', image: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm2', title: 'Elephant Nature Park', subtitle: 'Mae Rim', category: 'Nature', budget: '$$$', image: 'https://images.unsplash.com/photo-1581850518616-681f1c72f3d1?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm3', title: 'Morning Monk Alms Ceremony', subtitle: 'Old City', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1528654813511-c9664687d904?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm4', title: 'Doi Inthanon Summit Drive', subtitle: 'Doi Inthanon NP', category: 'Nature', budget: '$$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm5', title: 'Muay Thai Morning Training', subtitle: 'Loi Kroh Road', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
    ],
    Afternoon: [
      { id: 'cm6', title: 'Old City Temple Tour', subtitle: 'Wat Phra Singh', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1528654813511-c9664687d904?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm7', title: 'Nimman Road Cafe Hop', subtitle: 'Nimmanhaemin', category: 'Lifestyle', budget: '$$', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7a55?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm8', title: 'Thai Cooking Class', subtitle: 'Old City', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm9', title: 'Lanna Spa Ritual', subtitle: 'Nimmanhaemin', category: 'Wellness', budget: '$$$', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm10', title: 'Royal Flora Ratchaphruek Garden', subtitle: 'Mae Hia', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800' },
    ],
    Evening: [
      { id: 'cm11', title: 'Saturday Night Bazaar', subtitle: 'Wualai Road', category: 'Lifestyle', budget: '$', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm12', title: 'Riverside Jazz Dinner', subtitle: 'Ping River', category: 'Dining', budget: '$$$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm13', title: 'Khao Soi Street Bowl', subtitle: 'Chang Phueak Gate', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm14', title: 'Zoe in Yellow Bar', subtitle: 'Ratchaphakhinai Road', category: 'Nightlife', budget: '$$', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm15', title: 'Dhara Dhevi Tasting Menu', subtitle: 'Mae Rim Road', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
    ],
  },
};

const DESTINATION_TIPS = {
  Phuket: {
    beaches: [
      { name: 'Kata Noi', note: 'Best snorkelling off Phuket, quieter than Kata proper', vibe: 'Secluded' },
      { name: 'Nai Harn', note: "Locals' favourite — rarely overrun, great swimming May–Oct", vibe: 'Local' },
      { name: 'Surin', note: "Millionaire's Mile — calm water, upscale beach clubs", vibe: 'Upscale' },
      { name: 'Freedom Beach', note: 'Longtail boat access only — stunning hidden cove off Patong', vibe: 'Hidden' },
      { name: 'Kamala', note: 'Quiet family-friendly bay, great sunsets, calmer waves', vibe: 'Relaxed' },
      { name: 'Patong', note: 'Busiest beach — best for people-watching, strong currents in monsoon', vibe: 'Lively' },
    ],
    dayTrips: [
      { name: 'Phi Phi Islands', duration: 'Full day', note: 'Book speedboat in advance — Maya Bay has timed entry. Go early to beat crowds.', budget: '$$' },
      { name: 'Phang Nga Bay', duration: 'Full day', note: 'James Bond Island + sea caves by longtail. Departs Ao Por Pier 8am.', budget: '$$' },
      { name: 'Similan Islands', duration: 'Full day', note: 'World-class diving and snorkelling. Book through a certified dive operator.', budget: '$$$' },
      { name: 'Racha Yai', duration: 'Half day', note: 'Closest crystal-clear water day trip — 45-min speedboat, stunning visibility.', budget: '$$' },
    ],
    food: [
      { name: 'Naka Weekend Night Market', note: 'Best local food scene on the island — Sat & Sun evenings only' },
      { name: 'Kopitiam by Wilai', note: 'Legendary Peranakan dishes on Thalang Rd — queue before opening' },
      { name: 'Malin Plaza', note: 'Patong street food hub — mango sticky rice, pad see ew, 60+ stalls' },
      { name: 'Kan Eang 2', note: 'Chalong Bay pier restaurant — best fresh seafood at sunset' },
      { name: 'Roti Stands in Patong', note: 'Late-night roti with condensed milk — a Phuket classic under 50 THB' },
    ],
    gettingAround: [
      'Use Grab (Thailand\'s Uber) for transparent fares — avoids tuk-tuk price inflation',
      'Tuk-tuks charge 200–500 THB per trip — always agree on price before boarding',
      'Scooter rental is available but Phuket roads are challenging; many tourist accidents',
      'Songthaews (shared pickup trucks) run fixed routes for ~30 THB between Patong and Kata',
      'For day trips, book via your hotel or a licensed operator rather than beach touts',
    ],
    thingsToAvoid: [
      'Jet ski scams: damage is fabricated after you return — photograph the ski before use or skip it',
      'Gem store scams: tuk-tuk drivers earn commission taking tourists to "special discount" stores',
      'Bangla Road at night: fun to walk, but keep bags front-facing and watch your drinks',
      'Overpriced hotel tour desks: identical day trips are 40–60% cheaper through local operators',
      'Red-flag beaches during May–Oct: Patong and Karon have strong monsoon currents — respect flags',
      'May weather heads-up: onset of monsoon season — afternoon storms are common but usually brief',
    ],
  },
  Krabi: {
    beaches: [
      { name: 'Railay West', note: 'Accessible only by longtail — limestone-cliff backdrop, stunning', vibe: 'Dramatic' },
      { name: 'Phra Nang Cave', note: 'Arguably most beautiful beach in Thailand — worth the longtail ride', vibe: 'Legendary' },
      { name: 'Ao Nang', note: 'Main hub — good base for eating and boat trips', vibe: 'Convenient' },
      { name: 'Koh Lanta', note: 'Long sandy beaches, quieter pace — day trip or overnight', vibe: 'Relaxed' },
    ],
    dayTrips: [
      { name: '4 Islands Tour', duration: 'Full day', note: 'Snorkelling across four islands — classic Krabi day trip with most operators', budget: '$$' },
      { name: 'Phi Phi Islands', duration: 'Full day', note: 'Closer from Krabi than Phuket — speedboat recommended for more island time', budget: '$$' },
      { name: 'Tiger Cave Temple', duration: 'Half day', note: '1,237 steps to a 360° hilltop view — go at sunrise or late afternoon', budget: '$' },
    ],
    food: [
      { name: 'Ao Nang Night Market', note: 'Best local eats in Krabi — fresh seafood grilled to order' },
      { name: 'Ton Kee Seafood', note: 'Local favourite near Krabi Town — cheaper than beachside restaurants' },
      { name: 'Pad Thai stalls', note: 'Street-side stalls around Krabi Town serve some of the best pad thai in the south' },
    ],
    gettingAround: [
      'Long-tail boats are the main transport between beaches — always negotiate price first',
      'Krabi Town is 30 min from Ao Nang — songthaew runs regularly for ~60 THB',
      'Grab works in Ao Nang and Krabi Town',
      'Scooter rental is manageable here — roads are calmer than Phuket',
    ],
    thingsToAvoid: [
      'Cheapest Phi Phi tour operators — underpowered boats make for rough and slow journeys',
      'Swimming near longtail boat engines — prop injuries are a real risk in busy channels',
      'Monsoon season (May–Oct): some islands close temporarily due to rough seas',
    ],
  },
  Bangkok: {
    beaches: [],
    dayTrips: [
      { name: 'Ayutthaya', duration: 'Full day', note: 'Ancient capital — hire a tuk-tuk to cover all ruins efficiently in one day', budget: '$' },
      { name: 'Damnoen Saduak Floating Market', duration: 'Half day', note: 'Go before 8am — tourist boats clog the canals quickly', budget: '$$' },
      { name: 'Kanchanaburi', duration: 'Full day', note: 'Bridge on the River Kwai, WWII history, jungle waterfalls', budget: '$$' },
    ],
    food: [
      { name: 'Yaowarat Chinatown', note: "Bangkok's best street food street — go after 7pm when stalls fully open" },
      { name: 'Or Tor Kor Market', note: 'Premium fresh produce and cooked food near Chatuchak' },
      { name: 'Jay Fai', note: 'Michelin-starred street food — the crab omelette is iconic, queue hours early' },
      { name: 'Boat Noodle Alley', note: 'Victory Monument area — tiny bowls from 15 THB, stack them up' },
    ],
    gettingAround: [
      'BTS Skytrain and MRT cover most tourist areas — buy a Rabbit card for easy top-ups',
      'Grab is reliable and beats metered taxis for fair pricing',
      'River taxi on Chao Phraya is scenic and cheap — stops near Grand Palace and Wat Arun',
      'Avoid taxis that refuse the meter near tourist spots — this is illegal but common',
    ],
    thingsToAvoid: [
      'Tuk-tuk "sightseeing" offers for 20 THB — always end at gem or tailor shops earning commission',
      'Grand Palace closed scam: men outside the gate falsely say it\'s closed and offer tours elsewhere',
      'Fake monks near temples asking for donations or blessings',
      'Tap water: drink bottled water only throughout Thailand',
    ],
  },
  'Chiang Mai': {
    beaches: [],
    dayTrips: [
      { name: 'Doi Inthanon National Park', duration: 'Full day', note: "Thailand's highest peak, twin royal chedis, waterfalls — hire a driver (600–800 THB)", budget: '$$' },
      { name: 'Elephant Nature Park', duration: 'Full day', note: 'Best ethical elephant sanctuary in Thailand — book weeks in advance, fills fast', budget: '$$$' },
      { name: 'Chiang Rai', duration: 'Full day or overnight', note: 'White Temple, Blue Temple, Golden Triangle region — 3h drive north', budget: '$$' },
      { name: 'Sticky Waterfall', duration: 'Half day', note: 'Unique calcite waterfall you can walk up barefoot — 1h north of Chiang Mai', budget: '$' },
    ],
    food: [
      { name: 'Khao Soi', note: "Chiang Mai's signature dish — coconut curry noodle soup, try Khao Soi Khun Yai" },
      { name: 'Sunday Night Bazaar', note: 'Wualai Road — best market for Northern Thai snacks and handicrafts' },
      { name: 'Chang Phueak Gate stalls', note: 'Local dinner spot — grilled meats, pad krapow, sai ua sausage from ~50 THB' },
      { name: 'Nimman cafes', note: 'Thai-western specialty coffee scene — Ristr8to is world-renowned' },
    ],
    gettingAround: [
      'Scooter rental is the best way to explore — roads are manageable, 200–300 THB/day',
      'Songthaews (red shared trucks) around the old city for ~30 THB — flag them down',
      'Grab works throughout Chiang Mai city',
      'Cycling around the Old City moat is a great way to temple-hop at your own pace',
    ],
    thingsToAvoid: [
      'Elephant riding: most ethical sanctuaries only offer walking with and feeding elephants — check carefully',
      'Buying hill tribe handicrafts from street touts — support community-run shops directly',
      'Burning season (Feb–April): severe air quality — check AQI if you have respiratory sensitivities',
      'Night Safari: quality has declined sharply, better wildlife experiences are available in the region',
    ],
  },
};

export const getDestinationTips = (destination) => DESTINATION_TIPS[destination] || null;

// Budget tier hierarchy — higher tier includes lower tiers
const BUDGET_RANK = { '$': 1, '$$': 2, '$$$': 3 };

export const fetchWeather = async (destination) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error('Location not found');
    const { latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,uv_index_max&hourly=temperature_2m&timezone=auto&forecast_days=1`
    );
    const weatherData = await weatherRes.json();
    return {
      maxTemp: weatherData.daily.temperature_2m_max[0],
      precipProb: weatherData.daily.precipitation_probability_max[0],
      maxUv: weatherData.daily.uv_index_max[0],
      hourly: weatherData.hourly.temperature_2m.slice(6, 22),
    };
  } catch {
    return { maxTemp: 30, precipProb: 10, maxUv: 7, hourly: Array(16).fill(30) };
  }
};

export const fetchItinerary = async (prefs) => {
  const { destination, budget = '$$', noctourism } = prefs;

  const curated = FEATURE_DATA[destination];
  const budgetRank = BUDGET_RANK[budget] ?? 2;

  // Filter curated activities to those within or at the selected budget tier
  const filterByBudget = (activities) =>
    activities.filter(a => BUDGET_RANK[a.budget] <= budgetRank);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800',
  ];

  try {
    const proxyBase = import.meta.env.VITE_FUNCTIONS_BASE_URL || '';
    const url = `${proxyBase}/api/places?destination=${encodeURIComponent(destination)}`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results || [];

    const pools = {
      Morning: curated ? filterByBudget(curated.Morning) : [],
      Afternoon: curated ? filterByBudget(curated.Afternoon) : [],
      Evening: curated ? filterByBudget(curated.Evening) : [],
    };

    results.forEach((place, index) => {
      const item = {
        id: place.fsq_id || `live_${index}`,
        title: place.name || 'Unknown Place',
        subtitle: place.location?.formatted_address || 'Address Hidden',
        category: place.categories?.[0]?.name || 'Activity',
        budget: '$$',
        image: fallbackImages[index % fallbackImages.length],
      };
      const cat = item.category.toLowerCase();
      if (cat.includes('cafe') || cat.includes('breakfast')) pools.Morning.push(item);
      else if (cat.includes('bar') || cat.includes('night') || cat.includes('dinner')) pools.Evening.push(item);
      else pools.Afternoon.push(item);
    });

    // Noctourism mode — promote evening pool to the front
    if (noctourism) {
      pools.Evening = [...pools.Evening].sort(() => Math.random() - 0.5);
    }

    return {
      Morning: pools.Morning.slice(0, 8),
      Afternoon: pools.Afternoon.slice(0, 8),
      Evening: pools.Evening.slice(0, 8),
    };
  } catch {
    if (!curated) return null;
    return {
      Morning: filterByBudget(curated.Morning),
      Afternoon: filterByBudget(curated.Afternoon),
      Evening: filterByBudget(curated.Evening),
    };
  }
};
