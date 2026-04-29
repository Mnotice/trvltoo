// Travel destinations for autocomplete.
// context (optional): local knowledge fed to Claude when generating itineraries.
export const CITIES = [
  // ── Southeast Asia ────────────────────────────────────────────────────────
  {
    city: 'Bangkok', country: 'Thailand', emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'BTS Skytrain, MRT, Grab, tuk-tuk', bestMonths: 'Nov–Mar', budget: '$50–110/day', highlights: 'Grand Palace, Wat Pho, street food markets, Chatuchak, Khao San Road, nightlife' },
  },
  {
    city: 'Chiang Mai', country: 'Thailand', emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Songthaew (red trucks), motorbike, bicycle', bestMonths: 'Nov–Feb', budget: '$35–70/day', highlights: 'Old City temples, Doi Inthanon, cooking classes, Sunday Walking Street, elephant sanctuaries, night bazaar' },
  },
  {
    city: 'Phuket', country: 'Thailand', emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Grab, songthaew, motorbike rental', bestMonths: 'Nov–Apr', budget: '$60–130/day', highlights: 'Patong Beach, Phi Phi Islands day trip, Old Town, elephant sanctuaries, Phang Nga Bay' },
  },
  { city: 'Krabi',          country: 'Thailand',     emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Longtail boat, Grab, motorbike', bestMonths: 'Nov–Apr', budget: '$45–90/day', highlights: 'Railay Beach, rock climbing, Tiger Cave Temple, island hopping, kayaking through mangroves' },
  },
  { city: 'Koh Samui',      country: 'Thailand',     emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Songthaew, Grab, motorbike', bestMonths: 'Dec–Apr', budget: '$55–120/day', highlights: 'Chaweng Beach, Big Buddha, Ang Thong National Marine Park, waterfalls, Full Moon prep' },
  },
  { city: 'Koh Phangan',    country: 'Thailand',     emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Motorbike rental, songthaew', bestMonths: 'Dec–Apr', budget: '$35–75/day', highlights: 'Full Moon Party, Haad Rin beach, yoga retreats, jungle waterfalls, snorkelling' },
  },
  { city: 'Koh Tao',        country: 'Thailand',     emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Pickup truck taxi, walk', bestMonths: 'Feb–Oct', budget: '$40–80/day', highlights: 'PADI dive courses (cheapest in world), snorkelling, Sairee Beach, sunset viewpoints' },
  },
  { city: 'Pai',             country: 'Thailand',     emoji: '🇹🇭', region: 'SE Asia',
    context: { currency: 'THB (~30/USD)', transport: 'Motorbike rental essential', bestMonths: 'Nov–Feb', budget: '$25–50/day', highlights: 'Hot springs, canyon, bamboo bridge, Pai Walking Street, mountain scenery, hippie cafes' },
  },
  {
    city: 'Ho Chi Minh City', country: 'Vietnam', emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Grab bike/car, xe om (motorbike taxi)', bestMonths: 'Dec–Apr', budget: '$40–90/day', highlights: 'War Remnants Museum, Cu Chi Tunnels, Ben Thanh Market, Bui Vien Walking Street, Mekong Delta day trip' },
  },
  {
    city: 'Hanoi', country: 'Vietnam', emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Grab, xe om, cyclo in Old Quarter', bestMonths: 'Oct–Apr', budget: '$35–80/day', highlights: 'Hoan Kiem Lake, Old Quarter, Ho Chi Minh Mausoleum, Hoa Lo Prison, Train Street, egg coffee' },
  },
  {
    city: 'Hoi An', country: 'Vietnam', emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Bicycle, motorbike, walking (Ancient Town is pedestrianised)', bestMonths: 'Feb–Jul', budget: '$35–75/day', highlights: 'Ancient Town lanterns, tailored clothing, My Son ruins, cooking classes, An Bang Beach, boat tour' },
  },
  {
    city: 'Ha Long Bay', country: 'Vietnam', emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Cruise boat (2-night recommended)', bestMonths: 'Apr–Jun, Sep–Nov', budget: '$80–200/day (inc. cruise)', highlights: 'Limestone karst islands, overnight cruise, kayaking, Surprising Cave, floating villages, seafood' },
  },
  {
    city: 'Da Nang', country: 'Vietnam', emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Grab, motorbike rental', bestMonths: 'Mar–Aug', budget: '$40–80/day', highlights: 'My Khe Beach, Marble Mountains, Golden Bridge (Ba Na Hills), Dragon Bridge, Hoi An day trip' },
  },
  { city: 'Nha Trang',      country: 'Vietnam',      emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Grab, local bus, boat tour', bestMonths: 'Feb–Aug', budget: '$35–75/day', highlights: 'Vinpearl Island, Po Nagar towers, mud baths, island hopping, diving, fresh seafood' },
  },
  { city: 'Phu Quoc',       country: 'Vietnam',      emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Grab, motorbike rental', bestMonths: 'Nov–Apr', budget: '$50–100/day', highlights: 'Long Beach, Sao Beach, sunset town night market, snorkelling, pepper farms, fish sauce factory' },
  },
  { city: 'Mui Ne',         country: 'Vietnam',      emoji: '🇻🇳', region: 'SE Asia',
    context: { currency: 'VND (~25,000/USD)', transport: 'Motorbike rental, xe om', bestMonths: 'Nov–Apr', budget: '$30–60/day', highlights: 'Red and white sand dunes, Fairy Stream, kite surfing, fresh seafood, fishing village' },
  },
  {
    city: 'Siem Reap', country: 'Cambodia', emoji: '🇰🇭', region: 'SE Asia',
    context: { currency: 'USD (widely accepted)', transport: 'Tuk-tuk, Grab, bicycle', bestMonths: 'Nov–Mar', budget: '$40–90/day', highlights: 'Angkor Wat sunrise, Bayon temple faces, Ta Prohm jungle temple, Pub Street, Tonle Sap lake, apsara dinner show' },
  },
  {
    city: 'Phnom Penh', country: 'Cambodia', emoji: '🇰🇭', region: 'SE Asia',
    context: { currency: 'USD (widely accepted)', transport: 'Tuk-tuk, Grab', bestMonths: 'Nov–Mar', budget: '$35–75/day', highlights: 'Royal Palace, Tuol Sleng Genocide Museum, Killing Fields, riverside, Mekong cruise, street food' },
  },
  { city: 'Kampot',         country: 'Cambodia',     emoji: '🇰🇭', region: 'SE Asia',
    context: { currency: 'USD (widely accepted)', transport: 'Bicycle, motorbike, tuk-tuk', bestMonths: 'Nov–Apr', budget: '$25–55/day', highlights: 'Bokor Hill Station, firefly boat tours, pepper plantations, French colonial architecture, river sunset cruises' },
  },
  {
    city: 'Bali', country: 'Indonesia', emoji: '🇮🇩', region: 'SE Asia',
    context: { currency: 'IDR (~15,500/USD)', transport: 'Grab (south Bali), private driver (~$40/day), motorbike rental', bestMonths: 'Apr–Oct', budget: '$50–120/day', highlights: 'Tanah Lot, Uluwatu temple, Tegalalang rice terraces, Seminyak beach clubs, Kuta surf, Ubud arts' },
  },
  {
    city: 'Ubud', country: 'Indonesia', emoji: '🇮🇩', region: 'SE Asia',
    context: { currency: 'IDR (~15,500/USD)', transport: 'Motorbike rental, private driver', bestMonths: 'Apr–Sep', budget: '$45–100/day', highlights: 'Monkey Forest, Tegalalang rice terraces, cooking classes, Tirta Empul water temple, yoga, art galleries' },
  },
  { city: 'Lombok',         country: 'Indonesia',    emoji: '🇮🇩', region: 'SE Asia',
    context: { currency: 'IDR (~15,500/USD)', transport: 'Cidomo (horse cart), motorbike, boat', bestMonths: 'May–Sep', budget: '$40–90/day', highlights: 'Gili Islands (Trawangan, Meno, Air), Mount Rinjani trek, Kuta beach (surf), Senggigi, snorkelling' },
  },
  { city: 'Gili Islands',   country: 'Indonesia',    emoji: '🇮🇩', region: 'SE Asia',
    context: { currency: 'IDR (~15,500/USD)', transport: 'No motorised vehicles — bicycle or horse cart', bestMonths: 'May–Sep', budget: '$50–110/day', highlights: 'No cars, snorkelling with turtles, diving, beach bars, hammocks, sunrise over Rinjani' },
  },
  { city: 'Yogyakarta',     country: 'Indonesia',    emoji: '🇮🇩', region: 'SE Asia',
    context: { currency: 'IDR (~15,500/USD)', transport: 'Becak (rickshaw), Trans Jogja bus, motorbike', bestMonths: 'May–Oct', budget: '$30–65/day', highlights: 'Borobudur at sunrise, Prambanan temples, Kraton palace, batik workshops, Malioboro Street' },
  },
  { city: 'Jakarta',        country: 'Indonesia',    emoji: '🇮🇩', region: 'SE Asia' },
  {
    city: 'Kuala Lumpur', country: 'Malaysia', emoji: '🇲🇾', region: 'SE Asia',
    context: { currency: 'MYR (~4.7/USD)', transport: 'LRT/MRT/Monorail, Grab', bestMonths: 'May–Jul, Dec–Feb', budget: '$50–110/day', highlights: 'Petronas Towers, Batu Caves, Bukit Bintang, Chinatown, Jalan Alor street food, KLCC park' },
  },
  {
    city: 'Penang', country: 'Malaysia', emoji: '🇲🇾', region: 'SE Asia',
    context: { currency: 'MYR (~4.7/USD)', transport: 'Grab, bicycle, ferry (from mainland)', bestMonths: 'Dec–Feb, Jun–Aug', budget: '$35–75/day', highlights: 'Georgetown street art, hawker food (best in Malaysia), Kek Lok Si temple, Penang Hill, Clan Jetties' },
  },
  { city: 'Langkawi',       country: 'Malaysia',     emoji: '🇲🇾', region: 'SE Asia',
    context: { currency: 'MYR (~4.7/USD)', transport: 'Car/motorbike rental essential, taxi', bestMonths: 'Nov–Apr', budget: '$45–100/day', highlights: 'Duty-free shopping, cable car + Sky Bridge, mangrove boat tour, beaches, waterfalls, seafood' },
  },
  { city: 'Kota Kinabalu',  country: 'Malaysia',     emoji: '🇲🇾', region: 'SE Asia',
    context: { currency: 'MYR (~4.7/USD)', transport: 'Grab, local bus, boat to islands', bestMonths: 'Mar–Sep', budget: '$40–90/day', highlights: 'Mount Kinabalu trek, Tunku Abdul Rahman islands, night market seafood, firefly river cruise, orangutan sanctuary' },
  },
  {
    city: 'Singapore', country: 'Singapore', emoji: '🇸🇬', region: 'SE Asia',
    context: { currency: 'SGD (~1.35/USD)', transport: 'MRT (world-class), bus, Grab', bestMonths: 'Feb–Apr', budget: '$100–200/day', highlights: 'Gardens by the Bay, Marina Bay Sands, hawker centres, Sentosa, Chinatown, Little India, Night Safari' },
  },
  {
    city: 'Manila', country: 'Philippines', emoji: '🇵🇭', region: 'SE Asia',
    context: { currency: 'PHP (~57/USD)', transport: 'Grab, jeepney, LRT', bestMonths: 'Dec–May', budget: '$40–85/day', highlights: 'Intramuros (walled city), Rizal Park, BGC rooftop bars, day trip to Corregidor, Pasig River ferry' },
  },
  {
    city: 'Cebu', country: 'Philippines', emoji: '🇵🇭', region: 'SE Asia',
    context: { currency: 'PHP (~57/USD)', transport: 'Grab, V-hire, jeepney', bestMonths: 'Nov–May', budget: '$40–85/day', highlights: 'Whale shark swimming (Oslob), Kawasan Falls canyoneering, Magellan\'s Cross, lechon (best in Philippines), island hopping' },
  },
  {
    city: 'Palawan', country: 'Philippines', emoji: '🇵🇭', region: 'SE Asia',
    context: { currency: 'PHP (~57/USD)', transport: 'Tricycle, boat, bangka island-hopping', bestMonths: 'Nov–May', budget: '$50–110/day', highlights: 'El Nido island hopping, Big Lagoon, Coron lake diving, Underground River (UNESCO), pristine beaches, sunsets' },
  },
  { city: 'Boracay',        country: 'Philippines',  emoji: '🇵🇭', region: 'SE Asia',
    context: { currency: 'PHP (~57/USD)', transport: 'E-tricycle (no motor vehicles on main beach)', bestMonths: 'Nov–May', budget: '$60–130/day', highlights: 'White Beach (powder-white sand), kite surfing, cliff diving, Willy\'s Rock, paraw sailing at sunset' },
  },
  { city: 'Siargao',        country: 'Philippines',  emoji: '🇵🇭', region: 'SE Asia',
    context: { currency: 'PHP (~57/USD)', transport: 'Motorbike rental essential', bestMonths: 'Mar–Oct', budget: '$40–85/day', highlights: 'Cloud 9 surf break, island hopping (Naked Island, Daku), lagoons, coconut trees, surf lessons, bonfire nights' },
  },
  {
    city: 'Luang Prabang', country: 'Laos', emoji: '🇱🇦', region: 'SE Asia',
    context: { currency: 'LAK (~21,000/USD)', transport: 'Tuk-tuk, bicycle, walking', bestMonths: 'Oct–Apr', budget: '$35–75/day', highlights: 'Alms giving ceremony at dawn, Kuang Si waterfalls, Pak Ou caves, night market, French colonial town, Mekong sunset cruise' },
  },
  { city: 'Vientiane',      country: 'Laos',         emoji: '🇱🇦', region: 'SE Asia' },
  { city: 'Yangon',         country: 'Myanmar',      emoji: '🇲🇲', region: 'SE Asia',
    context: { currency: 'MMK / USD', transport: 'Grab, taxi, circular train', bestMonths: 'Nov–Feb', budget: '$40–80/day', highlights: 'Shwedagon Pagoda (gilded), Sule Pagoda, Bogyoke Market, street food, colonial architecture, Inle Lake day trip' },
  },

  // ── East Asia ────────────────────────────────────────────────────────────
  {
    city: 'Tokyo', country: 'Japan', emoji: '🇯🇵', region: 'East Asia',
    context: { currency: 'JPY (~150/USD)', transport: 'JR/Metro trains (IC card), walking', bestMonths: 'Mar–May, Sep–Nov', budget: '$100–200/day', highlights: 'Shibuya crossing, Shinjuku, Asakusa temple, teamLab, Harajuku, Robot Restaurant, ramen, sushi bars' },
  },
  {
    city: 'Kyoto', country: 'Japan', emoji: '🇯🇵', region: 'East Asia',
    context: { currency: 'JPY (~150/USD)', transport: 'Bus, bicycle, taxi', bestMonths: 'Mar–May, Oct–Nov', budget: '$90–180/day', highlights: 'Fushimi Inari torii gates, Arashiyama bamboo, Kinkakuji (Golden Pavilion), Nishiki Market, geisha district Gion' },
  },
  {
    city: 'Osaka', country: 'Japan', emoji: '🇯🇵', region: 'East Asia',
    context: { currency: 'JPY (~150/USD)', transport: 'Subway, Shinkansen to Kyoto', bestMonths: 'Mar–May, Sep–Nov', budget: '$90–170/day', highlights: 'Dotonbori neon district, street food (takoyaki, okonomiyaki), Osaka Castle, Universal Studios, Shinsekai' },
  },
  { city: 'Hiroshima',      country: 'Japan',        emoji: '🇯🇵', region: 'East Asia' },
  { city: 'Nara',           country: 'Japan',        emoji: '🇯🇵', region: 'East Asia' },
  {
    city: 'Seoul', country: 'South Korea', emoji: '🇰🇷', region: 'East Asia',
    context: { currency: 'KRW (~1,350/USD)', transport: 'Subway (T-money card), bus, Kakao T app', bestMonths: 'Apr–Jun, Sep–Nov', budget: '$70–150/day', highlights: 'Gyeongbokgung Palace, Bukchon Hanok, Myeongdong street food, Hongdae nightlife, Han River picnic, K-beauty shopping' },
  },
  { city: 'Busan',          country: 'South Korea',  emoji: '🇰🇷', region: 'East Asia' },
  { city: 'Beijing',        country: 'China',        emoji: '🇨🇳', region: 'East Asia' },
  { city: 'Shanghai',       country: 'China',        emoji: '🇨🇳', region: 'East Asia' },
  { city: 'Chengdu',        country: 'China',        emoji: '🇨🇳', region: 'East Asia' },
  { city: 'Hong Kong',      country: 'Hong Kong',    emoji: '🇭🇰', region: 'East Asia' },
  { city: 'Taipei',         country: 'Taiwan',       emoji: '🇹🇼', region: 'East Asia' },

  // ── South Asia ───────────────────────────────────────────────────────────
  { city: 'Mumbai',         country: 'India',        emoji: '🇮🇳', region: 'South Asia' },
  { city: 'Delhi',          country: 'India',        emoji: '🇮🇳', region: 'South Asia' },
  { city: 'Jaipur',         country: 'India',        emoji: '🇮🇳', region: 'South Asia' },
  { city: 'Goa',            country: 'India',        emoji: '🇮🇳', region: 'South Asia' },
  { city: 'Kolkata',        country: 'India',        emoji: '🇮🇳', region: 'South Asia' },
  { city: 'Kathmandu',      country: 'Nepal',        emoji: '🇳🇵', region: 'South Asia' },
  { city: 'Colombo',        country: 'Sri Lanka',    emoji: '🇱🇰', region: 'South Asia' },

  // ── Middle East & Africa ─────────────────────────────────────────────────
  { city: 'Dubai',          country: 'UAE',          emoji: '🇦🇪', region: 'Middle East' },
  { city: 'Abu Dhabi',      country: 'UAE',          emoji: '🇦🇪', region: 'Middle East' },
  { city: 'Istanbul',       country: 'Turkey',       emoji: '🇹🇷', region: 'Middle East' },
  { city: 'Tel Aviv',       country: 'Israel',       emoji: '🇮🇱', region: 'Middle East' },
  { city: 'Marrakech',      country: 'Morocco',      emoji: '🇲🇦', region: 'Africa' },
  { city: 'Cape Town',      country: 'South Africa', emoji: '🇿🇦', region: 'Africa' },
  { city: 'Nairobi',        country: 'Kenya',        emoji: '🇰🇪', region: 'Africa' },
  { city: 'Cairo',          country: 'Egypt',        emoji: '🇪🇬', region: 'Africa' },

  // ── Europe ───────────────────────────────────────────────────────────────
  {
    city: 'Paris', country: 'France', emoji: '🇫🇷', region: 'Europe',
    context: { currency: 'EUR (~0.93/USD)', transport: 'Métro, RER, Vélib bike', bestMonths: 'Apr–Jun, Sep–Oct', budget: '$120–250/day', highlights: 'Eiffel Tower, Louvre, Montmartre, Le Marais, cafes, Versailles day trip, fashion, fine dining' },
  },
  { city: 'Nice',           country: 'France',       emoji: '🇫🇷', region: 'Europe' },
  {
    city: 'Barcelona', country: 'Spain', emoji: '🇪🇸', region: 'Europe',
    context: { currency: 'EUR (~0.93/USD)', transport: 'Metro, bus, Bicing bike share', bestMonths: 'Apr–Jun, Sep–Oct', budget: '$100–200/day', highlights: 'Sagrada Família, Park Güell, Las Ramblas, Gothic Quarter, Barceloneta beach, tapas, nightlife' },
  },
  {
    city: 'Lisbon', country: 'Portugal', emoji: '🇵🇹', region: 'Europe',
    context: { currency: 'EUR (~0.93/USD)', transport: 'Tram 28, Uber, metro', bestMonths: 'Mar–May, Sep–Oct', budget: '$80–160/day', highlights: 'Belém tower, Alfama district, fado music, tram 28, pastéis de nata, Sintra day trip, viewpoints' },
  },
  { city: 'London',         country: 'UK',           emoji: '🇬🇧', region: 'Europe' },
  { city: 'Edinburgh',      country: 'UK',           emoji: '🇬🇧', region: 'Europe' },
  { city: 'Rome',           country: 'Italy',        emoji: '🇮🇹', region: 'Europe',
    context: { currency: 'EUR (~0.93/USD)', transport: 'Walking, metro (2 lines), bus', bestMonths: 'Apr–Jun, Sep–Oct', budget: '$100–200/day', highlights: 'Colosseum, Vatican & Sistine Chapel, Trevi Fountain, pasta/gelato, Campo de\' Fiori, Trastevere nightlife' },
  },
  { city: 'Florence',       country: 'Italy',        emoji: '🇮🇹', region: 'Europe' },
  { city: 'Venice',         country: 'Italy',        emoji: '🇮🇹', region: 'Europe' },
  { city: 'Amalfi Coast',   country: 'Italy',        emoji: '🇮🇹', region: 'Europe' },
  { city: 'Madrid',         country: 'Spain',        emoji: '🇪🇸', region: 'Europe' },
  { city: 'Seville',        country: 'Spain',        emoji: '🇪🇸', region: 'Europe' },
  { city: 'Porto',          country: 'Portugal',     emoji: '🇵🇹', region: 'Europe' },
  { city: 'Amsterdam',      country: 'Netherlands',  emoji: '🇳🇱', region: 'Europe' },
  { city: 'Berlin',         country: 'Germany',      emoji: '🇩🇪', region: 'Europe' },
  { city: 'Munich',         country: 'Germany',      emoji: '🇩🇪', region: 'Europe' },
  { city: 'Vienna',         country: 'Austria',      emoji: '🇦🇹', region: 'Europe' },
  { city: 'Prague',         country: 'Czech Republic', emoji: '🇨🇿', region: 'Europe' },
  { city: 'Budapest',       country: 'Hungary',      emoji: '🇭🇺', region: 'Europe' },
  { city: 'Krakow',         country: 'Poland',       emoji: '🇵🇱', region: 'Europe' },
  { city: 'Athens',         country: 'Greece',       emoji: '🇬🇷', region: 'Europe' },
  { city: 'Santorini',      country: 'Greece',       emoji: '🇬🇷', region: 'Europe' },
  { city: 'Mykonos',        country: 'Greece',       emoji: '🇬🇷', region: 'Europe' },
  { city: 'Dubrovnik',      country: 'Croatia',      emoji: '🇭🇷', region: 'Europe' },
  { city: 'Split',          country: 'Croatia',      emoji: '🇭🇷', region: 'Europe' },
  { city: 'Copenhagen',     country: 'Denmark',      emoji: '🇩🇰', region: 'Europe' },
  { city: 'Stockholm',      country: 'Sweden',       emoji: '🇸🇪', region: 'Europe' },
  { city: 'Oslo',           country: 'Norway',       emoji: '🇳🇴', region: 'Europe' },
  { city: 'Helsinki',       country: 'Finland',      emoji: '🇫🇮', region: 'Europe' },
  { city: 'Reykjavik',      country: 'Iceland',      emoji: '🇮🇸', region: 'Europe' },
  { city: 'Zurich',         country: 'Switzerland',  emoji: '🇨🇭', region: 'Europe' },
  { city: 'Geneva',         country: 'Switzerland',  emoji: '🇨🇭', region: 'Europe' },
  { city: 'Brussels',       country: 'Belgium',      emoji: '🇧🇪', region: 'Europe' },

  // ── Americas ─────────────────────────────────────────────────────────────
  { city: 'New York',       country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Los Angeles',    country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'San Francisco',  country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Chicago',        country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Miami',          country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Las Vegas',      country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'New Orleans',    country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Hawaii',         country: 'USA',          emoji: '🇺🇸', region: 'Americas' },
  { city: 'Toronto',        country: 'Canada',       emoji: '🇨🇦', region: 'Americas' },
  { city: 'Vancouver',      country: 'Canada',       emoji: '🇨🇦', region: 'Americas' },
  { city: 'Montreal',       country: 'Canada',       emoji: '🇨🇦', region: 'Americas' },
  { city: 'Mexico City',    country: 'Mexico',       emoji: '🇲🇽', region: 'Americas' },
  { city: 'Cancún',         country: 'Mexico',       emoji: '🇲🇽', region: 'Americas' },
  { city: 'Tulum',          country: 'Mexico',       emoji: '🇲🇽', region: 'Americas' },
  { city: 'Buenos Aires',   country: 'Argentina',    emoji: '🇦🇷', region: 'Americas' },
  { city: 'Rio de Janeiro', country: 'Brazil',       emoji: '🇧🇷', region: 'Americas' },
  { city: 'São Paulo',      country: 'Brazil',       emoji: '🇧🇷', region: 'Americas' },
  { city: 'Bogotá',         country: 'Colombia',     emoji: '🇨🇴', region: 'Americas' },
  { city: 'Medellín',       country: 'Colombia',     emoji: '🇨🇴', region: 'Americas' },
  { city: 'Cartagena',      country: 'Colombia',     emoji: '🇨🇴', region: 'Americas' },
  { city: 'Lima',           country: 'Peru',         emoji: '🇵🇪', region: 'Americas' },
  { city: 'Cusco',          country: 'Peru',         emoji: '🇵🇪', region: 'Americas' },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { city: 'Sydney',         country: 'Australia',    emoji: '🇦🇺', region: 'Oceania' },
  { city: 'Melbourne',      country: 'Australia',    emoji: '🇦🇺', region: 'Oceania' },
  { city: 'Auckland',       country: 'New Zealand',  emoji: '🇳🇿', region: 'Oceania' },
  { city: 'Queenstown',     country: 'New Zealand',  emoji: '🇳🇿', region: 'Oceania' },
];

export function searchCities(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CITIES.filter(c =>
    c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

// Featured picks by region for the NewTrip wizard
export const FEATURED_DESTINATIONS = {
  'SE Asia': ['Bangkok', 'Bali', 'Hoi An', 'Chiang Mai', 'Siem Reap', 'Singapore', 'Penang', 'Hanoi', 'Palawan', 'Luang Prabang'],
  'East Asia': ['Tokyo', 'Kyoto', 'Seoul', 'Osaka'],
  'Europe': ['Lisbon', 'Barcelona', 'Paris', 'Rome'],
  'Americas': ['Mexico City', 'Medellín', 'Rio de Janeiro', 'New York'],
};
