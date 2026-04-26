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
  },
  'Koh Samui': {
    Morning: [
      { id: 'ks1', title: 'Ang Thong Marine Park', subtitle: 'Gulf of Thailand', category: 'Adventure', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks2', title: 'Big Buddha Temple', subtitle: 'Bophut', category: 'Culture', image: 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks3', title: 'Chaweng Beach Swim', subtitle: 'Chaweng Beach', category: 'Sports', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'ks4', title: 'Na Muang Waterfall Hike', subtitle: 'Na Muang', category: 'Nature', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks5', title: 'Fisherman\'s Village Stroll', subtitle: 'Bophut Village', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks6', title: 'Secret Buddha Garden', subtitle: 'Nathon Hills', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'ks7', title: 'Chaweng Night Market', subtitle: 'Chaweng Road', category: 'Dining', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks8', title: 'Rooftop Cocktails at Ark Bar', subtitle: 'Chaweng Beach', category: 'Luxury', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'ks9', title: 'Thai Boxing Show', subtitle: 'Chaweng Stadium', category: 'Culture', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Koh Phangan': {
    Morning: [
      { id: 'kp1', title: 'Bottle Beach Longtail Trip', subtitle: 'North Coast', category: 'Adventure', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp2', title: 'Namtok Phaeng Waterfall', subtitle: 'Phaeng Nature Trail', category: 'Nature', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp3', title: 'Yoga Class at Haad Yao', subtitle: 'Haad Yao Beach', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'kp4', title: 'Thong Nai Pan Beach', subtitle: 'East Coast', category: 'Nature', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp5', title: 'Chaloklum Fishing Village', subtitle: 'Chaloklum Bay', category: 'Culture', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp6', title: 'Snorkeling at Haad Khuat', subtitle: 'Bottle Beach Reef', category: 'Sports', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'kp7', title: 'Full Moon Party', subtitle: 'Haad Rin Beach', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp8', title: 'Sunset at Haad Salad', subtitle: 'Northwest Coast', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'kp9', title: 'Beachfront BBQ Dinner', subtitle: 'Baan Tai', category: 'Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Koh Tao': {
    Morning: [
      { id: 'kt1', title: 'Open Water Dive Course', subtitle: 'Sairee Beach Dive School', category: 'Sports', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt2', title: 'Shark Bay Snorkel', subtitle: 'Shark Bay', category: 'Adventure', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt3', title: 'Koh Nang Yuan View Hike', subtitle: 'Nang Yuan Island', category: 'Nature', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'kt4', title: 'Sairee Beach Hammock', subtitle: 'Sairee Beach', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt5', title: 'John Suwan Rock Scramble', subtitle: 'South Tip', category: 'Adventure', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt6', title: 'Mango Bay Kayak', subtitle: 'North Coast', category: 'Sports', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'kt7', title: 'Sunset at Sairee Viewpoint', subtitle: 'Sairee Hill', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt8', title: 'Choppers Bar Fire Show', subtitle: 'Sairee Beach', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1563911526490-7d72c11434b9?auto=format&fit=crop&q=80&w=800' },
      { id: 'kt9', title: 'Fresh Catch at Port Restaurant', subtitle: 'Mae Haad Pier', category: 'Dining', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Chiang Rai': {
    Morning: [
      { id: 'cr1', title: 'White Temple (Wat Rong Khun)', subtitle: 'Pa O Don Chai', category: 'Culture', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr2', title: 'Blue Temple at Dawn', subtitle: 'Wat Rong Suea Ten', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1563492063799-9aa770d3fdb2?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr3', title: 'Doi Tung Garden Walk', subtitle: 'Doi Tung Royal Villa', category: 'Nature', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'cr4', title: 'Golden Triangle Viewpoint', subtitle: 'Sop Ruak', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr5', title: 'Hill Tribe Village Visit', subtitle: 'Mae Salong', category: 'Culture', image: 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr6', title: 'Baan Dam Black House', subtitle: 'Nang Lae', category: 'Culture', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'cr7', title: 'Night Bazaar Chiang Rai', subtitle: 'Chiang Rai Town', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr8', title: 'Kat Kon Market', subtitle: 'Saturday Walking Street', category: 'Dining', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'cr9', title: 'Riverside Dinner', subtitle: 'Kok River', category: 'Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  Ayutthaya: {
    Morning: [
      { id: 'ay1', title: 'Wat Mahathat Ruins', subtitle: 'Ayutthaya Historical Park', category: 'Culture', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay2', title: 'Cycling the Ancient City', subtitle: 'Ayutthaya Island', category: 'Adventure', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay3', title: 'Wat Phra Si Sanphet', subtitle: 'Royal Palace Grounds', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1563492063799-9aa770d3fdb2?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'ay4', title: 'Elephant Kraal Sanctuary', subtitle: 'Ayutthaya Elephant Palace', category: 'Nature', image: 'https://images.unsplash.com/photo-1581850518616-681f1c72f3d1?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay5', title: 'Chao Phraya River Cruise', subtitle: 'Ayutthaya Pier', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1502602898657-3e91764c9742?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay6', title: 'Wat Chaiwatthanaram', subtitle: 'West Bank', category: 'Culture', image: 'https://images.unsplash.com/photo-1601334808386-dd013c77ea1b?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'ay7', title: 'Night Illumination Tour', subtitle: 'Ayutthaya Temples at Night', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay8', title: 'Riverside Night Market', subtitle: 'Hua Ro Market', category: 'Dining', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'ay9', title: 'Thai Cooking Class', subtitle: 'Baan Thai House', category: 'Culture', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Hua Hin': {
    Morning: [
      { id: 'hh1', title: 'Hua Hin Beach Horse Ride', subtitle: 'Hua Hin Beach', category: 'Adventure', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh2', title: 'Khao Sam Roi Yot Caves', subtitle: 'Phraya Nakhon Cave', category: 'Nature', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh3', title: 'Cicada Market Morning Walk', subtitle: 'Hua Hin Soi 40', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'hh4', title: 'Klai Kangwon Palace', subtitle: 'Royal Palace', category: 'Culture', image: 'https://images.unsplash.com/photo-1528181304800-2f5402473ff1?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh5', title: 'Hin Lek Fai Viewpoint', subtitle: 'Hua Hin Hills', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh6', title: 'Kiteboarding at Khao Tao', subtitle: 'Khao Tao Beach', category: 'Sports', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'hh7', title: 'Chatchai Night Market', subtitle: 'Dechanuchit Road', category: 'Dining', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh8', title: 'Sundowner at Hua Hin Hills', subtitle: 'Vineyard & Winery', category: 'Luxury', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800' },
      { id: 'hh9', title: 'Seafood at Sang Thai', subtitle: 'Hua Hin Fishing Pier', category: 'Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  Pai: {
    Morning: [
      { id: 'pa1', title: 'Pai Canyon Sunrise', subtitle: 'Kong Lan', category: 'Nature', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa2', title: 'Mo Paeng Waterfall Swim', subtitle: 'Mae Hi', category: 'Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa3', title: 'Yun Lai Viewpoint Mist Walk', subtitle: 'Yun Lai', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'pa4', title: 'Bamboo Bridge Stroll', subtitle: 'Pai Rice Fields', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa5', title: 'Elephant Camp Visit', subtitle: 'Thom\'s Pai Elephant Camp', category: 'Nature', image: 'https://images.unsplash.com/photo-1581850518616-681f1c72f3d1?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa6', title: 'Pai Hot Springs Soak', subtitle: 'Tha Pai Hot Springs', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'pa7', title: 'Pai Walking Street', subtitle: 'Chaisongkhram Road', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1566733971217-d18efae1e102?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa8', title: 'Live Music at Edible Jazz', subtitle: 'Pai Town', category: 'Culture', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7a55?auto=format&fit=crop&q=80&w=800' },
      { id: 'pa9', title: 'Stargazing at the Canyon', subtitle: 'Kong Lan Viewpoint', category: 'Adventure', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'Koh Lanta': {
    Morning: [
      { id: 'kl1', title: 'Mu Ko Lanta Marine Park Dive', subtitle: 'Ko Haa Lagoon', category: 'Sports', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl2', title: 'Tham Khao Mai Kaew Caves', subtitle: 'Central Lanta', category: 'Adventure', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl3', title: 'Long Beach Morning Walk', subtitle: 'Hat Phra Ae', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' }
    ],
    Afternoon: [
      { id: 'kl4', title: 'Old Town Lanta Stroll', subtitle: 'Ban Si Raya', category: 'Culture', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl5', title: 'Kayak to Koh Rok', subtitle: 'Southern Lanta', category: 'Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl6', title: 'Klong Dao Beach Relax', subtitle: 'North Lanta', category: 'Nature', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800' }
    ],
    Evening: [
      { id: 'kl7', title: 'Sunset at Kantiang Bay', subtitle: 'Kantiang Beach', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl8', title: 'Seaside Dinner at Drunken Sailors', subtitle: 'Long Beach', category: 'Dining', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
      { id: 'kl9', title: 'Lanta Old Town Night Market', subtitle: 'Ban Si Raya', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1562601579-599dec504631?auto=format&fit=crop&q=80&w=800' }
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
  
  const fallbackImages = [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800&h=400',
    'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800&h=400'
  ];

  try {
    let url = `/api/foursquare?destination=${encodeURIComponent(destination)}`;
    const response = await fetch(url);
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
