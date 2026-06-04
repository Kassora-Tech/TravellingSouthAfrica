import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Import local datasets
import { provinces } from '../src/lib/data/provinces';
import { towns } from '../src/lib/data/towns';
import { sights } from '../src/lib/data/sights';
import { routes } from '../src/lib/data/routes';

// Define unified listings
const sampleListings = [
  {
    category: 'accommodation',
    name: 'Cape Grace Hotel & Spa',
    description: 'A luxurious oasis of elegance and warmth on a private quay in the V&A Waterfront, Cape Town. Offers magnificent views of Table Mountain and the marina.',
    town: 'Cape Town',
    province: 'Western Cape',
    address: 'West Quay Road, Victoria & Alfred Waterfront, Cape Town, 8001',
    phone: '+27 21 410 7100',
    website: 'https://www.capegrace.com',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R8500 per night'
  },
  {
    category: 'accommodation',
    name: 'Kruger Shalati',
    description: 'An extraordinary luxury hotel permanently stationed on the Selati Bridge above the Sabie River in Kruger National Park. Breathtaking views and safari adventures.',
    town: 'Skukuza',
    province: 'Mpumalanga',
    address: 'Selati Bridge, Skukuza, Kruger National Park, 1350',
    phone: '+27 13 591 6000',
    website: 'https://www.krugershalati.com',
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R12500 per night'
  },
  {
    category: 'restaurant',
    name: 'The Test Kitchen Fledgelings',
    description: 'An innovative, world-class dining experience in Woodstock, Cape Town, fusing local South African ingredients with global culinary techniques.',
    town: 'Cape Town',
    province: 'Western Cape',
    address: 'The Old Biscuit Mill, 375 Albert Rd, Woodstock, Cape Town, 7925',
    phone: '+27 21 447 2337',
    website: 'https://thetestkitchen.co.za',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R1200 per person'
  },
  {
    category: 'restaurant',
    name: 'Marble Restaurant',
    description: 'A celebration of open-flame cooking in the heart of Rosebank, Johannesburg. Boasts spectacular views and a premium selection of meats and wines.',
    town: 'Johannesburg',
    province: 'Gauteng',
    address: '19 Keyes Ave, Rosebank, Johannesburg, 2196',
    phone: '+27 10 594 5550',
    website: 'https://marble.restaurant',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R650 average main'
  },
  {
    category: 'attraction',
    name: 'Table Mountain Aerial Cableway',
    description: 'A state-of-the-art cableway offering a 360-degree rotating view of Cape Town and Table Mountain as you ascend to the summit.',
    town: 'Cape Town',
    province: 'Western Cape',
    address: 'Tafelberg Rd, Gardens, Cape Town, 8001',
    phone: '+27 21 424 8181',
    website: 'https://www.tablemountain.net',
    coverImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f',
    images: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f',
      'https://images.unsplash.com/photo-1579226905180-636b76d96082'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R420 return ticket'
  },
  {
    category: 'attraction',
    name: 'Gold Reef City',
    description: 'A historic theme park in Johannesburg situated on an old gold mine. Features thrilling roller coasters, a casino, and an underground mine tour.',
    town: 'Johannesburg',
    province: 'Gauteng',
    address: 'Northern Parkway & Data Crescent, Ormonde, Johannesburg, 2159',
    phone: '+27 11 248 5000',
    website: 'https://www.southernsun.com/gold-reef-city',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      'https://images.unsplash.com/photo-1560253023-3ec5d502959f'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R250 general entry'
  },
  {
    category: 'service_provider',
    name: 'Wild Horizons Cape Town Tours',
    description: 'Premier tour guide and transfer company specializing in curated Day Tours of the Cape Peninsula, Wine Tasting tours, and shark cage diving transfers.',
    town: 'Cape Town',
    province: 'Western Cape',
    address: 'Dock Road, V&A Waterfront, Cape Town, 8001',
    phone: '+27 21 418 0907',
    website: 'https://www.wildhorizons.co.za',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R1500 per day tour'
  },
  {
    category: 'service_provider',
    name: 'Sabi Sabi Private Safari Guides',
    description: 'Exclusive private game ranger and tracking services for bespoke photographic safaris inside the Sabi Sands Game Reserve.',
    town: 'Skukuza',
    province: 'Mpumalanga',
    address: 'Sabi Sand Wildtuin, Skukuza, 1350',
    phone: '+27 11 447 7172',
    website: 'https://www.sabisabi.com',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53'
    ],
    status: 'approved',
    submittedBy: 'system-seed',
    approvedBy: 'system-seed',
    price: 'R4500 per day safari'
  }
];

