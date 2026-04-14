const FEATURE_DATA = {
  Phuket: {
    Morning: [
      { id: 'p1', title: 'Big Buddha Sunrise', subtitle: 'Karon, Phuket', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' },
      { id: 'p2', title: 'Kata Beach Surf', subtitle: 'Kata Beach', category: 'Sports', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'p3', title: 'Old Phuket Town Walk', subtitle: 'Thalang Road', category: 'Culture', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
      { id: 'p4', title: 'Promthep Cape View', subtitle: 'Rawai', category: 'Nature', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'p5', title: 'Patong Night Market', subtitle: 'Bangla Road', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
      { id: 'p6', title: 'Blue Elephant Dinner', subtitle: 'Krabi Road', category: 'Dining', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  Krabi: {
    Morning: [
      { id: 'k1', title: 'Tiger Cave Temple', subtitle: 'Krabi Town', category: 'Adventure', image: 'https://images.unsplash.com/photo-1601334808386-dd013c77ea1b?auto=format&fit=crop&q=80&w=800' },
      { id: 'k2', title: 'Railay Beach Rock Climbing', subtitle: 'Railay East', category: 'Sports', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'k3', title: 'Phi Phi Island Tour', subtitle: 'Maya Bay', category: 'Nature', image: 'https://images.unsplash.com/photo-1537953391402-d83049195007?auto=format&fit=crop&q=80&w=800' },
      { id: 'k4', title: 'Emerald Pool Dip', subtitle: 'Khao Phra Bang', category: 'Nature', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'k5', title: 'Ao Nang Night Market', subtitle: 'Ao Nang', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'k6', title: 'The Grotto Dinner', subtitle: 'Railay', category: 'Luxury', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  Bangkok: {
     Morning: [
      { id: 'b1', title: 'Grand Palace Tour', subtitle: 'Grand Palace', category: 'Culture', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'b2', title: 'Wat Arun Walk', subtitle: 'Chao Phraya River', category: 'Culture', image: 'https://images.unsplash.com/photo-1563492063799-9aa770d3fdb2?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'b3', title: 'Siam Square Shopping', subtitle: 'Pathum Wan', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1502602898657-3e91764c9742?auto=format&fit=crop&q=80&w=800' },
      { id: 'b4', title: 'Lumphini Park Nap', subtitle: 'Rama IV', category: 'Nature', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'b5', title: 'Sky Bar Lebua', subtitle: 'Silom Road', category: 'Luxury', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'b6', title: 'Chinatown Street Food', subtitle: 'Yaowarat', category: 'Dining', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Chiang Mai': {
     Morning: [
      { id: 'cm1', title: 'Doi Suthep Trek', subtitle: 'Doi Suthep Mountain', category: 'Adventure', image: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm2', title: 'Elephant Rescue Park', subtitle: 'Mae Rim', category: 'Nature', image: 'https://images.unsplash.com/photo-1581850518616-681f1c72f3d1?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'cm3', title: 'Old City Temple Tour', subtitle: 'Wat Phra Singh', category: 'Culture', image: 'https://images.unsplash.com/photo-1528654813511-c9664687d904?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm4', title: 'Nimman Road Cafe Hop', subtitle: 'Nimmanhaemin', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7a55?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'cm5', title: 'Night Bazaar Shopping', subtitle: 'Chang Moi', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'cm6', title: 'Riverside Jazz Dinner', subtitle: 'Ping River', category: 'Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' }
    ]
  }
};

export const fetchWeather = async (destination) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    if (!geoRes.ok) throw new Error("Geocoding failed");
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) throw new Error("Location not found");
    const { latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,uv_index_max&hourly=temperature_2m&timezone=auto&forecast_days=1`);
    const weatherData = await weatherRes.json();

    return {
      maxTemp: weatherData.daily.temperature_2m_max[0],
      precipProb: weatherData.daily.precipitation_probability_max[0],
      maxUv: weatherData.daily.uv_index_max[0],
      hourly: weatherData.hourly.temperature_2m.slice(6, 22) // 6 AM to 10 PM
    };
  } catch (err) {
    return { maxTemp: 30, precipProb: 10, maxUv: 7, hourly: Array(16).fill(30) };
  }
};

export const fetchItinerary = async (prefs) => {
  const { destination, budget, persona, energy, noctourism } = prefs;
  
  // Use Curated Data if available
  const curated = FEATURE_DATA[destination];
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'foursquare-places.p.rapidapi.com',
      'Accept': 'application/json'
    }
  };

  const fallbackImages = [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800&h=400',
    'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800&h=400'
  ];

  try {
    let url = `https://foursquare-places.p.rapidapi.com/v3/places/search?near=${encodeURIComponent(destination)}&limit=20`;
    const response = await fetch(url, options);
    const data = await response.json();
    const results = data.results || [];

    const pools = { Morning: [], Afternoon: [], Evening: [] };

    // Blend Curated + Live
    if (curated) {
      ['Morning', 'Afternoon', 'Evening'].forEach(slot => {
        pools[slot] = [...curated[slot]];
      });
    }

    results.forEach((place, index) => {
      const item = {
        id: place.fsq_id || `live_${index}`,
        title: place.name || 'Unknown Place',
        subtitle: place.location?.formatted_address || 'Address Hidden',
        category: place.categories?.[0]?.name || 'Activity',
        image: fallbackImages[index % fallbackImages.length]
      };

      const cat = item.category.toLowerCase();
      if (cat.includes('cafe') || cat.includes('breakfast')) pools.Morning.push(item);
      else if (cat.includes('bar') || cat.includes('night') || cat.includes('dinner')) pools.Evening.push(item);
      else pools.Afternoon.push(item);
    });

    // Final mapping and shuffling
    return {
      Morning: pools.Morning.slice(0, 5),
      Afternoon: pools.Afternoon.slice(0, 5),
      Evening: pools.Evening.slice(0, 5)
    };

  } catch (error) {
    return curated || null;
  }
};
