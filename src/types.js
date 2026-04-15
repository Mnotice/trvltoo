/**
 * @fileoverview
 * JSDoc type definitions for TRVLTOO.
 * Import these in any file with: @typedef {import('./types').Activity} Activity
 */

/**
 * @typedef {'$' | '$$' | '$$$'} BudgetTier
 */

/**
 * @typedef {'Solo' | 'Couple' | 'Foodie' | 'Nomad'} PersonaId
 */

/**
 * @typedef {'Morning' | 'Afternoon' | 'Evening'} TimeSlot
 */

/**
 * @typedef {Object} Activity
 * @property {string}     id        - Unique identifier
 * @property {string}     title     - Display name
 * @property {string}     subtitle  - Location / address
 * @property {string}     category  - Activity type label
 * @property {BudgetTier} budget    - Price tier
 * @property {string}     image     - Hero image URL
 */

/**
 * @typedef {Record<TimeSlot, Activity[]>} ItineraryPools
 */

/**
 * @typedef {Record<TimeSlot, number>} PickIndices
 */

/**
 * @typedef {Object} WeatherData
 * @property {number}   maxTemp    - Peak temperature in °C
 * @property {number}   precipProb - Precipitation probability (0–100)
 * @property {number}   maxUv      - Maximum UV index
 * @property {number[]} hourly     - Hourly temperatures from 6 AM to 10 PM
 */

/**
 * @typedef {Object} TripForm
 * @property {string}     destination
 * @property {string}     arrivalDate  - ISO date string YYYY-MM-DD
 * @property {PersonaId}  persona
 * @property {BudgetTier} budget
 * @property {number}     energy       - 1–10
 * @property {boolean}    noctourism
 * @property {number}     nightIntensity - 1–10
 */
