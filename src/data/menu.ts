export type MenuCategory =
  | 'coffee'
  | 'bakery'
  | 'desserts'
  | 'light-bites'
  | 'signature-drinks';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  featured?: boolean;
}

export interface CategoryMeta {
  id: MenuCategory;
  label: string;
  emoji: string;
}

export const categories: CategoryMeta[] = [
  { id: 'coffee',           label: 'Coffee',          emoji: '☕' },
  { id: 'signature-drinks', label: 'Signature',       emoji: '✨' },
  { id: 'bakery',           label: 'Bakery',          emoji: '🥐' },
  { id: 'desserts',         label: 'Desserts',        emoji: '🍰' },
  { id: 'light-bites',      label: 'Light Bites',     emoji: '🥗' },
];

export const menuItems: MenuItem[] = [
  // ── Coffee ──────────────────────────────────────
  {
    id: 'espresso-classico',
    category: 'coffee',
    name: 'Espresso Classico',
    description: 'Single origin Ethiopian Yirgacheffe, bright citrus notes with a velvety crema',
    price: 3.50,
    image: '/images/menu/espressoclassico.jpg',
    badge: 'Popular',
    featured: true,
  },
  {
    id: 'cortado',
    category: 'coffee',
    name: 'Cortado',
    description: 'Equal parts espresso and warm microfoam milk, perfectly balanced intensity',
    price: 4.00,
    image: '/images/menu/cortado.jpg',
  },
  {
    id: 'pour-over',
    category: 'coffee',
    name: 'Pour Over',
    description: 'Hand-brewed with Kenyan AA beans over 4 minutes, floral and bright',
    price: 5.50,
    image: '/images/menu/pour-over.jpg',
    badge: 'New',
  },
  {
    id: 'cold-brew',
    category: 'coffee',
    name: 'Cold Brew',
    description: '18-hour slow-steeped in cold water — impossibly smooth, low acid',
    price: 5.00,
    image: '/images/menu/cold-brew.jpg',
  },
  {
    id: 'flat-white',
    category: 'coffee',
    name: 'Flat White',
    description: 'Double ristretto with silky steamed whole milk, rich and strong',
    price: 4.50,
    image: '/images/menu/flat-white.jpg',
  },

  // ── Signature Drinks ─────────────────────────────
  {
    id: 'honey-lavender-latte',
    category: 'signature-drinks',
    name: 'Honey Lavender Latte',
    description: 'House espresso, lavender syrup, wildflower honey, and oat milk with dried lavender',
    price: 6.50,
    image: '/images/menu/honeylavenderlatte.jpg',
    badge: "Chef's Pick",
    featured: true,
  },
  {
    id: 'golden-turmeric-latte',
    category: 'signature-drinks',
    name: 'Golden Turmeric Latte',
    description: 'Turmeric, ginger, cinnamon, black pepper, and steamed coconut milk',
    price: 6.00,
    image: '/images/menu/turmeric-latte.jpg',
    badge: 'Popular',
  },
  {
    id: 'rose-cardamom-chai',
    category: 'signature-drinks',
    name: 'Rose Cardamom Chai',
    description: 'Spiced masala chai with rose water, cardamom, and steamed oat milk',
    price: 6.00,
    image: '/images/menu/rose-chai.jpg',
  },
  {
    id: 'ceremonial-matcha',
    category: 'signature-drinks',
    name: 'Ceremonial Matcha',
    description: 'Grade A Japanese matcha whisked to order, served over steamed oat milk',
    price: 6.50,
    image: '/images/menu/matcha.jpg',
    badge: 'New',
  },

  // ── Bakery ───────────────────────────────────────
  {
    id: 'butter-croissant',
    category: 'bakery',
    name: 'Butter Croissant',
    description: 'Laminated with 72 layers of French AOP butter — shatteringly flaky, golden',
    price: 4.50,
    image: '/images/menu/croissant.jpg',
    badge: 'Popular',
    featured: true,
  },
  {
    id: 'almond-croissant',
    category: 'bakery',
    name: 'Almond Croissant',
    description: 'Day-old croissant soaked in rum syrup, filled with frangipane, topped with flaked almonds',
    price: 5.50,
    image: '/images/menu/almondcroissant.jpg',
  },
  {
    id: 'cardamom-bun',
    category: 'bakery',
    name: 'Cardamom Bun',
    description: 'Swedish-inspired soft dough with cardamom sugar and a pearl sugar crust',
    price: 4.00,
    image: '/images/menu/cardamom-bun.jpg',
    badge: 'New',
  },
  {
    id: 'sourdough-toast',
    category: 'bakery',
    name: 'Sourdough Toast',
    description: '48-hour fermented house sourdough with cultured butter and Maldon sea salt',
    price: 4.00,
    image: '/images/menu/sourdough.jpg',
  },

  // ── Desserts ─────────────────────────────────────
  {
    id: 'espresso-tiramisu',
    category: 'desserts',
    name: 'Espresso Tiramisu',
    description: 'Savoiardi soaked in double espresso, mascarpone cream, dusted with Valrhona cocoa',
    price: 8.00,
    image: '/images/menu/espressotiramisu.jpg',
    badge: "Chef's Pick",
  },
  {
    id: 'basque-cheesecake',
    category: 'desserts',
    name: 'Basque Burnt Cheesecake',
    description: 'Caramelized exterior, creamy molten center — served warm with berry compote',
    price: 9.00,
    image: '/images/menu/basque-cheesecake.jpg',
    badge: 'Popular',
    featured: true,
  },
  {
    id: 'brown-butter-financier',
    category: 'desserts',
    name: 'Brown Butter Financier',
    description: 'Almond flour cake with noisette butter, topped with seasonal macerated fruit',
    price: 6.00,
    image: '/images/menu/financier.jpg',
  },

  // ── Light Bites ──────────────────────────────────
  {
    id: 'smashed-avo-toast',
    category: 'light-bites',
    name: 'Smashed Avocado Toast',
    description: 'House sourdough, smashed avo, poached eggs, chili flakes, microgreens, lemon',
    price: 12.00,
    image: '/images/menu/protein-avocado-toast.jpg',
    badge: 'Popular',
  },
  {
    id: 'quiche-lorraine',
    category: 'light-bites',
    name: 'Quiche Lorraine',
    description: 'Buttery shortcrust pastry, gruyère, caramelized onion, house greens salad',
    price: 13.00,
    image: '/images/menu/quiche.jpg',
  },
  {
    id: 'mezze-board',
    category: 'light-bites',
    name: 'Mezze Board',
    description: 'Seasonal hummus, olives, roasted peppers, labneh, warm pita, crudités',
    price: 16.00,
    image: '/images/menu/mezze.jpg',
    badge: 'New',
  },
];
