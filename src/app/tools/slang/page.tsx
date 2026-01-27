import { Translatable } from '@/components/translatable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const slangData = [
  { term: 'Bag', definition: 'Refers to kissing someone or hooking up with them. Can be used as Did you bag? or Did you get baggings? meaning Didyoukissormake-out with someone?.' },
  { term: 'Bakkie', definition: 'A utility truck, pickup truck or ute in Australia.' },
  { term: 'Bergie', definition: 'Refers to a particular subculture of vagrants in Cape Town (from Afrikaans berg (mountain), originally referring to vagrants who sheltered in the forests of Table Mountain.) Increasingly used in other cities to mean a vagrant of any description.' },
  { term: 'Biltong', definition: 'Cured meat, similar to jerky.' },
  { term: 'Bioscope', definition: 'Cinema, movie theatre (now dated).' },
  { term: 'Biscuit', definition: 'Same as American cookie.' },
  { term: 'Bladdy', definition: 'South African version of bloody, from the Afrikaans blerrie.' },
  { term: 'Boerewors', definition: 'Spicy sausage from (Afrikaans) farmer-sausage (usually made with a mixture of beef and pork).' },
  { term: 'Book of life', definition: 'National identity document (now dated).' },
  { term: 'Braai', definition: 'A barbecue, to barbecue (from Afrikaans).' },
  { term: 'Brinjal', definition: 'Eggplant (from Portuguese berinjela, also used in Indian English).' },
  { term: 'Buck', definition: 'A Rand.' },
  { term: 'Bundu', definition: 'A wilderness region, remote from cities (from Shona bundo, meaning grasslands).' },
  { term: 'Bunking', definition: 'As used in the UK, playing truant, skipping school/class.' },
  { term: 'Bunny chow', definition: 'Loaf of bread filled with curry, speciality of Durban, particularly Durban Indians.' },
  { term: 'Cafe', definition: 'When pronounced /kæ?fi?/ refers to a convenience store not a coffee shop (originally such stores sold coffee and other basic items).' },
  { term: 'China', definition: '(e.g. howzit my china?) - rhyming slang for mate derived from Chum.' },
  { term: 'Chips', definition: 'Used for both French fries and potato crisps.' },
  { term: 'Circle', definition: 'Traffic circle or roundabout.' },
  { term: 'Clutch pencil', definition: 'A mechanical pencil.' },
  { term: 'Coloured', definition: 'Refers to typically brown skinned South Africans of mixed European and Khoisan or black and/or Malayan ancestry.' },
  { term: 'Cool drink, cold drink', definition: 'Soft drink, fizzy drink not necessarily chilled.' },
  { term: 'Costume', definition: 'Besides meaning attire worn to a dress-up party/play it also refers to a bathing suit (short for swimming costume or bathing costume), sometime abbreviated cozzie also used in Britain.' },
  { term: 'Dagga', definition: 'Marijuana, dag-gah, dagca (similar in pronunciation to an Arabic herb).' },
  { term: 'Dam', definition: 'Also used to mean a reservoir.' },
  { term: 'Donga', definition: 'A ditch of the type found in South African topography (from Zulu, \'wall\').' },
  { term: 'Erf plural erven', definition: 'A plot of land for a building (from Cape Dutch).' },
  { term: 'Garden boy', definition: 'A male gardener (of any age), (Commonly used by older white South Africans, now considered politically incorrect).' },
  { term: 'Geyser', definition: 'Domestic water boiler.' },
  { term: 'Globe', definition: 'As formerly used in Britain, a light bulb.' },
  { term: 'Hey?', definition: 'Similar to eh? or huh?.' },
  { term: 'Homeland', definition: 'Under apartheid, typically referred to a self-governing state for black South Africans.' },
  { term: 'House', definition: 'A free-standing dwelling. Usage differs from the UK, where a house is not free-standing, unlike a bungalow.' },
  { term: 'Howzit', definition: 'Hello, how are you, good morning (despite being a contraction (grammar) of \'how is it\', howzit is almost exclusively a greeting, and seldom a question).' },
  { term: 'Indaba', definition: 'Conference (from Zulu, \'a matter for discussion\').' },
  { term: 'Is it?', definition: 'An all purpose exclamative, can be used in any context where really?, uh-huh, etc. would be appropriate; for example: I\'m feeling pretty tired. Is it?. Often contracted in speech to izit.' },
  { term: 'Ja well no fine', definition: 'Expression of indifference or ambivalence.' },
  { term: 'Jam', definition: 'Can also be referred to as having a good time, partying, drinking etc. e.g. Let\'s jam soon.' },
  { term: 'Jol', definition: 'Another term more commonly used for partying and drinking. e.g. It was a jol or I am jolling with you soon.' },
  { term: 'Just now', definition: 'Idiomatically used to mean soon, later, or in a short while, but unlike the UK not immediately.' },
  { term: 'Kief', definition: 'Kiff, kief, adj., indicating appreciation (like cool). Originating from the resin glands of cannabis Kief.' },
  { term: 'koki, koki pen, a fibr', definition: 'tip (coloured) art pen (from a local brand name).' },
  { term: 'kombi', definition: 'a minivan, esp. Volkswagen (from the Volkswagen \'Kombi\' van).' },
  { term: 'lekker', definition: 'originating from the Afrikaans word for sweet, now meaning nice, pleasant or enjoyable in South African English.' },
  { term: 'location', definition: 'an apartheid-era urban area populated by Blacks, Cape Coloureds or Indians (dated, replaced township in common usage amongst Whites, but still widely used by Blacks).' },
  { term: 'main road', definition: 'what is generally called a High Street in Britain or a Main Street in North America.' },
  { term: 'matric', definition: 'school-leaving certificate or the final year of high school or a student in the final year, short for matriculation exemption. Equivalent internationally to A-Levels or Twelfth grade.' },
  { term: 'mielie', definition: 'an ear of maize (from Afrikaans mielie).' },
  { term: 'mielie meal', definition: 'used for both maize flour and the traditional porridge made from it similar to American grits, the latter also commonly known by the Afrikaans word pap.' },
  { term: 'monkey\'s wedding', definition: 'a sunshower.' },
  { term: 'muti', definition: 'traditional medicine.' },
  { term: 'naartjie', definition: 'orange-colored citrus fruit with separable segments and skin that is easily peeled (from Afrikaans), similar to a Tangerine in Britain.' },
  { term: 'now now', definition: 'idiomatically used to mean soon (sooner than just now in South Africa, but similar to just now in the United Kingdom).' },
  { term: 'Rand', definition: 'currency, divided into 100 cents. The plural of rand is Rand, not Rands.' },
  { term: 'robot, robots', definition: 'besides the standard meaning, in South Africa this is also used for traffic lights. The etymology of the word derives from a description of early traffic lights as robot policemen, which then got truncated with time.' },
  { term: 'rondavel', definition: 'round free-standing building, usually with a thatched roof.' },
  { term: 'saami', definition: 'a sandwich.' },
  { term: 'samoosa', definition: 'Indian samosa.' },
  { term: 'shame', definition: 'an exclamation denoting sympathy as in shame, you poor thing, you must be cold.' },
  { term: 'shebeen', definition: 'illegal drinking establishment (also used in Scotland).' },
  { term: 'shongololo', definition: 'millipede (from Zulu and Xhosa, ukushonga, to roll up).' },
  { term: 'SMS', definition: 'a text message sent via a mobile / cell phone.' },
  { term: 'snackwich', definition: 'a grilled cheese sandwich (made in a snackwich maker / snackwich machine).' },
  { term: 'sosatie', definition: 'a kebab on a stick.' },
  { term: 'spanspek', definition: 'a cantaloupe (from Afrikaans meaning: Spanish Bacon).' },
  { term: 'spaza', definition: 'an informal trading post/convenience store found in townships and remote areas.' },
  { term: 'standard', definition: 'besides other meanings referred to a school grade higher than grades 1 and 2 (now defunct).' },
  { term: 'State President', definition: 'head of state between 1961 and 1994 - now known as President.' },
  { term: 'stiffy, stiffy disk', definition: 'a 3.5 inch floppy disk, floppy is used exclusively for the old 5.25 inch or larger disks.' },
  { term: 'sucker', definition: 'used for a popsicle (frozen sucker), a lollipop.' },
  { term: 'takkies', definition: 'sneakers, trainers (from Afrikaans tekkies).' },
  { term: 'taxi', definition: 'shared taxi (usually a minibus taxi) as well as taxicab.' },
  { term: 'toasted cheese', definition: 'a grilled cheese sandwich, in contrast cheese on toast refers to unmelted cheese on toasted bread.' },
  { term: 'township', definition: 'large residential suburb lacking city infrastructure, in particular the areas allocated to non-white South Africans under apartheid.' },
  { term: 'veld', definition: 'virgin bush, especially grassland or wide open rural spaces.' },
];

export default function SlangPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center text-primary">
          <Translatable text="South African Slang" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          <Translatable text="Brush up on some local lingo! Here are some common (and not-so-common) slang terms you might hear on your travels." />
        </p>

        <Accordion type="single" collapsible className="w-full mt-12">
            {slangData.map((item) => (
                <AccordionItem value={item.term} key={item.term}>
                    <AccordionTrigger className="text-lg font-semibold text-left">
                        <Translatable text={item.term} />
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        <Translatable text={item.definition} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
