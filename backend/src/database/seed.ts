import pool from '../config/database';

interface ParentCategory {
  name: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

const categoriesData: ParentCategory[] = [
  {
    name: 'Real Estate',
    slug: 'real-estate-category',
    icon: '🏡',
    description: 'Property buying, selling, rental, and real estate services',
    subcategories: [
      { name: 'Buying & Selling', slug: 'real-estate', icon: '�', description: 'Property buying and selling services' },
      { name: 'Mortgage & Finance', slug: 'mortgage-finance', icon: '🏦', description: 'Mortgage brokers and financial services' },
      { name: 'Conveyancing', slug: 'conveyancing', icon: '📋', description: 'Property conveyancing and legal transfers' },
      { name: 'Building & Pest Inspection', slug: 'building-pest', icon: '🔍', description: 'Building and pest inspection services' },
    ],
  },
  {
    name: 'Home Services',
    slug: 'home-services',
    icon: '🏠',
    description: 'Home maintenance, renovation, and trade services',
    subcategories: [
      { name: 'House Renovation', slug: 'house-renovation', icon: '🏗️', description: 'Home renovation and remodeling services' },
      { name: 'Landscaping', slug: 'landscaping', icon: '🌿', description: 'Garden and landscape design services' },
      { name: 'Cleaning Services', slug: 'cleaning-services', icon: '🧹', description: 'Residential and commercial cleaning' },
      { name: 'Plumbing', slug: 'plumbing', icon: '🔧', description: 'Plumbing and drainage services' },
      { name: 'Electrical Services', slug: 'electrical-services', icon: '⚡', description: 'Electricians and electrical services' },
      { name: 'Painting', slug: 'painting', icon: '🎨', description: 'House painting and decorating services' },
    ],
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    icon: '❤️',
    description: 'Health, medical, beauty, and wellness services',
    subcategories: [
      { name: 'Medical & Health', slug: 'medical-health', icon: '🏥', description: 'Doctors, clinics, and health services' },
      { name: 'Pharmacy', slug: 'pharmacy', icon: '💊', description: 'Pharmacy and pharmaceutical services' },
      { name: 'Beauty & Skincare', slug: 'beauty-skincare', icon: '💄', description: 'Beauticians, skincare, and cosmetic services' },
      { name: 'Hair Salon', slug: 'hair-salon', icon: '💇', description: 'Hair salons, barbershops, and styling services' },
      { name: 'Fitness & Gym', slug: 'fitness-gym', icon: '🏋️', description: 'Gyms, personal training, and fitness services' },
      { name: 'Disability Support', slug: 'disability-support', icon: '♿', description: 'NDIS and disability support services' },
    ],
  },
  {
    name: 'Finance & Legal',
    slug: 'finance-legal',
    icon: '💰',
    description: 'Financial, legal, and insurance services',
    subcategories: [
      { name: 'Accounting & Tax', slug: 'accounting-tax', icon: '📊', description: 'Accounting, bookkeeping, and tax services' },
      { name: 'Insurance', slug: 'insurance', icon: '🛡️', description: 'Insurance brokers and advisory services' },
      { name: 'Legal Services', slug: 'legal-services', icon: '⚖️', description: 'Lawyers and legal advisory services' },
    ],
  },
  {
    name: 'Food & Dining',
    slug: 'food-dining',
    icon: '🍽️',
    description: 'Restaurants, catering, and food services',
    subcategories: [
      { name: 'Restaurant & Cafe', slug: 'restaurant-cafe', icon: '🍛', description: 'Nepali restaurants, cafes, and food services' },
      { name: 'Catering', slug: 'catering', icon: '🍲', description: 'Catering services for events and functions' },
    ],
  },
  {
    name: 'Grocery & Products',
    slug: 'grocery-products',
    icon: '🛒',
    description: 'Nepali groceries, fresh produce, spices, and specialty products',
    subcategories: [
      { name: 'Nepali Grocery', slug: 'nepali-products', icon: '🛍️', description: 'Nepali groceries, spices, and specialty items' },
      { name: 'Fresh Produce', slug: 'fresh-produce', icon: '🥬', description: 'Fresh Nepali vegetables and produce' },
      { name: 'Online Grocery', slug: 'online-grocery', icon: '📦', description: 'Online Nepali grocery delivery services' },
    ],
  },
  {
    name: 'Events & Celebrations',
    slug: 'events-celebrations',
    icon: '🎉',
    description: 'Event planning, festivals, and celebration services',
    subcategories: [
      { name: 'Party & Event Organizer', slug: 'party-event-organizer', icon: '🎊', description: 'Party planning and event management' },
      { name: 'Festival Services', slug: 'festival-services', icon: '🪔', description: 'Festival planning, decorations, and cultural events' },
      { name: 'Photography & Videography', slug: 'photography-videography', icon: '�', description: 'Photography, videography, and media services' },
    ],
  },
  {
    name: 'Education & Career',
    slug: 'education-career',
    icon: '📚',
    description: 'Education, migration, and career services',
    subcategories: [
      { name: 'Education & Tutoring', slug: 'education-tutoring', icon: '🎓', description: 'Tutoring and education support for all levels' },
      { name: 'Migration & Consultancy', slug: 'migration-consultancy', icon: '✈️', description: 'Migration agents and consultancy services' },
      { name: 'Driving School', slug: 'driving-school', icon: '🚗', description: 'Driving lessons and license preparation' },
      { name: 'Childcare', slug: 'childcare', icon: '👶', description: 'Childcare and early learning services' },
    ],
  },
  {
    name: 'Trade & Services',
    slug: 'trade-services',
    icon: '🔨',
    description: 'Trades, mechanical, and hire services',
    subcategories: [
      { name: 'Auto & Mechanic', slug: 'auto-mechanic', icon: '🔩', description: 'Auto repair, mechanics, and car services' },
      { name: 'Transport & Logistics', slug: 'transport-logistics', icon: '�', description: 'Transport, moving, and logistics services' },
    ],
  },
  {
    name: 'Technology & Business',
    slug: 'technology-business',
    icon: '💻',
    description: 'IT, technology, and business services',
    subcategories: [
      { name: 'IT & Technology', slug: 'it-technology', icon: '🖥️', description: 'IT support, web development, and tech services' },
    ],
  },
  {
    name: 'Buying and Selling',
    slug: 'buying-selling',
    icon: '🏷️',
    description: 'Buying and selling items',
    subcategories: [
      { name: 'New Items', slug: 'new-items', icon: '🆕', description: 'New Items for selling' },
      { name: 'Used Items', slug: 'used-items', icon: '♻️', description: 'Used Items for selling' },
    ],
  },
  {
    name: 'Rental',
    slug: 'rental',
    icon: '🔑',
    description: 'Room rentals, house rentals, equipment hire, and vehicle rentals',
    subcategories: [
      { name: 'Room Rental', slug: 'room-rental', icon: '🛏️', description: 'Room and shared accommodation rentals' },
      { name: 'House Rental', slug: 'house-rental', icon: '🏠', description: 'Full house and apartment rentals' },
      { name: 'Car & Vehicle Hire', slug: 'car-vehicle-hire', icon: '🚗', description: 'Car, van, and vehicle rental services' },
      { name: 'Machine & Equipment Hire', slug: 'machine-equipment-hire', icon: '🚜', description: 'Machinery and equipment rental services' },
      { name: 'Dress & Costume Hire', slug: 'dress-hire', icon: '👗', description: 'Traditional and formal dress hire services' },
    ],
  },
];

const sampleBusinesses = [
  // ===== QUEENSLAND - BRISBANE NORTHSIDE =====
  { name: 'Grace Beauty & Threading - Strathpine', category_slug: 'beauty-skincare', state: 'QLD', city: 'Strathpine', phone: '', description: 'Eyebrow threading, eyelash perming, tinting, extensions, henna tattoos, waxing, and facial therapy at Strathpine Centre', latitude: -27.3050, longitude: 152.9940, website: '' },
  { name: 'Nemy Beauty Center', category_slug: 'beauty-skincare', state: 'QLD', city: 'Marsden', phone: '', description: 'Full face threading, brow sculpting and tinting, beauty treatments by Nepali beauticians', latitude: -27.6720, longitude: 153.0960, website: '' },

  // ===== QUEENSLAND - BRISBANE =====
  // Restaurants & Cafes
  { name: 'Kathmandu Newa Chhe\'n', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Paddington', phone: '0738691877', description: 'Authentic Nepalese restaurant at 72 Latrobe Terrace in a Queenslander house with traditional cushioned seating and Nepali folk music', latitude: -27.4600, longitude: 153.0100, website: 'https://www.kathmandunewa.com.au' },
  { name: 'Himalayan Cafe', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Fortitude Valley', phone: '0733584015', description: 'Fortitude Valley mainstay at 640 Brunswick St serving Tibetan-Nepalese cuisine with prayer-flag-lined courtyard and family recipes', latitude: -27.4570, longitude: 153.0380, website: '' },
  { name: 'Indus Cafe Express Geebung', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Geebung', phone: '0738122209', description: 'Indian and Nepalese cuisine including Onion Bhaji, Chicken Tikka, momos, and Hyderabadi Dum Biryani', latitude: -27.3750, longitude: 153.0440, website: 'http://www.induscafe.com.au' },
  { name: 'MoMo Curry Nepal', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Brisbane', phone: '', description: 'Traditional Nepali cooking with innovative dishes reflecting the harmony of two rich cultures', latitude: -27.4698, longitude: 153.0251, website: '' },
  { name: 'New Farm Curry House', category_slug: 'restaurant-cafe', state: 'QLD', city: 'New Farm', phone: '', description: 'Authentic Indian and Nepali cuisine from curries to momos in New Farm', latitude: -27.4680, longitude: 153.0500, website: '' },

  // ===== QUEENSLAND - GOLD COAST =====
  { name: '8848 Momo House', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Surfers Paradise', phone: '0433948848', description: 'Nepalese dumplings and Oriental Fusion at 42 Cavill Avenue, tender plump momos with authentic and innovative fillings', latitude: -28.0024, longitude: 153.4300, website: 'https://www.8848momos.com.au' },
  { name: 'Rai\'s Sekuwa Corner', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Southport', phone: '0755275944', description: 'Bold smoky flavors of traditional Nepali street food — momo, sekuwa, and Newari specialties at 1/149 Scarborough St, Southport', latitude: -27.9670, longitude: 153.4000, website: 'https://www.raisekuwacorner.com.au' },
  { name: 'Indus Indian & Nepalese Restaurant Gold Coast', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Surfers Paradise', phone: '0424073106', description: 'Authentic Indian and Nepalese cuisine since 2015, known for spiced butter chicken and momo platter near Surfers Beach', latitude: -28.0000, longitude: 153.4310, website: 'https://www.indusrestaurant.com.au' },
  { name: 'Kathmandu Momo Surfers Paradise', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Surfers Paradise', phone: '', description: 'Authentic Nepalese and Northern Indian cuisine with vibrant ambiance and traditional decor', latitude: -28.0024, longitude: 153.4290, website: '' },
  { name: 'Chef Kumar Chalise - Private Chef', category_slug: 'catering', state: 'QLD', city: 'Gold Coast', phone: '', description: 'Private Chef with 20+ years of global culinary experience, passionate advocate for Nepali cuisine on the Gold Coast', latitude: -28.0167, longitude: 153.4000, website: 'https://chefin.com.au/chefs/kumar-chalise/' },

  // ===== QUEENSLAND - SUNSHINE COAST =====
  { name: 'Tapari Momo', category_slug: 'restaurant-cafe', state: 'QLD', city: 'Sunshine Coast', phone: '', description: 'Authentic Himalayan dumplings and Nepali cuisine using time-honored recipes and fresh ingredients', latitude: -26.6500, longitude: 153.0660, website: 'https://taparimomo.com.au' },

  // ===== QUEENSLAND - GROCERY & PRODUCTS =====
  { name: 'Gorkha Foods', category_slug: 'nepali-products', state: 'QLD', city: 'Brisbane', phone: '', description: 'Best quality organic Nepali and Indian grocery — farm to plate, delivering across QLD', latitude: -27.4698, longitude: 153.0251, website: 'https://gorkhafoods.com' },
  { name: 'Om Spice Grocery & Fresh Meat', category_slug: 'nepali-products', state: 'QLD', city: 'Brisbane', phone: '', description: 'Nepali and South Asian groceries all in one place in Brisbane', latitude: -27.4750, longitude: 153.0280, website: '' },
  { name: 'Danphe Stores', category_slug: 'nepali-products', state: 'QLD', city: 'Brisbane', phone: '', description: 'Authentic Nepali grocery online store delivering across Queensland', latitude: -27.4700, longitude: 153.0200, website: 'https://danphestores.com' },

  // ===== QUEENSLAND - SERVICES =====
  { name: 'Nepalese Driving School', category_slug: 'driving-school', state: 'NSW', city: 'Sydney', phone: '0490265659', description: 'Experienced and qualified Nepali driving instructors, lessons in English and Nepali, overseas licence conversion', latitude: -33.8688, longitude: 151.2093, website: 'https://nepalesedrivingschool.com.au' },
  { name: 'NG Trade Solutions', category_slug: 'plumbing', state: 'QLD', city: 'West End', phone: '0732602523', description: 'Plumbing, electrical, solar, hot water, air conditioning, drainage and gas fitting at 2/18 Bank St, West End QLD', latitude: -27.4810, longitude: 153.0050, website: 'https://ngtradesolutions.com.au' },
  { name: 'Neil Tax Solutions', category_slug: 'accounting-tax', state: 'QLD', city: 'Brisbane', phone: '', description: 'Registered tax agent providing personalised accounting, taxation and consulting services in Brisbane', latitude: -27.4698, longitude: 153.0251, website: 'http://ntstax.com.au' },
  { name: 'Shehnaz Threading & Beauty Salon', category_slug: 'beauty-skincare', state: 'QLD', city: 'Nerang', phone: '0430926040', description: 'Threading, facial, henna, and waxing at 4/31 Station Street, Nerang, operating since 2009', latitude: -27.9950, longitude: 153.3240, website: 'https://shehnazthreading.com.au' },
  { name: 'Bharosa Community Services', category_slug: 'disability-support', state: 'QLD', city: 'Brisbane', phone: '', description: 'Registered NDIS provider based in Brisbane, supporting participants across Queensland', latitude: -27.4698, longitude: 153.0251, website: 'https://bharosa.com.au' },
  { name: 'Path to Independence', category_slug: 'disability-support', state: 'QLD', city: 'Brisbane', phone: '', description: 'Registered NDIS provider delivering services in Brisbane, Gold Coast, Ipswich and Logan City', latitude: -27.4698, longitude: 153.0251, website: 'https://pathtoindependence.com.au' },
  { name: 'Delta Community Support QLD', category_slug: 'disability-support', state: 'QLD', city: 'Brisbane', phone: '', description: 'NDIS registered provider supporting people with disability across Brisbane, Gold Coast, and Sunshine Coast', latitude: -27.4698, longitude: 153.0251, website: 'https://www.deltacommunity.com.au' },
  { name: 'Yeti\'s Hideout Catering', category_slug: 'catering', state: 'QLD', city: 'Brisbane', phone: '', description: 'Nepalese street food catering for festivals and intimate gatherings, crafted from fresh local ingredients', latitude: -27.4698, longitude: 153.0251, website: 'https://www.yetishideout.com.au' },

  // ===== NSW - SYDNEY =====
  { name: 'Namaste Restaurant Ashfield', category_slug: 'restaurant-cafe', state: 'NSW', city: 'Ashfield', phone: '0296462662', description: 'Best Nepali and Indian restaurant in Ashfield, Sydney', latitude: -33.8871, longitude: 151.1260, website: 'https://namasterestro.com.au' },
  { name: 'Namaste Restaurant Sydney CBD', category_slug: 'restaurant-cafe', state: 'NSW', city: 'Sydney', phone: '0292679060', description: 'Authentic Nepali and Indian cuisine at 307 Pitt St, Sydney CBD', latitude: -33.8750, longitude: 151.2080, website: 'https://namasterestro.com.au' },
  { name: 'Namaste Restaurant Hurstville', category_slug: 'restaurant-cafe', state: 'NSW', city: 'Hurstville', phone: '0295803888', description: 'Nepali and Indian restaurant at 225H Forest Rd, Hurstville', latitude: -33.9667, longitude: 151.1000, website: 'https://namasterestro.com.au' },
  { name: 'The Muglan Nepalese & Indian Restaurant', category_slug: 'restaurant-cafe', state: 'NSW', city: 'Sydney', phone: '0292672788', description: 'Family business in the heart of Sydney CBD since 2011, serving tandoori and vegetarian dishes', latitude: -33.8737, longitude: 151.2068, website: '' },
  { name: 'Yummy Laphing Granville', category_slug: 'restaurant-cafe', state: 'NSW', city: 'Granville', phone: '', description: 'Authentic Nepali and Tibetan street food on East Street, Granville', latitude: -33.8333, longitude: 151.0125, website: '' },
  { name: 'Nepali Pasal', category_slug: 'nepali-products', state: 'NSW', city: 'Sydney', phone: '', description: 'Nepali online grocery store delivering across Sydney', latitude: -33.8688, longitude: 151.2093, website: 'https://www.nepalipasal.com.au' },
  { name: 'Namaste Veggies & Grocery', category_slug: 'nepali-products', state: 'NSW', city: 'Sydney', phone: '', description: 'Fresh Nepali vegetables, Himalayan spices, and South Asian essentials', latitude: -33.8700, longitude: 151.2000, website: 'https://namasteveggiesandgrocery.com.au' },
  { name: 'Nexor Group Sydney', category_slug: 'migration-consultancy', state: 'NSW', city: 'Sydney', phone: '0391110009', description: 'Nepali migration agents offering expert visa and immigration advice', latitude: -33.8688, longitude: 151.2093, website: 'https://www.nexorgroup.com.au' },
  { name: 'Mantra Education & Migration', category_slug: 'migration-consultancy', state: 'NSW', city: 'Sydney', phone: '', description: 'Overseas student consulting and migration services based in Sydney', latitude: -33.8700, longitude: 151.2050, website: 'https://mantraeducation.com.au' },
  { name: 'Expert Education Parramatta', category_slug: 'migration-consultancy', state: 'NSW', city: 'Parramatta', phone: '', description: 'Education and visa services with registered migration agents', latitude: -33.8151, longitude: 151.0011, website: 'https://experteducation.com' },
  { name: 'WIDEN Migration Experts', category_slug: 'migration-consultancy', state: 'NSW', city: 'Sydney', phone: '', description: 'Registered migration agent Keshab Chapagain (MARN 1576536), helping Nepali community since 2015', latitude: -33.8688, longitude: 151.2093, website: 'https://www.widen.com.au' },
  { name: 'Khaja Nepali Catering', category_slug: 'catering', state: 'NSW', city: 'Sydney', phone: '', description: 'Nepali catering service launched in 2021 serving the growing Nepalese community in Sydney', latitude: -33.8688, longitude: 151.2093, website: 'https://khaja.com.au' },
  { name: 'AS Catering', category_slug: 'catering', state: 'NSW', city: 'Sydney', phone: '', description: 'Family-run Nepali catering bringing authentic Himalayan flavors to Sydney events', latitude: -33.8688, longitude: 151.2093, website: 'https://ascatering.com.au' },
  { name: 'Glam Nepal Hair & Beauty', category_slug: 'hair-salon', state: 'NSW', city: 'Merrylands', phone: '', description: 'High-energy hair transformations, professional makeup, and rejuvenating beauty treatments', latitude: -33.8333, longitude: 150.9920, website: 'https://glamnepal.com.au' },
  { name: 'Nepali Driving School Lidcombe', category_slug: 'driving-school', state: 'NSW', city: 'Lidcombe', phone: '', description: 'Nepali-speaking driving instructors, automatic and manual lessons, international license conversion support', latitude: -33.8642, longitude: 151.0466, website: 'https://nepalidrivingschool.com.au' },

  // ===== VIC - MELBOURNE =====
  { name: 'Kandel Consultancy', category_slug: 'migration-consultancy', state: 'VIC', city: 'Melbourne', phone: '', description: 'First Nepalese education agency in Melbourne, serving over 28,000 international students in 18 years', latitude: -37.8136, longitude: 144.9631, website: 'https://kandelconsultancy.com.au' },
  { name: 'Danfe Education & Migration', category_slug: 'migration-consultancy', state: 'VIC', city: 'Melbourne', phone: '', description: 'Best education and migration consulting in Melbourne', latitude: -37.8100, longitude: 144.9700, website: 'https://www.danfe.com.au' },
  { name: 'Nexor Group Melbourne', category_slug: 'migration-consultancy', state: 'VIC', city: 'Melbourne', phone: '0391110009', description: 'Visa consultants and migration experts at 350 Queen Street, helping people migrate to Australia', latitude: -37.8140, longitude: 144.9633, website: 'https://www.nexorgroup.com.au' },
  { name: 'Momo & Spices', category_slug: 'nepali-products', state: 'VIC', city: 'Melbourne', phone: '', description: 'Nepali and Indian grocery online with free delivery for orders above $79 across Melbourne', latitude: -37.8136, longitude: 144.9631, website: 'https://www.momoandspices.au' },
  { name: 'Indreni Supermarket', category_slug: 'nepali-products', state: 'VIC', city: 'Sunshine', phone: '', description: 'Nepali supermarket in Sunshine, Melbourne', latitude: -37.7880, longitude: 144.8330, website: 'https://www.indrenisupermarket.com.au' },
  { name: 'Hamro Grocery & Food Hub', category_slug: 'nepali-products', state: 'VIC', city: 'Ballarat', phone: '', description: 'Authentic Nepali tastes and Asian spices in Ballarat', latitude: -37.5622, longitude: 143.8503, website: 'https://www.hamrogroceryfoodhub.com' },
  { name: 'Lumanti Restaurant', category_slug: 'restaurant-cafe', state: 'VIC', city: 'Melbourne', phone: '', description: 'Traditional Nepali flavours from Samay Baji to momos, using fresh locally-sourced ingredients', latitude: -37.8100, longitude: 144.9600, website: 'https://www.lumanti.com.au' },

  // ===== SA - ADELAIDE =====
  { name: 'Namaste Nepalese Restaurant Adelaide', category_slug: 'restaurant-cafe', state: 'SA', city: 'Adelaide', phone: '', description: 'One of the first Nepalese restaurants in South Australia, established 2003, inside a 100-year-old cottage', latitude: -34.9285, longitude: 138.6007, website: 'https://namasterestaurant.com.au' },

  // ===== BUYING AND SELLING - NEW ITEMS =====
  { name: 'Himalayan Handicrafts Australia', category_slug: 'new-items', state: 'QLD', city: 'Brisbane', phone: '0412345678', description: 'Handcrafted Nepali singing bowls, thangka paintings, pashmina shawls, and traditional jewelry shipped across Australia', latitude: -27.4698, longitude: 153.0251, website: '' },
  { name: 'Nepal Bazaar Online', category_slug: 'new-items', state: 'NSW', city: 'Sydney', phone: '0423456789', description: 'Online store selling authentic Nepali clothing, dhaka topi, kurta suruwal, and cultural accessories', latitude: -33.8688, longitude: 151.2093, website: '' },
  { name: 'Everest Electronics', category_slug: 'new-items', state: 'VIC', city: 'Melbourne', phone: '0434567890', description: 'New and sealed electronics, mobile phones, laptops, and accessories at competitive prices', latitude: -37.8136, longitude: 144.9631, website: '' },
  { name: 'Namaste Furniture & Homewares', category_slug: 'new-items', state: 'QLD', city: 'Gold Coast', phone: '0445678901', description: 'Brand new furniture, home decor, and Nepali-inspired homewares for modern Australian homes', latitude: -28.0167, longitude: 153.4000, website: '' },
  { name: 'Dhaulagiri Sports & Outdoors', category_slug: 'new-items', state: 'NSW', city: 'Parramatta', phone: '0456789012', description: 'New trekking gear, camping equipment, cricket bats, and sports accessories', latitude: -33.8151, longitude: 151.0011, website: '' },

  // ===== BUYING AND SELLING - USED ITEMS =====
  { name: 'Nepali Community Buy & Sell Brisbane', category_slug: 'used-items', state: 'QLD', city: 'Brisbane', phone: '0467890123', description: 'Second-hand furniture, appliances, and household items from Nepali families relocating or upgrading', latitude: -27.4698, longitude: 153.0251, website: '' },
  { name: 'Sydney Nepali Garage Sale', category_slug: 'used-items', state: 'NSW', city: 'Sydney', phone: '0478901234', description: 'Pre-loved clothing, kitchenware, baby items, and electronics at affordable prices', latitude: -33.8688, longitude: 151.2093, website: '' },
  { name: 'Melbourne Dai Ko Used Cars', category_slug: 'used-items', state: 'VIC', city: 'Melbourne', phone: '0489012345', description: 'Quality used cars, inspected and serviced, helping Nepali community find reliable vehicles', latitude: -37.8136, longitude: 144.9631, website: '' },
  { name: 'Hamro Second Hand Store', category_slug: 'used-items', state: 'QLD', city: 'Logan', phone: '0490123456', description: 'Used furniture, washing machines, fridges, and beds — perfect for students and new arrivals', latitude: -27.6389, longitude: 153.1094, website: '' },
  { name: 'Sajha Deals Adelaide', category_slug: 'used-items', state: 'SA', city: 'Adelaide', phone: '0401234567', description: 'Community marketplace for used textbooks, bicycles, musical instruments, and household goods', latitude: -34.9285, longitude: 138.6007, website: '' },
];

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert parent categories and subcategories
    for (const parent of categoriesData) {
      const parentResult = await client.query(
        `INSERT INTO categories (name, slug, icon, description, parent_id) 
         VALUES ($1, $2, $3, $4, NULL) 
         ON CONFLICT (slug) DO UPDATE SET name = $1
         RETURNING id`,
        [parent.name, parent.slug, parent.icon, parent.description]
      );
      const parentId = parentResult.rows[0].id;

      for (const sub of parent.subcategories) {
        await client.query(
          `INSERT INTO categories (name, slug, icon, description, parent_id) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (slug) DO NOTHING`,
          [sub.name, sub.slug, sub.icon, sub.description, parentId]
        );
      }
    }

    // Insert sample businesses (skip if already exists)
    for (const business of sampleBusinesses) {
      const categoryResult = await client.query(
        'SELECT id FROM categories WHERE slug = $1',
        [business.category_slug]
      );

      if (categoryResult.rows.length > 0) {
        // Check if business already exists
        const existing = await client.query(
          'SELECT id FROM businesses WHERE name = $1 AND state = $2 AND city = $3 AND user_id IS NULL',
          [business.name, business.state, business.city]
        );
        if (existing.rows.length > 0) continue;

        const website = 'website' in business ? (business as Record<string, unknown>).website : null;
        await client.query(
          `INSERT INTO businesses (name, category_id, state, city, phone, description, latitude, longitude, website) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [business.name, categoryResult.rows[0].id, business.state, business.city, business.phone, business.description, business.latitude, business.longitude, website || null]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully');
    console.log(`Inserted ${categoriesData.length} parent categories`);
    console.log(`Inserted ${categoriesData.reduce((acc, c) => acc + c.subcategories.length, 0)} subcategories`);
    console.log(`Inserted ${sampleBusinesses.length} sample businesses`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
