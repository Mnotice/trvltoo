const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const RAPIDAPI_KEY = defineSecret("RAPIDAPI_KEY");

/**
 * Proxies Foursquare place searches server-side so the RapidAPI key
 * is never exposed in the client bundle.
 *
 * GET /api/places?destination=Krabi
 */
exports.places = onRequest(
  { secrets: [RAPIDAPI_KEY], cors: [/trvltoo\.web\.app$/, /localhost/] },
  async (req, res) => {
    const destination = req.query.destination;
    if (!destination || typeof destination !== "string" || destination.length > 100) {
      return res.status(400).json({ error: "Invalid destination" });
    }

    try {
      const url = `https://foursquare-places.p.rapidapi.com/v3/places/search?near=${encodeURIComponent(destination)}&limit=20`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY.value(),
          "X-RapidAPI-Host": "foursquare-places.p.rapidapi.com",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: "Upstream API error" });
      }

      const data = await response.json();
      // Cache for 6 hours — same destination results rarely change within a day
      res.set("Cache-Control", "public, max-age=21600");
      return res.json(data);
    } catch (err) {
      console.error("places proxy error:", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }
);

/**
 * Health check endpoint — used by uptime monitors.
 * GET /api/health
 */
exports.health = onRequest({ cors: true }, (req, res) => {
  res.json({
    status: "ok",
    service: "trvltoo-api",
    ts: Date.now(),
  });
});
