import { User, Heart, Utensils, Laptop } from 'lucide-react';

export const PERSONAS = [
  { id: 'Solo', icon: User, label: 'Solo Adventurer', desc: 'Freedom and discovery.' },
  { id: 'Couple', icon: Heart, label: 'Romantic Couple', desc: 'Shared moments.' },
  { id: 'Foodie', icon: Utensils, label: 'Foodie Friends', desc: 'Culture through food.' },
  { id: 'Nomad', icon: Laptop, label: 'Digital Nomad', desc: 'Work and play.' },
];

export const GROUP_CONTEXT = {
  Solo:     'travelling solo — recommend activities that are comfortable and rewarding alone, note where solo travellers are especially welcome',
  Friends:  'travelling with friends — activities that work for a small group with flexible plans',
  Couple:   'travelling as a couple — lean toward romantic, scenic, and shared experiences',
  Flexible: 'currently alone but open to joining others — solo-friendly activities that could easily include a +1',
};

export const DIETARY_CONTEXT = {
  None:        'no dietary restrictions',
  Vegetarian:  'vegetarian — recommend places with strong veggie options, flag any meat-heavy spots',
  Vegan:       'vegan — only recommend vegan-friendly venues, avoid dairy and eggs',
  Halal:       'halal — only recommend halal-certified or pork-free venues',
};

export const BUDGET_CONTEXT = {
  '$':   'backpacker budget (under $30/day) — street food, guesthouses, free attractions',
  '$$':  'mid-range comfort ($30–100/day) — local restaurants, 3-star hotels, paid attractions',
  '$$$': 'premium ($100+/day) — luxury resorts, fine dining, private tours',
};
