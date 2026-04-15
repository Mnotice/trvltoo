// Budget tiers: '$' = budget, '$$' = comfort, '$$$' = premium
const FEATURE_DATA = {
  Phuket: {
    Morning: [
      { id: 'p1', title: 'Big Buddha Sunrise', subtitle: 'Karon, Phuket', category: 'Sightseeing', budget: '$', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' },
      { id: 'p2', title: 'Kata Beach Surf Lesson', subtitle: 'Kata Beach', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
      { id: 'p3', title: 'Chalong Temple Visit', subtitle: 'Chalong', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'p4', title: 'Private Yacht Breakfast', subtitle: 'Ao Po Grand Marina', category: 'Luxury', budget: '$$$', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'p5', title: 'Kamala Beach Walk', subtitle: 'Kamala', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
    ],
    Afternoon: [
      { id: 'p6', title: 'Old Phuket Town Walk', subtitle: 'Thalang Road', category: 'Culture', budget: '$', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
      { id: 'p7', title: 'Promthep Cape View', subtitle: 'Rawai', category: 'Nature', budget: '$', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'p8', title: 'Thai Cooking Class', subtitle: 'Phuket Town', category: 'Culture', budget: '$$', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
      { id: 'p9', title: 'Aqua Club Spa Session', subtitle: 'Surin Beach', category: 'Wellness', budget: '$$$', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
      { id: 'p10', title: 'Snorkelling at Coral Island', subtitle: 'Ko Hae', category: 'Adventure', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
    ],
    Evening: [
      { id: 'p11', title: 'Patong Night Market', subtitle: 'Bangla Road', category: 'Lifestyle', budget: '$', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
      { id: 'p12', title: 'Blue Elephant Fine Dining', subtitle: 'Krabi Road', category: 'Dining', budget: '$$$', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
      { id: 'p13', title: 'Rooftop Bar at SAii', subtitle: 'Karon Beach', category: 'Nightlife', budget: '$$', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'p14', title: 'Street Food at Malin Plaza', subtitle: 'Patong', category: 'Dining', budget: '$', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'p15', title: 'Muay Thai Fight Night', subtitle: 'Bangla Boxing Stadium', category: 'Sports', budget: '$$', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
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
