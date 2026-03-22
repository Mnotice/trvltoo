export const fetchItinerary = async (location) => {
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
    'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800&h=400',
    'https://images.unsplash.com/photo-1601334808386-dd013c77ea1b?auto=format&fit=crop&q=80&w=800&h=400',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800&h=400',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800&h=400'
  ];

  try {
    const url = `https://foursquare-places.p.rapidapi.com/v3/places/search?near=${encodeURIComponent(location)}&limit=30`;
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    const pools = {
      Morning: [],
      Afternoon: [],
      Evening: []
    };

    results.forEach((place, index) => {
      const item = {
        id: place.fsq_id || index.toString(),
        title: place.name || 'Unknown Place',
        subtitle: place.location?.formatted_address || place.location?.address || 'No address provided',
        category: place.categories?.[0]?.name || 'Activity',
        image: fallbackImages[index % fallbackImages.length]
      };

      const cat = item.category.toLowerCase();
      if (cat.includes('coffee') || cat.includes('breakfast') || cat.includes('park') || cat.includes('beach')) {
        pools.Morning.push(item);
      } else if (cat.includes('restaurant') || cat.includes('bar') || cat.includes('night') || cat.includes('club') || cat.includes('dinner')) {
        pools.Evening.push(item);
      } else {
        pools.Afternoon.push(item);
      }
    });

    // If any pool is empty, loosely distribute the general results to ensure the UI has data
    ['Morning', 'Afternoon', 'Evening'].forEach((slot) => {
      if (pools[slot].length === 0 && results.length > 0) {
        pools[slot] = results.map((place, index) => ({
          id: `${slot}_${place.fsq_id || index}`,
          title: place.name,
          subtitle: place.location?.formatted_address || place.location?.address || 'No address',
          category: place.categories?.[0]?.name || 'Place',
          image: fallbackImages[index % fallbackImages.length]
        })).slice(0, 5);
      }
    });

    return pools;

  } catch (error) {
    console.error("Error fetching places via RapidAPI:", error);
    return null;
  }
};
