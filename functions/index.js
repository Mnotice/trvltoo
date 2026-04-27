const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.foursquareProxy = onRequest({ cors: true }, async (request, response) => {
  const destination = request.query.destination;
  
  if (!destination) {
    response.status(400).json({ error: 'Destination is required' });
    return;
  }

  // Uses process.env for Firebase v2 Gen features natively mapped from .env
  const apiKey = process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY; 

  if (!apiKey) {
    logger.error("Missing RAPIDAPI_KEY environment variable.");
    response.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'foursquare-places.p.rapidapi.com',
      'Accept': 'application/json'
    }
  };

  try {
    let url = `https://foursquare-places.p.rapidapi.com/v3/places/search?near=${encodeURIComponent(destination)}&limit=20`;
    
    // Fetch is available globally in Node 18+
    const apiRes = await fetch(url, options);
    
    if (!apiRes.ok) {
      throw new Error(`RapidAPI returned ${apiRes.status}`);
    }
    
    const data = await apiRes.json();
    response.status(200).json(data);
  } catch (error) {
    logger.error("Proxy error:", error);
    response.status(500).json({ error: 'Failed to fetch places' });
  }
});
