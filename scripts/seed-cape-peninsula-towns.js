/**
 * Seeds Firestore towns/{slug} docs for six new Western Cape towns:
 * Sea Point, Camps Bay, Clifton, Bantry Bay, Constantia, Kirstenbosch.
 *
 * Mirrors the field structure used for the towns/sodwana-bay and towns/mbazwana
 * docs (slug, name, provinceSlug, highlights, signatureAttractions,
 * bestTimeToVisit, longDescription) - confirmed by reading those two live docs
 * before writing this script. No photo1-6 fields are written, matching that
 * precedent: town-image.ts's pickSubmittedTownPhoto() treats missing photo
 * fields as "no submitted photo" and resolveTownImage() falls back to the
 * static imageId ('town-generic') placeholder, so the page renders correctly
 * with no client-supplied images until they're uploaded via /admin.
 *
 * This script only touches the six slugs listed in TOWNS below - it never
 * reads or writes any other town doc.
 *
 * Usage:
 *   node scripts/seed-cape-peninsula-towns.js           (writes to Firestore)
 *   node scripts/seed-cape-peninsula-towns.js --dry-run  (prints payloads only)
 *
 * Requires: service-account.json in the project root (git-ignored).
 */

const admin = require('firebase-admin');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const TOWNS = [
  {
    slug: 'sea-point',
    name: 'Sea Point',
    provinceSlug: 'western-cape',
    highlights: `Cape Town's liveliest Atlantic Seaboard promenade
Sea Point Pavilion tidal pool complex
Historic synagogues and a long-standing Jewish community
Graaff's Pool tidal swimming spot
Main Road's dense restaurant and deli strip
Sweeping sunset views over the Atlantic
Minutes from the City Bowl and V&A Waterfront`,
    signatureAttractions: "• Sea Point Promenade, • Sea Point Pavilion, • Graaff's Pool, • Main Road dining strip",
    bestTimeToVisit: 'November – March (long sunny evenings on the promenade), June – August (dramatic winter swells, fewer crowds)',
    longDescription: `Sea Point – Cape Town's Buzzing Atlantic Promenade

Wedged between the slopes of Signal Hill and the cold Atlantic Ocean, Sea Point is one of Cape Town's most densely lived-in and best-loved suburbs, just a few minutes' drive from the City Bowl. It has none of the reserve of the wine towns inland or the hush of the coves further down the coast — Sea Point is Cape Town at full volume, a strip of Art Deco apartment blocks, delis, gyms and synagogues facing straight out to sea.

For travellers based in central Cape Town, planning an Atlantic Seaboard walk, or simply looking for sunset without leaving the city, Sea Point rewards a slow afternoon more than almost anywhere else on the peninsula.

The promenade is where Sea Point happens.

A paved walkway runs for several kilometres along the coast from the old Mouille Point lighthouse toward Bantry Bay and Clifton, and on any evening it fills with joggers, dog walkers, skateboarders and families out for ice cream. Public artworks and a giant outdoor chessboard punctuate the route, and benches face directly into the sunset over the Atlantic.

The Sea Point Pavilion is the suburb's other great gathering point.

A large tidal saltwater pool complex built into the rocks along the promenade, it has been a Cape Town institution for generations, drawing families for laps, sunbathing and views back toward Lion's Head that few municipal pools anywhere can match.

History runs deep along Main Road.

Sea Point has long been home to one of Cape Town's oldest Jewish communities, and its historic synagogues sit only streets away from the promenade. Main Road itself is the suburb's commercial spine, a dense strip of restaurants, delis, bakeries and bars that stays busy long after the beach towns further south have gone quiet for the night.

Further along the rocks, Graaff's Pool recalls an older, quieter Sea Point.

A small tidal pool cut into the rocks near the promenade, it has drawn locals for open-water swims for more than a century, a reminder that beneath the high-rises Sea Point has always been a swimming suburb first.

Summer brings the promenade to life from early morning swims to late sunset strolls, while winter's Atlantic swells turn the same stretch of coast into a dramatic, spray-lashed walk best enjoyed wrapped up in a jacket.

Explore Nearby

🚗 Bantry Bay – 2 km

🚗 Green Point and the V&A Waterfront – 3 km

🚗 Clifton – 4 km

🚗 Camps Bay – 6 km

🚗 Cape Town City Bowl – 4 km

Why Travellers Love Sea Point

Because the promenade never really closes. Because the Pavilion pool has been drawing swimmers for generations. Because Main Road stays alive after the beaches have gone quiet. Because Lion's Head is always in view. And because it puts you minutes from the City Bowl without ever losing sight of the ocean.

Whether you're searching for the best sunset walk in Cape Town, a swimmer's suburb, a base close to the Waterfront, or simply a slice of the city that faces the sea, Sea Point delivers it without ceremony, every single day.`,
  },
  {
    slug: 'camps-bay',
    name: 'Camps Bay',
    provinceSlug: 'western-cape',
    highlights: `Iconic beach beneath the Twelve Apostles
Palm-lined Victoria Road beachfront strip
Tidal pool for calmer swimming
Shark Spotters programme during summer
Hiking trails into the Twelve Apostles
Some of Cape Town's best sunset dining`,
    signatureAttractions: '• Camps Bay Beach, • Victoria Road restaurant strip, • The Twelve Apostles, • Camps Bay tidal pool',
    bestTimeToVisit: 'December – February (peak beach season and sunsets), March – April (quieter beach, warm autumn evenings)',
    longDescription: `Camps Bay – Cape Town's Postcard Beach Beneath the Twelve Apostles

Few beaches anywhere line up as perfectly as Camps Bay. A wide crescent of white sand faces the Atlantic directly beneath the Twelve Apostles, the jagged mountain wall that runs south from Table Mountain, and the combination of ocean, sand and rock has made this one of the most photographed suburbs in South Africa.

For travellers chasing the classic Cape Town sundowner, exploring the Atlantic Seaboard, or simply wanting to see Table Mountain's other face, Camps Bay is usually the first stop.

Victoria Road is the beachfront's palm-lined stage.

Rows of palm trees line the road that runs the length of the beach, backed by restaurants, cocktail bars and boutique hotels whose terraces fill early for sunset. Few places in the city do the golden hour with this much theatre — mountains behind, ocean in front, and a beach that only gets busier as the light fades.

The beach itself rewards more than photographs.

A tidal pool at the northern end offers calmer swimming than the open Atlantic, and Shark Spotters keep watch from the mountain above during summer, one of several beaches along this coast covered by the programme. The water stays cold year-round, courtesy of the Benguela current, which keeps the crowds on the sand rather than in the surf.

Above the beach, the Twelve Apostles set the scene.

The mountain wall behind Camps Bay is part of the same sandstone range as Table Mountain, and hiking trails climb from the suburb's upper streets onto its slopes, rewarding an early start with views back down over the beach and out across the Atlantic.

Summer weekends see the beach and Victoria Road at their busiest, while winter trades the crowds for dramatic mountain cloud and quieter, moodier sunsets over the same view.

Explore Nearby

🚗 Clifton – 2 km

🚗 Bantry Bay – 4 km

🚗 Sea Point – 6 km

🚗 Hout Bay – 10 km

🚗 Cape Town City Bowl – 10 km

Why Travellers Love Camps Bay

Because the mountains rise straight out of the sand. Because the sunsets over Victoria Road are as good as Cape Town gets. Because the tidal pool offers an easy escape from the cold Atlantic swell. Because a hiking trail into the Twelve Apostles starts at the top of the beach. And because no photograph quite prepares you for seeing it in person.

Whether you're planning an Atlantic Seaboard road trip, searching for the best sunset spot in Cape Town, or simply want to see the mountain from its dramatic western side, Camps Bay is the beach every Cape Town itinerary eventually leads to.`,
  },
  {
    slug: 'clifton',
    name: 'Clifton',
    provinceSlug: 'western-cape',
    highlights: `Four sheltered beaches (1st to 4th)
Granite boulders that block the coastal wind
Turquoise water despite the cold Atlantic
Some of the most valuable real estate in Africa
A long-standing following among Cape Town's LGBTQ+ community at First Beach
Steep stairway access from Victoria Road`,
    signatureAttractions: '• Clifton 1st Beach, • Clifton 2nd Beach, • Clifton 3rd Beach, • Clifton 4th Beach',
    bestTimeToVisit: 'December – February (calmest water and full beach season), March (warm, quieter shoulder season)',
    longDescription: `Clifton – Four Beaches Tucked Beneath the Granite

South of Camps Bay, the coastline breaks into a series of granite boulders and sheltered coves known simply as Clifton's four beaches — 1st, 2nd, 3rd and 4th — each reached down a steep stairway from Victoria Road and each with its own character.

For travellers looking for Cape Town's most exclusive stretch of sand, a sheltered swim out of the wind, or simply the city's best people-watching, Clifton is where the Atlantic Seaboard gets its glamour.

Fourth Beach is the most accessible and the busiest.

Closest to the parking above and the largest of the four, it draws families, sunbathers and a steady stream of vendors selling cold drinks along the sand, and it's usually the first beach visitors reach.

First and Second Beach trade footfall for seclusion.

Reached down longer flights of stairs and screened by the granite boulders that separate each cove, these two beaches have long drawn a quieter, more private crowd, and First Beach in particular has a well-established following among Cape Town's LGBTQ+ community.

The granite itself is what makes Clifton work.

The boulders dividing each beach block much of the wind that scours the rest of the Atlantic Seaboard, so Clifton stays sheltered even on blustery days, one of the main reasons it's prized over more exposed beaches nearby, even though the water is just as cold.

Above the sand, the real estate is some of the most valuable in Africa.

Cliffside houses and apartments stack up the slope above the beaches, many worth tens of millions of rand, their decks angled to catch the same sunset that draws everyone down on the sand below.

Summer is Clifton at its busiest, when all four beaches fill from mid-morning; outside peak season the coves empty out almost completely, leaving the boulders and turquoise water to a handful of early swimmers.

Explore Nearby

🚗 Camps Bay – 2 km

🚗 Bantry Bay – 3 km

🚗 Sea Point – 5 km

🚗 Cape Town City Bowl – 8 km

Why Travellers Love Clifton

Because the granite boulders block the wind that hits everywhere else. Because four beaches means four different moods within a few hundred metres of each other. Because the water is that impossible turquoise despite being freezing. And because nowhere else on the Atlantic Seaboard feels quite this exclusive.

Whether you're chasing the calmest swim on the Atlantic Seaboard, the most private stretch of sand near Cape Town, or simply want to see why this stretch of coast commands the highest property prices in the country, Clifton's four beaches are worth the walk down the stairs.`,
  },
  {
    slug: 'bantry-bay',
    name: 'Bantry Bay',
    provinceSlug: 'western-cape',
    highlights: `Cliffside apartments built directly above the rocks
Uninterrupted Atlantic sunset views
Dramatic wave-watching during winter swells
No beach, and correspondingly few crowds
Halfway point between Sea Point and Clifton`,
    signatureAttractions: '• Bantry Bay coastal walkway views, • Rocky shoreline and wave-watching points',
    bestTimeToVisit: 'June – August (biggest swells and dramatic spray), November – February (calm seas and long sunsets)',
    longDescription: `Bantry Bay – Where the Atlantic Meets the Rocks

Between Sea Point and Clifton, the coast road climbs briefly past Bantry Bay, one of Cape Town's smallest and most exclusive suburbs — a scatter of cliffside apartment blocks built directly above the rocks, with no beach to speak of and nothing between the buildings and the open Atlantic.

For travellers who want the Atlantic Seaboard's views without its beach crowds, or who simply want to watch a Cape Town sunset from somewhere quieter, Bantry Bay is easy to drive past and worth the detour.

The rocks, not the sand, are the point here.

Waves break directly against the boulders below the suburb, throwing spray up toward the road on a big swell, and the absence of a swimmable beach has kept Bantry Bay quieter than its neighbours on either side, even in peak season.

Every apartment here is built for one thing: the view.

Balconies face straight out over the ocean with nothing to interrupt the horizon, and Bantry Bay's real estate is among the most sought-after on the peninsula precisely because so few buildings block another's sightline to the sunset.

It's a five-minute link between two of Cape Town's most famous suburbs.

Bantry Bay sits directly on the coast road between Sea Point's promenade and Clifton's beaches, making it an easy stop for photographs of the sunset or the swell without needing to find parking at either busier neighbour.

Winter swells bring the most dramatic wave-watching, with the Atlantic throwing spray metres into the air against the rocks, while summer's calmer seas make for a quieter, gentler version of the same view.

Explore Nearby

🚗 Sea Point – 2 km

🚗 Clifton – 3 km

🚗 Camps Bay – 5 km

🚗 Cape Town City Bowl – 5 km

Why Travellers Love Bantry Bay

Because there's no beach to share the view with. Because the waves crash close enough to feel them. Because it sits exactly between Sea Point and Clifton without the crowds of either. And because a five-minute drive delivers one of the purest ocean views on the Atlantic Seaboard.

Whether you're driving the Atlantic Seaboard for the views, searching for a quieter sunset spot than Camps Bay or Clifton, or simply curious why this short stretch of coast commands such high prices, Bantry Bay is worth the slow drive-through.`,
  },
  {
    slug: 'constantia',
    name: 'Constantia',
    provinceSlug: 'western-cape',
    highlights: `South Africa's oldest wine-producing valley, established 1685
Groot Constantia and its historic Cape Dutch manor house
Klein Constantia, Buitenverwachting, Steenberg and Constantia Glen estates
Oak-lined avenues and Cape Dutch architecture
Constantia Nek gateway to Table Mountain National Park
Estate restaurants set among the vineyards`,
    signatureAttractions: '• Groot Constantia, • Klein Constantia, • Buitenverwachting, • Constantia Nek',
    bestTimeToVisit: 'March – April (harvest season), September – November (spring vineyards and mild weather)',
    longDescription: `Constantia – South Africa's Oldest Wine Valley

On the green, forested southern slopes of Table Mountain, Constantia has been producing wine since 1685, when Governor Simon van der Stel established Groot Constantia — making this valley the oldest wine-producing area in the Southern Hemisphere, older than most of the estates that now define the Cape Winelands further inland.

For travellers planning a wine route without leaving Cape Town, exploring the city's leafy southern suburbs, or looking for one of the most historic valleys in South Africa, Constantia offers all of it within half an hour of the CBD.

Groot Constantia remains the valley's grand dame.

The whitewashed Cape Dutch manor house and working cellar are open for tastings and tours, and the estate's history is tied directly to one of South Africa's most celebrated exports: a sweet wine once so prized that Napoleon reportedly requested a case of it in exile on St Helena.

Around Groot Constantia, a cluster of equally historic estates carries the valley's wine tradition forward.

Klein Constantia, Buitenverwachting, Steenberg and Constantia Glen sit within a few minutes of each other, each with its own tasting room, and several pair their wines with some of the southern suburbs' best restaurants, set among vineyards with the mountain rising directly behind them.

The valley itself is as much a reason to visit as the wine.

Oak-lined avenues, whitewashed Cape Dutch homesteads and forested mountain slopes give Constantia a hushed, established character quite different from the rest of Cape Town, and the suburb remains one of the city's most sought-after addresses.

Constantia Nek marks the valley's edge and its gateway to the mountain.

The pass climbs out of the valley toward Hout Bay, and hiking and mountain biking trails leading into Table Mountain National Park start from near the top, making it a popular link between a morning on the trails and an afternoon of wine tasting.

Autumn brings harvest activity and turning vine leaves across the valley, while spring and summer are best for lunching on estate terraces with the mountain and vineyards on full display.

Explore Nearby

🚗 Kirstenbosch National Botanical Garden – 4 km

🚗 Constantia Nek and Hout Bay – 8 km

🚗 Muizenberg – 12 km

🚗 Cape Town City Bowl – 15 km

Why Travellers Love Constantia

Because the wine history here predates almost everywhere else in the country. Because Napoleon himself reportedly asked for this valley's wine. Because oak avenues and Cape Dutch homesteads give it a character all its own. And because you can wine taste in the morning and be back in the city for dinner.

Whether you're planning a Cape Town wine route, tracing the origins of South African winemaking, or simply looking for a green, historic escape from the city, Constantia is the valley that started it all.`,
  },
  {
    slug: 'kirstenbosch',
    name: 'Kirstenbosch',
    provinceSlug: 'western-cape',
    highlights: `One of the world's great botanical gardens, established 1913
The Boomslang canopy walkway
Kirstenbosch Summer Sunset Concerts on the main lawn
Home to thousands of Cape Floral Kingdom species
Hiking trails including Skeleton Gorge and Nursery Ravine
A UNESCO World Heritage site`,
    signatureAttractions: '• Boomslang Canopy Walkway, • Summer Sunset Concerts, • Fragrance Garden, • Protea Garden',
    bestTimeToVisit: 'August – October (spring wildflowers), November – March (Sunday Summer Sunset Concerts)',
    longDescription: `Kirstenbosch – One of the Great Botanical Gardens of the World

On the eastern slopes of Table Mountain, where the mountain's rainier side supports forest instead of fynbos scrub, Kirstenbosch National Botanical Garden has been showcasing the extraordinary plant life of the Cape Floral Kingdom since 1913, and is widely regarded as one of the finest botanical gardens on earth.

For travellers exploring Cape Town's southern suburbs, planning a picnic with a view, or simply looking for the best way to understand the botanical richness that makes this part of South Africa a UNESCO World Heritage site, Kirstenbosch rewards half a day easily.

The Cape Floral Kingdom is the reason the garden exists at all.

It is the smallest of the world's six floral kingdoms and by far the richest for its size, packing thousands of plant species — many found nowhere else on earth — into a sliver of the Western Cape, and Kirstenbosch was established specifically to conserve and display that diversity.

The Boomslang canopy walkway is the garden's most photographed feature.

A curved steel-and-timber walkway rises above the trees, letting visitors walk through the canopy itself rather than beneath it, with views back down over the garden and out across the Cape Flats — a favourite spot for a slow lap before or after exploring the paths below.

In summer, the lawns become an amphitheatre.

The Kirstenbosch Summer Sunset Concerts, held on the main lawn on Sunday evenings through the warmer months, are a Cape Town institution, with visitors picnicking on the grass as the sun sets behind the mountain and musicians play on the stage below.

The garden is also a gateway onto the mountain itself.

Trails including Skeleton Gorge and Nursery Ravine climb directly out of Kirstenbosch onto Table Mountain's upper slopes, popular routes for hikers looking to reach the summit from the quieter, greener side of the mountain rather than the cableway.

Spring brings the garden's wildflowers into full bloom, while summer's long evenings are built for the sunset concerts and a late picnic on the lawns.

Explore Nearby

🚗 Constantia wine estates – 4 km

🚗 Newlands – 3 km

🚗 Muizenberg – 14 km

🚗 Cape Town City Bowl – 13 km

Why Travellers Love Kirstenbosch

Because it protects one of the richest floral kingdoms on earth. Because the Boomslang walkway takes you into the treetops. Because the Summer Sunset Concerts turn a botanical garden into one of the city's best evenings out. And because a hiking trail up Table Mountain starts right where the garden ends.

Whether you're a keen gardener, planning a Table Mountain hike from its quieter side, or simply looking for one of Cape Town's most beautiful places to picnic, Kirstenbosch is unmissable.`,
  },
];

async function main() {
  if (!DRY_RUN) {
    const serviceAccount = require(path.join(__dirname, '..', 'service-account.json'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  const db = DRY_RUN ? null : admin.firestore();

  for (const town of TOWNS) {
    const { slug, ...payload } = town;

    if (DRY_RUN) {
      console.log(`--- [dry run] towns/${slug} ---`);
      console.log(JSON.stringify(payload, null, 2));
      continue;
    }

    const ref = db.collection('towns').doc(slug);
    const existing = await ref.get();
    if (existing.exists) {
      console.log(`towns/${slug} already exists - merging fields (existing data is not overwritten by absent fields).`);
    }
    await ref.set(payload, { merge: true });
    console.log(`Wrote towns/${slug}`);
  }

  console.log(DRY_RUN ? '\nDry run complete - no writes were made.' : '\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