// Slugs of 15 towns to seed
const selectedTownSlugs = [
  'cape-town',
  'stellenbosch',
  'franschhoek',
  'knysna',
  'johannesburg',
  'pretoria',
  'durban',
  'pietermaritzburg',
  'graskop',
  'mbombela',
  'port-elizabeth',
  'east-london',
  'bloemfontein',
  'clarens',
  'polokwane'
];

// Slugs of 10 sights to seed
const selectedSightSlugs = [
  'table-mountain',
  'kruger-national-park',
  'robben-island',
  'blyde-river-canyon',
  'cape-winelands',
  'drakensberg-mountains',
  'soweto',
  'cradle-of-humankind',
  'addo-elephant-park',
  'tsitsikamma-national-park'
];

// Slugs of 4 major routes to seed
const selectedRouteSlugs = [
  'n1-route',
  'n2-route',
  'n3-route',
  'n4-route'
];

async function main() {
  console.log('Initializing Firebase Admin SDK...');
  
  const projectId = 'travel-south-africa-2026';
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log(`Found service-account.json key file at: ${serviceAccountPath}`);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    console.log(`Loaded credentials for project: ${serviceAccount.project_id || 'unknown'}`);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    console.log(`No service-account.json found at: ${serviceAccountPath}`);
    console.log('Attempting connection via Application Default Credentials (ADC) or environmental fallbacks...');
    try {
      admin.initializeApp();
    } catch (err: any) {
      console.error('Failed to initialize Admin SDK:', err.message);
      console.log('\n--- HOW TO CONFIGURE CREDENTIALS ---');
      console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts.');
      console.log('2. Click "Generate new private key" to download the JSON file.');
      console.log('3. Save it in the project root folder as "service-account.json".');
      console.log('4. Run the seeding script again!\n');
      process.exit(1);
    }
  }

  const db = admin.firestore();
  console.log('Successfully connected to Firestore database.');

  // --- SEED PROVINCES ---
  console.log('\nSeeding Provinces...');
  for (const province of provinces) {
    const docRef = db.collection('provinces').doc(province.slug);
    await docRef.set(province);
    console.log(`- Seeded province: ${province.name} (${province.slug})`);
  }

  // --- SEED TOWNS ---
  console.log('\nSeeding 15 Selected Towns...');
  const townsToSeed = towns.filter(t => selectedTownSlugs.includes(t.slug));
  for (const town of townsToSeed) {
    const docRef = db.collection('towns').doc(town.slug);
    await docRef.set(town);
    console.log(`- Seeded town: ${town.name} (${town.slug})`);
  }

  // --- SEED SIGHTS ---
  console.log('\nSeeding 10 Selected Sights...');
  const sightsToSeed = sights.filter(s => selectedSightSlugs.includes(s.slug));
  for (const sight of sightsToSeed) {
    const docRef = db.collection('sights').doc(sight.slug);
    await docRef.set(sight);
    console.log(`- Seeded sight: ${sight.name} (${sight.slug})`);
  }

  // --- SEED ROUTES ---
  console.log('\nSeeding 4 Major Routes (N1-N4)...');
  const routesToSeed = routes.filter(r => selectedRouteSlugs.includes(r.slug));
  for (const route of routesToSeed) {
    const docRef = db.collection('routes').doc(route.slug);
    await docRef.set(route);
    console.log(`- Seeded route: ${route.name} (${route.slug})`);
  }

  // --- SEED LISTINGS ---
  console.log('\nSeeding 8 Sample Listings (2 per category)...');
  const now = admin.firestore.Timestamp.now();
  const oneYearFromNow = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  );

  for (let i = 0; i < sampleListings.length; i++) {
    const item = sampleListings[i];
    const listingId = `seed-listing-${item.category}-${i + 1}`;
    const docRef = db.collection('listings').doc(listingId);
    
    const docData = {
      ...item,
      id: listingId,
      submittedAt: now,
      approvedAt: now,
      expiresAt: oneYearFromNow
    };
    
    await docRef.set(docData);
    console.log(`- Seeded listing: ${item.name} under ${item.category} (${listingId})`);
  }

  console.log('\nDatabase seeding completed successfully! 🎉');
}

main().catch(err => {
  console.error('Fatal error during database seeding:', err);
  process.exit(1);
});
