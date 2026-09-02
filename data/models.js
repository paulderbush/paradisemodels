// =================== DATA ===================
// Canonical service list — client-supplied, keep this as the single source
// of truth (do not add ad-hoc service names elsewhere). Items with a
// well-known abbreviation are stored abbreviated; write out full names only
// when there isn't a set abbreviation for them.
const SERVICES = ["69","FK","DFK","GFE","OWO","OWC","COB","CIF","CIM","Swallow","Snowballing","DT","Fingering","A-Level","DP","PSE","Party girl","Face sitting","Dirty talk","Lady's services","WS giving","WS receiving","Rimming giving","Rimming receiving","Smoking fetish","Roleplay","Filming with mask","Filming without mask","Foot fetish","Squirting","Open minded","Light domination","Spanking giving","Soft spanking receiving","DUO","Bi DUO","Couples","MMF for double price","Group for extra price","Massage","Prostate massage","Professional massage","Body to body massage","Erotic massage","Lomilomi massage","Nuru massage","Sensual massage","Tantric massage","Striptease","Lapdancing","Belly-dance","Uniforms","Toys","Strap-on","Poppers","Handcuffs","Domination","Fisting giving","Fisting receiving","Tie and Tease"];

const NATIONALITIES = ["Albanian","Argentine","Belarusian","Brazilian","British","Bulgarian","Chilean","Chinese","Colombian","Costa Rican","Eastern European","Egyptian","Estonian","French","German","Hungarian","Italian","Kazakh","Latvian","Lithuanian","Mexican","Moldovan","Paraguayan","Polish","Portuguese","Romanian","Russian","Spanish","Thai","Ukrainian","Vietnamese"];

const STATIONS = ["Aldgate","Aldgate East","Angel","Baker Street","Bank","Barbican","Barons Court","Battersea Power Station","Bayswater","Bermondsey","Bethnal Green","Blackfriars","Bond Street","Borough","Bow Road","Brixton","Camden Town","Canada Water","Canary Wharf","Cannon Street","Chalk Farm","Chancery Lane","Charing Cross","Chelsea","Clapham Common","Clapham North","Clapham South","Covent Garden","Earl's Court","Edgware Road","Elephant & Castle","Embankment","Euston","Farringdon","Finchley Road","Finsbury Park","Fulham Broadway","Gloucester Road","Green Park","Hammersmith","High Street Kensington","Highbury & Islington","Holborn","Holland Park","Hyde Park Corner","Islington","Kennington","Kensington","King's Cross St. Pancras","Knightsbridge","Lambeth North","Lancaster Gate","Leicester Square","Liverpool Street","London Bridge","Maida Vale","Mansion House","Marble Arch","Marylebone","Mile End","Monument","Moorgate","Nine Elms","Notting Hill Gate","Old Street","Oval","Oxford Circus","Paddington","Parsons Green","Piccadilly Circus","Pimlico","Putney Bridge","Queensway","Regent's Park","Shepherd's Bush","Sloane Square","Soho","South Kensington","Southwark","St. James's Park","St. Paul's","Stepney Green","Stockwell","Stratford","Swiss Cottage","Temple","Tottenham Court Road","Tower Hill","Vauxhall","Victoria","Warren Street","Waterloo","West Brompton","Westminster","Whitechapel"];

const CITIES = ["London","Paris","Monaco","Milan","Dubai","New York","Miami","Zurich","Amsterdam"];

const NAMES_F = ["Anastasia","Isabella","Valentina","Sophia","Natasha","Elena","Mia","Camille","Oksana","Alicia","Diana","Kate","Veronika","Lara","Monica","Zara","Nikita","Simone","Irina","Tatiana","Daria","Alina","Yvette","Chloe","Gabrielle","Polina","Roxana","Bianca","Jade","Crystal"];

const COLORS = [
  ['rgba(123,47,190,0.4)','rgba(74,24,128,0.7)'],
  ['rgba(155,89,208,0.4)','rgba(100,40,160,0.7)'],
  ['rgba(80,20,150,0.4)','rgba(50,10,100,0.7)'],
  ['rgba(140,60,200,0.4)','rgba(90,30,140,0.7)'],
];

// Seeded LCG random number generator
function makeRng(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateModels() {
  return Array.from({length: 45}, (_, i) => {
    const rng = makeRng(i * 999 + 1);
    const rndInt = (a, b) => Math.floor(rng() * (b - a + 1)) + a;
    const pickN = (arr, n) => {
      const shuffled = [...arr];
      for (let j = shuffled.length - 1; j > 0; j--) {
        const k = Math.floor(rng() * (j + 1));
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
      return shuffled.slice(0, n);
    };

    const age = rndInt(18, 45);
    const cats = [];
    if (rng() > 0.5) cats.push('recommended');
    if (age < 25) cats.push('under25');
    if (rng() > 0.5) cats.push('toprated');
    if (rng() > 0.7) cats.push('new');
    const svcs = pickN(SERVICES, rndInt(8, 20));
    const col = COLORS[i % COLORS.length];
    const name = NAMES_F[i % NAMES_F.length] + (i >= NAMES_F.length ? ` ${i + 1}` : '');
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return {
      id: i,
      name,
      slug,
      age,
      height: rndInt(158, 180),
      weight: rndInt(48, 72),
      nationality: NATIONALITIES[rndInt(0, NATIONALITIES.length - 1)],
      station: STATIONS[rndInt(0, STATIONS.length - 1)],
      city: CITIES[i % CITIES.length],
      cats,
      svcs,
      rateHour: rndInt(3, 8) * 50,
      color: col,
      initials: name.charAt(0),
      rating: (4 + rng()).toFixed(1),
      reviews: [],
      real: false,
    };
  });
}

// =================== REAL MODELS ===================
const JULIA_DATA = {
  id: 9996, real: true, vip: false, folder: 'models/Julia', slug: 'julia',
  name: 'Julia', age: 23, height: 173, weight: 53,
  nationality: 'Ukrainian', station: 'Knightsbridge', city: 'London',
  rateHour: 1250, extraHourPrice: 750,
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'JU',
  cats: ['recommended', 'new', 'under25'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Honey', hairColor: 'Blonde', orientation: 'Heterosexual',
  languages: 'English · Russian · Ukrainian',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease', 'WS giving', 'WS receiving'],
  extraSvcs: [
    {name: 'CIM (Includes OWO)', price: 400},
    {name: 'Swallow (Includes OWO & CIM)', price: 500},
  ],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    "I'm a gentle and feminine woman who believes in kindness, warmth, and sincere feelings. I may seem delicate, but I have a caring heart and a soft soul. I appreciate meaningful conversations, cozy moments, and people who value honesty and tenderness.",
    "There is also a passionate and sensual side to me that reveals itself only to someone special. I enjoy chemistry, flirtation, and the magic of genuine attraction. My hobbies reflect different sides of my personality: I love horse riding and equestrian sports, I'm passionate about interior design, and I enjoy target shooting, which reminds me that elegance and strength can exist together.",
  ],
  reviews: [],
};

const LUISA_DATA = {
  id: 9995, real: true, vip: false, folder: 'models/Luisa', slug: 'luisa',
  name: 'Luisa', age: 25, height: 175, weight: 52,
  nationality: 'Brazilian', station: 'South Kensington', city: 'London',
  rateHour: 1250, extraHourPrice: 800,
  color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'],
  initials: 'LU',
  cats: ['recommended', 'new'],
  breastSize: '30B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Light Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'COB', 'DFK', 'Dirty talk', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Massage', 'OWC', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Striptease'],
  extraSvcs: [
    {name: 'OWO', price: 50},
    {name: 'CIM (Includes OWO)', price: 50},
    {name: 'Swallow', price: 80},
    {name: 'Snowballing', price: 80},
    {name: 'DT', price: 80},
    {name: 'Tantric massage', price: 100},
    {name: 'WS giving', price: 150},
    {name: 'Rimming giving', price: 150},
    {name: 'A-Level', price: 300},
  ],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2050},
    {label: '3 Hours', price: 2850},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2050},
    {label: '3 Hours', price: 2850},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    'Luisa is a stunning 25-year-old Brazilian beauty whose elegance and sensuality are impossible to overlook. Tall and graceful at 175cm, with a perfectly balanced figure, she embodies natural allure. Her light brown eyes sparkle with warmth and mystery, while her silky brunette hair frames a face full of irresistible charm.',
    'More than just captivating looks, Luisa exudes confidence and passion, creating an atmosphere charged with desire — whether through delicate seduction or daring playfulness. What sets her apart is her natural beauty — no tattoos, no piercings, just effortless femininity and impeccable style. She carries herself with poise and refinement, making her the perfect companion for high-class occasions, exclusive dinners, or private moments where discretion is key.',
    'For gentlemen who value elegance, authenticity, and the charm of a truly refined woman, Luisa is the ideal choice. Book Luisa today and experience high-class companionship at its finest.',
  ],
  reviews: [],
};

const AIRA_DATA = {
  id: 9994, real: true, vip: false, folder: 'models/Aira', slug: 'aira',
  name: 'Aira', age: 26, height: 170, weight: 49,
  nationality: 'Russian', station: 'South Kensington', city: 'London',
  rateHour: 1250, extraHourPrice: 750,
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'AI',
  cats: ['recommended', 'new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Heterosexual',
  languages: 'English · Russian',
  svcs: ['69', 'Bi DUO', 'CIF', 'CIM', 'COB', 'DFK', 'Erotic massage', 'Toys', 'Face sitting', 'Filming with mask', 'FK', 'Foot fetish', 'GFE', 'Massage', 'OWC', 'OWO', 'Party girl', 'PSE', 'Soft spanking receiving', 'Spanking giving'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    'A perfect Russian petite escort will provide you an unforgettable night. She is your VIP companion for high class time. Aira is a babe who is gorgeous and open-minded. This lady is the ideal partner for any fantasy you may have.',
    'Aira is inviting you to awaken the sensuality and eroticism that lies within you as well as to experience new heights of passion and pleasure.',
  ],
  reviews: [],
};

const ANASTASIIA_DATA = {
  id: 9993, real: true, vip: false, folder: 'models/Anastasiia', slug: 'anastasiia',
  name: 'Anastasiia', age: 25, height: 168, weight: 55,
  nationality: 'French', station: "Earl's Court", city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(180,90,120,0.4)', 'rgba(110,40,70,0.7)'],
  initials: 'AN',
  cats: ['recommended', 'new'],
  breastSize: '34G', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Blue', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Russian · French',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'Fisting giving', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'PSE', 'Rimming giving', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Strap-on', 'Striptease', 'Tie and Tease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'CIF', price: 300},
    {name: 'A-Level', price: 500},
    {name: 'Filming without mask', price: 2000},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Anastasiia is a breathtaking brunette with true Playboy magnetism and the raw power of a real, active porn actress. Her curves are unreal, her presence is fierce, and her breasts — the biggest and most irresistible — are pure temptation. She doesn't just look the part; she lives it, with a sensual confidence that commands attention and ignites every fantasy.",
    "This is a woman who does it all — open-minded, deeply experienced, and unafraid to explore your wildest desires. From A-Level to WS and beyond, Anastasiia is the ultimate provider of intense, uninhibited pleasure. She brings the same fire and skill from her films into every real-life experience, turning every session into a scene you'll never forget.",
    "A true party lover and fully available 24/7, Anastasiia is the dream you don't have to wait for. For those who crave more than the ordinary, she's the ultimate choice — always ready to deliver the most intense, unforgettable experiences.",
  ],
  reviews: [],
};

const SKYLAH_DATA = {
  id: 9992, real: true, vip: false, folder: 'models/Skylah', slug: 'skylah',
  name: 'Skylah', age: 24, height: 169, weight: 52,
  nationality: 'Swedish/Lithuanian', station: 'Knightsbridge', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(90,140,190,0.4)', 'rgba(40,80,130,0.7)'],
  initials: 'SK',
  cats: ['recommended', 'new', 'under25'],
  breastSize: '34E', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English',
  svcs: ['69', 'Body to body massage', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'DT', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'Party girl', 'Poppers', 'PSE', 'Rimming receiving', 'Roleplay', 'Swallow', 'Tie and Tease', 'Uniforms'],
  extraSvcs: [
    {name: "Lady's services", price: 150},
    {name: 'Couples', price: 200},
    {name: 'Group for extra price (must be at least 1 more girl)', price: 300},
    {name: 'Filming with mask', price: 500},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4800},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4800},
  ],
  description: [
    "Meet Skylah, our vibrant and highly professional star at the agency. She's 24, a beautiful blue-eyed blonde of Swedish and Lithuanian nationality, with a warm, friendly personality that makes every session relaxed and fun. She really enjoys working with couples and is excellent at creating dynamic, engaging DUO experiences with a partner.",
    "Skylah provides all basic services, and if you book more than an hour, she's happy to offer a swallow for free. She's also known for delivering high-class, discreet service with a natural charm that ensures you'll feel comfortable and satisfied. Despite her youthful look, she's confident and talented, with a genuine energy and ability to connect.",
    "A magnetic presence, Skylah will leave you wanting more — she's sure to make your visit unforgettable.",
  ],
  reviews: [],
};

const ELDORA_DATA = {
  id: 9991, real: true, vip: false, folder: 'models/Eldora', slug: 'eldora',
  name: 'Eldora', age: 25, height: 174, weight: 50,
  nationality: 'Brazilian', station: 'Green Park', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(120,100,80,0.4)', 'rgba(70,55,40,0.7)'],
  initials: 'EL',
  cats: ['recommended', 'new'],
  breastSize: '32C', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', "Lady's services", 'Lapdancing', 'Light domination', 'Massage', 'OWO', 'PSE', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Bi DUO', price: 50},
    {name: 'Prostate massage', price: 50},
    {name: 'Fisting giving', price: 50},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Eldora is a stunning 25-year-old Brazilian brunette whose tall, elegant figure and striking green eyes create an unforgettable first impression. Standing at 174cm with a naturally feminine silhouette, she embodies effortless sophistication and modern allure. Her rich brunette hair and captivating gaze give her a refined beauty that feels both powerful and irresistibly magnetic.",
    "With her natural curves and subtle tattoos, Eldora blends timeless elegance with a touch of bold individuality. She carries herself with confidence and grace, creating an atmosphere that feels luxurious, relaxed, and full of quiet sensuality. Every detail about her appearance reflects authenticity, style, and a naturally captivating charm that draws people in effortlessly.",
    "Fluent in Portuguese, English, and Spanish, Eldora connects with ease in any setting, bringing warmth, intelligence, and vibrant Brazilian energy into every encounter. Open-minded and engaging, she offers more than beauty alone — she creates moments that feel personal, exciting, and truly memorable. Tall, graceful, and impossible to overlook, Eldora leaves a lasting impression wherever she goes.",
  ],
  reviews: [],
};

const LUNA_DATA = {
  id: 9990, real: true, vip: false, folder: 'models/Luna', slug: 'luna',
  name: 'Luna', age: 23, height: 170, weight: 48,
  nationality: 'Russian', station: 'South Kensington', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(200,180,150,0.4)', 'rgba(130,110,80,0.7)'],
  initials: 'LN',
  cats: ['recommended', 'new', 'under25'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Russian',
  // No services list was provided for Luna — the "Services Included"
  // panel is hidden automatically on her profile when svcs is empty.
  svcs: [],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Her name is Luna, and she's every inch the vision of elegance — a tall, radiant blonde with cool Russian beauty and effortless class. Her long legs and graceful posture give her an almost cinematic presence, while her refined style and impeccable grooming make her impossible to forget. Whether she's in lingerie or high heels, Luna captivates with poise, charm, and raw sensuality.",
    "More than just her appearance, Luna knows exactly how to fulfill your deepest cravings. She's attentive, imaginative, and utterly uninhibited — the kind of woman who listens, understands, and delivers. From the most delicate seduction to your boldest fantasies, she invites you into a space where pleasure has no limits and every dream is taken seriously.",
    "If you're ready for an experience that blends luxury with unfiltered passion, Luna is waiting. She doesn't just entertain — she transforms desire into unforgettable reality. A true party lover, available 24/7 to turn every moment into pure excitement.",
  ],
  reviews: [],
};

// =================== VIP MODELS ===================
// vip:true — excluded from every public page/listing at build time (see
// PUBLIC_MODELS in _build/build.js) and only ever served to the client via
// /api/vip-catalog, after payment has been verified server-side.
const AALIYAH_DATA = {
  id: 9989, real: true, vip: true, folder: 'vip-models/Aaliyah', slug: 'aaliyah',
  name: 'Aaliyah', age: 25, height: 166, weight: 46,
  nationality: 'Persian/British', station: 'Battersea', city: 'London',
  rateHour: 1600, extraHourPrice: 1000,
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'AA',
  cats: [],
  breastSize: '32E', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Black', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'PSE', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Swallow', 'Uniforms', 'WS giving'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 2200},
    {label: '2 Hours', price: 2600},
    {label: '3 Hours', price: 3600},
    {label: 'Overnight', price: 9000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 2200},
    {label: '2 Hours', price: 2600},
    {label: '3 Hours', price: 3600},
    {label: 'Overnight', price: 9000},
  ],
  description: [
    "Aaliyah is our top model at the agency, a true superstar with an enchanting presence. At 25 years old, she is half Persian and half British, blending the best of both worlds. She is a curvy, charming brunette with radiant skin, captivating eyes, and a graceful demeanor that make her stand out effortlessly in any setting.",
    "Beyond her stunning looks, Aaliyah is incredibly easy-going and approachable. She approaches her work with a relaxed yet professional attitude, making everyone feel comfortable around her. Her natural charm and friendly personality help her connect effortlessly with clients and colleagues alike.",
    "With her warm and laid-back vibe, Aaliyah easily leaves a lasting impression. She embraces her femininity and exudes confidence while maintaining a calm, down-to-earth attitude. She is truly the one you will never forget—her presence is both captivating and soothing, making her an all-around favorite in the industry.",
  ],
  reviews: [],
};

const KENDAL_DATA = {
  id: 9988, real: true, vip: true, folder: 'vip-models/Kendal', slug: 'kendal',
  name: 'Kendal', age: 22, height: 170, weight: 50,
  nationality: 'Brazilian', station: 'Paddington', city: 'London',
  rateHour: 1600, extraHourPrice: 600,
  color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'],
  initials: 'KE',
  cats: ['recommended'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Black', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English',
  // No services list was provided for Kendal — the "Services Included"
  // panel is hidden automatically on her profile when svcs is empty.
  svcs: [],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2200},
    {label: '3 Hours', price: 2800},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2200},
    {label: '3 Hours', price: 2800},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Meet Kendal, a stunning Brazilian model who exudes natural beauty and elegance. Her slim, captivating figure and radiant presence make her the perfect choice for an unforgettable experience. As a very high-class girl, Kendal offers classy and perfect services, ensuring every moment with her is sophisticated and memorable.",
    "At just 22, Kendal combines youthful charm with a polished demeanor, making her ideal for those seeking a refined and pleasurable encounter. Her services are delivered with grace and perfection, tailored to meet your desires with professionalism and passion. Whether you're looking for a charming companion for a night out, intimate moments, or an elegant roleplay, Kendal's versatile personality guarantees an experience that exceeds expectations.",
    "Dedicated to providing a luxurious and discreet experience, Kendal is approachable, friendly, and eager to make your time together truly special. Book now to enjoy the beauty, slim figure, and class of Kendal for an unforgettable encounter.",
  ],
  reviews: [],
};

const ALICIA_DATA = {
  id: 9987, real: true, vip: true, folder: 'vip-models/Alicia', slug: 'alicia',
  name: 'Alicia', age: 24, height: 178, weight: 50,
  nationality: 'Italian/Brazilian', station: 'Kensington', city: 'London',
  rateHour: 1600, extraHourPrice: 900,
  color: ['rgba(140,60,200,0.4)', 'rgba(90,30,140,0.7)'],
  initials: 'AL',
  cats: [],
  breastSize: '32C', breastType: '', clothingSize: '4',
  eyeColor: 'Light Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Italian · Spanish · Portuguese',
  svcs: ['69', 'FK', 'GFE', 'OWC', 'OWO', 'Party girl'],
  extraSvcs: [
    {name: 'A-Level', price: 0},
    {name: 'CIF', price: 0},
    {name: 'COB', price: 0},
    {name: 'CIM (Includes OWO)', price: 0},
    {name: 'Rimming receiving', price: 0},
  ],
  incallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 2000},
    {label: '2 Hours', price: 2500},
    {label: '3 Hours', price: 3400},
    {label: 'Overnight', price: 9000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 2000},
    {label: '2 Hours', price: 2500},
    {label: '3 Hours', price: 3400},
    {label: 'Overnight', price: 9000},
  ],
  description: [
    "Alicia carries the effortless allure of a woman born for the spotlight. With her striking height and graceful silhouette, she moves with the fluid confidence of a signed international model. Her light brown eyes hold a quiet warmth, framed by soft medium-brown waves that fall naturally around her sculpted face. A blend of Brazilian passion and Italian refinement lives in her presence, giving her beauty an unmistakable depth and charisma.",
    "Behind her captivating appearance lies a creative spirit shaped by fashion and movement. As a dedicated fashion-design student, Alicia sees the world through textures, silhouettes, and colours, weaving her own sense of artistry into everything she touches. Her love for tennis, yoga, and Pilates keeps her form toned yet elegant, giving her a balance of strength and femininity that photographers adore.",
    "Graceful, ambitious, and naturally magnetic, Alicia brings a rare blend of discipline and softness to every space she enters. Whether she is stepping onto a runway, sketching her next design, or perfecting her athletic routines, she embodies refined beauty with a touch of dreamlike charm. She is not just a model to watch—she is a presence impossible to forget.",
  ],
  reviews: [],
};

const ABBEY_DATA = {
  id: 9986, real: true, vip: true, folder: 'vip-models/Abbey', slug: 'abbey',
  name: 'Abbey', age: 25, height: 170, weight: 55,
  nationality: 'British', station: 'Soho', city: 'London',
  rateHour: 1600, extraHourPrice: 1600,
  color: ['rgba(200,180,150,0.4)', 'rgba(130,110,80,0.7)'],
  initials: 'AB',
  cats: [],
  breastSize: '32B', breastType: 'Natural', clothingSize: '6-8',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Heterosexual',
  languages: 'English',
  svcs: ['Body to body massage', 'CIF', 'COB', 'DFK', 'DT', 'Fingering', 'FK', 'Massage', 'OWC', 'Party girl', 'Prostate massage', 'Soft spanking receiving'],
  extraSvcs: [
    {name: 'GFE', price: 0},
    {name: '69', price: 300},
    {name: 'OWO', price: 300},
  ],
  // Outcall only — see hasIncall handling in assets/profile.js, which
  // hides the Incall tab and defaults to Outcall when this is empty.
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1600},
    {label: '90 Min', price: 1850},
    {label: 'Overnight', price: 7700},
  ],
  description: [
    "Abbey is a refined British model with a naturally elegant presence and a calm, confident aura. Her look is pure and authentic — completely natural, without tattoos or piercings — highlighting a timeless kind of beauty that feels effortless and exclusive. Blonde hair, clear blue eyes, and graceful proportions give her a classic British charm that never goes out of style.",
    "She carries herself with quiet sophistication, combining softness with poise. Abbey's appearance is fresh, feminine, and impeccably maintained, reflecting her dedication to a healthy lifestyle and natural aesthetics. As a VIP model, she values discretion, quality, and refined standards, making her presence feel both special and rare.",
    "Beyond her beauty, Abbey's personality is warm, polite, and genuinely engaging. She is well-mannered, attentive, and naturally elegant in conversation, creating a relaxed yet luxurious atmosphere. With her all-natural look, British refinement, and VIP status, Abbey embodies understated luxury and classic femininity.",
  ],
  reviews: [],
};

const AVRORA_DATA = {
  id: 9980, real: true, vip: true, folder: 'vip-models/Avrora', slug: 'avrora',
  name: 'Avrora', age: 25, height: 178, weight: 65,
  nationality: 'Russian', city: 'Istanbul',
  rateHour: 700, extraHourPrice: 500,
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'AV',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Russian',
  // No services list was provided for Avrora — the "Services Included"
  // panel is hidden automatically on her profile when svcs is empty.
  svcs: [],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'CIM', price: 50},
    {name: 'Swallow (Includes OWO & CIM)', price: 100},
    {name: 'Bi DUO', price: 200},
    {name: 'Couples', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 700},
    {label: '90 Min', price: 950},
    {label: '2 Hours', price: 1200},
    {label: '3 Hours', price: 1700},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Avrora is a beautiful blonde whose natural elegance and bright green eyes create an immediately captivating presence. With her fresh, all-natural beauty and graceful confidence, she carries herself with a charm that feels both effortless and refined. Her warm smile and engaging personality make her a delightful companion in any social setting.",
    "Charming, attentive, and open-minded, Avrora enjoys refined evenings, elegant dinners, and memorable social occasions. Whether accompanying you to a sophisticated event or sharing relaxed moments in great company, she creates an atmosphere that feels natural, engaging, and enjoyable. A passionate tennis player, she brings an energetic and active spirit that perfectly complements her graceful femininity. Her healthy lifestyle and natural beauty give her a radiant, fresh appearance that feels genuine and effortlessly attractive.",
    "Moreover, Avrora is working together with her sister Latisa - which means a perfect DUO for everyone who appreciates immaculate service and unforgettable experience. Angels during the day, devils at nights - performance of these two beautiful woman will make you going crazy...",
  ],
  reviews: [],
};

// Minimal VIP profiles — only the facts the client actually gave get
// filled in; everything else (bio paragraphs, services list, extra stat
// tiles, missing rate durations) is simply left out rather than invented,
// and the shared profile template (assets/profile.js) hides each section
// automatically when its data isn't there.
const ANA_DATA = {
  id: 9973, real: true, vip: true, folder: 'vip-models/Ana', slug: 'ana',
  name: 'Ana', age: 23, height: 173,
  measurements: '90-60-90', breastType: 'Natural',
  nationality: 'Russian', city: 'London',
  travelNote: 'Available to travel across Europe and the USA',
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'AN',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [{label: '1 Hour', price: 1250}],
  outcallRates: [{label: '1 Hour', price: 1250}],
  description: [],
  reviews: [],
};

const BAYLA_DATA = {
  id: 9972, real: true, vip: true, folder: 'vip-models/Bayla', slug: 'bayla',
  name: 'Bayla', age: 22, height: 173, weight: 53,
  measurements: '90-60-90', breastType: 'Natural',
  nationality: 'Slavic Jewish', city: 'London',
  travelNote: 'Available to travel across Europe, the UK, Russia, Kazakhstan, China, Korea, the UAE, Saudi Arabia, Uzbekistan, Indonesia, Thailand and the Maldives',
  color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'],
  initials: 'BA',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  // No rate was given for Bayla at all — see hasRates handling in
  // assets/profile.js, which swaps the booking box for a "contact us"
  // prompt when both of these are empty.
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

// Adriana's only given rate (1600 EUR / 2 hours) has been converted to GBP
// at roughly EUR->GBP 0.86, since data/models.js stores every price in GBP
// (assets/currency.js converts to the visitor's local currency for
// display from there) — re-check this conversion if the client meant an
// exact GBP figure.
const ADRIANA_DATA = {
  id: 9971, real: true, vip: true, folder: 'vip-models/Adriana', slug: 'adriana',
  name: 'Adriana', age: 24, height: 172,
  nationality: 'Spanish', city: 'Dubai',
  travelNote: 'Available to travel across Europe',
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'AD',
  cats: ['new'],
  languages: 'English · Spanish · Catalan',
  svcs: [],
  extraSvcs: [],
  incallRates: [{label: '2 Hours', price: 1400}],
  outcallRates: [{label: '2 Hours', price: 1400}],
  description: [
    "Adriana is a 24-year-old Spanish beauty and former Miss Madrid and Miss Barcelona titleholder, bringing genuine pageant polish and presence to every meeting.",
  ],
  reviews: [],
};

// Leyla's only given rate ($3000, read as covering a 1-2 hour booking —
// worth confirming with the client) has been converted to GBP at roughly
// USD->GBP 0.79, for the same reason noted on Adriana above.
const LEYLA_DATA = {
  id: 9970, real: true, vip: true, folder: 'vip-models/Leyla', slug: 'leyla',
  name: 'Leyla', age: 24, height: 171,
  nationality: 'Turkish', city: 'Dubai',
  travelNote: 'Available to travel across Europe',
  color: ['rgba(80,20,150,0.4)', 'rgba(50,10,100,0.7)'],
  initials: 'LE',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [{label: '1-2 Hours', price: 2400}],
  outcallRates: [{label: '1-2 Hours', price: 2400}],
  description: [],
  reviews: [],
};

const RUNALDA_DATA = {
  id: 9969, real: true, vip: true, folder: 'vip-models/Runalda', slug: 'runalda',
  name: 'Runalda', age: 24, height: 170, weight: 49,
  nationality: 'Spanish/Argentinian', city: 'Ibiza',
  travelNote: 'Available to travel across Europe',
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'RU',
  cats: ['new'],
  breastSize: 'C', eyeColor: 'Grey',
  svcs: [],
  extraSvcs: [],
  // Rates on request — no price at all was given, see hasRates handling
  // in assets/profile.js (swaps the booking box for a "contact us" prompt).
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

// Tetiana gave no age/height/weight/nationality at all, only her bio and
// location — the shared profile template already copes with a real model
// missing any of these (see the stat-grid filter and nationality fallback
// in assets/profile.js).
const TETIANA_DATA = {
  id: 9967, real: true, vip: true, folder: 'vip-models/Tetiana', slug: 'tetiana',
  name: 'Tetiana', city: 'Dubai',
  travelNote: 'Based in Dubai — also available across Europe and Bali',
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'TE',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "I'm professional singer and dancer, has took a part in TV shows. Interested in painting, philosophy; do yoga, sport, dance Hip Hop, Vogue, High Heels. Sing in different styles and in different languages. I'm also sociable and punctual person.",
    "At this moment I'm bringing to life my own project. Made two cover albums with world's hits; at this time I'm finishing my big music project - solo album \"I'd like to drive you wild\", had the video made with the same name. I've done also my solo concert \"My all\" in Caribbean club in Kyiv.",
  ],
  reviews: [],
};

const RAVEN_DATA = {
  id: 9965, real: true, vip: true, folder: 'vip-models/Raven', slug: 'raven',
  name: 'Raven', age: 26, height: 176, weight: 55,
  measurements: '93-64-93', breastSize: '75D',
  nationality: 'Latvian', city: 'London',
  travelNote: 'Available everywhere except the USA',
  color: ['rgba(80,20,150,0.4)', 'rgba(50,10,100,0.7)'],
  initials: 'RA',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const MAIAN_DATA = {
  id: 9964, real: true, vip: true, folder: 'vip-models/Maian', slug: 'maian',
  name: 'Maian', age: 23, height: 176,
  nationality: 'Spanish', city: 'Madrid',
  travelNote: 'Available to travel across Europe and Dubai',
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'MA',
  cats: ['new', 'under25'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const TANIA_DATA = {
  id: 9963, real: true, vip: true, folder: 'vip-models/Tania', slug: 'tania',
  name: 'Tania', age: 25, height: 178,
  nationality: 'German/Portuguese', city: 'London',
  travelNote: 'Available to travel around the UK only',
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'TA',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "A DJ, model, actress, entrepreneur, creative director/stylist, and influencer.",
  ],
  reviews: [],
};

const ESTELLE_DATA = {
  id: 9962, real: true, vip: true, folder: 'vip-models/Estelle', slug: 'estelle',
  name: 'Estelle', age: 22, height: 166, weight: 44,
  nationality: 'Japanese/Swedish', city: 'Dubai',
  travelNote: 'Available to travel across Europe',
  breastType: 'Natural',
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'ES',
  cats: ['new', 'under25'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const ESMERALDA_DATA = {
  id: 9961, real: true, vip: true, folder: 'vip-models/Esmeralda', slug: 'esmeralda',
  name: 'Esmeralda', age: 25, height: 171,
  nationality: 'Spanish', city: 'Madrid',
  travelNote: 'Available to travel across Europe and Dubai',
  breastType: 'Natural',
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'ES',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const NASTYA_DATA = {
  id: 9957, real: true, vip: true, folder: 'vip-models/Nastya', slug: 'nastya',
  name: 'Nastya', age: 23, height: 170, weight: 50,
  measurements: '86-62-93', breastSize: '1.5',
  nationality: 'Russian', city: 'Dubai',
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'NA',
  cats: ['new', 'under25'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const NADINE_DATA = {
  id: 9956, real: true, vip: true, folder: 'vip-models/Nadine', slug: 'nadine',
  name: 'Nadine', age: 28, height: 171, weight: 70,
  breastType: 'Enhanced', clothingSize: '10',
  eyeColor: 'Brown', hairColor: 'Black', orientation: 'Bisexual',
  nationality: 'Dutch', city: 'Dubai',
  languages: 'English · Dutch · Arabic',
  color: ['rgba(80,20,150,0.4)', 'rgba(50,10,100,0.7)'],
  initials: 'ND',
  cats: ['new'],
  svcs: [],
  extraSvcs: [
    {name: 'MMF for double price', price: 170},
    {name: 'Couples', price: 170},
    {name: 'CIM (Includes OWO)', price: 170},
    {name: 'CIF', price: 170},
    {name: 'Fingering', price: 170},
    {name: 'Trampling', price: 170},
    {name: 'Foot fetish', price: 170},
    {name: 'Toys', price: 170},
    {name: 'Rimming giving', price: 170},
    {name: 'Rimming receiving', price: 170},
    {name: 'Bi DUO', price: 170},
    {name: 'Roleplay (maid or bunny)', price: 170},
    {name: 'Domination', price: 170},
    {name: 'Submission', price: 170},
    {name: 'Bondage', price: 170},
    {name: 'DT', price: 170},
    {name: 'Dirty talk', price: 170},
    {name: 'GFE', price: 170},
    {name: 'Sex between breast', price: 170},
    {name: 'BDSM', price: 170},
    {name: 'Shower together', price: 170},
    {name: 'Face sitting', price: 170},
  ],
  incallRates: [
    {label: '1 Hour', price: 480},
    {label: '90 Min', price: 640},
    {label: 'Overnight', price: 1500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 480},
    {label: '90 Min', price: 640},
    {label: 'Overnight', price: 1500},
  ],
  extraHourPrice: 250,
  description: [
    "Nadine is a breathtaking Dutch beauty whose presence in Dubai feels effortlessly refined and irresistibly warm. Her black hair frames a striking face, and her deep brown eyes carry a confidence that is both soothing and captivating. She embodies a blend of sophistication and softness—graceful in her movements, elegant in her tone, and endlessly alluring in the way she observes the world around her.",
    "Her silhouette is full, feminine, and wonderfully sculpted, enhanced by her luxurious curves and poised carriage. She has a natural charm untouched by tattoos or piercings, giving her a clean, classic allure that stands out in the most subtle, beautiful way. Whether she's speaking or simply listening, Nadine holds herself with a calm, magnetic composure that draws attention without trying. Being near her feels like stepping into a world of quiet luxury and gentle intimacy.",
    "Fluent in multiple languages and open-hearted in her desires, Nadine brings an enchanting depth to every connection. Her bisexual nature adds fluidity to her warmth—she loves openly, listens deeply, and engages with a rare sincerity that makes every moment feel meaningful. With her, time stretches softly, wrapped in sophistication, ease, and a touch of mystery. Nadine is not just unforgettable—she is the kind of woman who leaves you feeling enriched, understood, and quietly enchanted long after she's gone.",
  ],
  reviews: [],
};

// Renamed from "Tina South" to just "South" — folder/slug updated to
// match. Rates and services replaced with the client's updated pricing,
// given in AED and converted to GBP (the site's stored currency) at
// roughly AED->GBP 0.213, rounded to a clean figure — worth the client
// double-checking against today's actual rate. The old flat per-item
// "extra services" menu is gone; this one splits into what's included at
// every tier and a per-act a-la-carte list layered on top.
const SOUTH_DATA = {
  id: 9955, real: true, vip: true, folder: 'vip-models/South', slug: 'south',
  name: 'South', age: 25, height: 161, weight: 59,
  clothingSize: '8-10', breastSize: '5E', breastType: 'Enhanced',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  nationality: 'Russian/Ukrainian', city: 'Dubai',
  languages: 'English · Russian',
  color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'],
  initials: 'SO',
  cats: ['new'],
  svcs: ['Kissing', 'OWO', 'Deep throat', 'Fingering', 'Squirting', 'Classic sex (any position)', 'COB'],
  extraSvcs: [
    {name: 'Roleplay', price: 100},
    {name: 'Toys (hers or his — she has plenty)', price: 100},
    {name: 'A-Level (up to total time)', price: 200},
    {name: 'BDSM submissive (light)', price: 200},
    {name: 'BDSM dominant', price: 200},
    {name: 'Golden shower (to him)', price: 200},
    {name: 'Golden shower (to her)', price: 650},
    {name: 'Rimming', price: 100},
    {name: 'Facefucking', price: 200},
    {name: 'CIM', price: 100},
    {name: 'COF', price: 100},
    {name: 'CIM + Swallow', price: 200},
    {name: 'MWW — duo with another girl (without girl-girl play)', price: 100},
    {name: 'MWW — duo with another girl (with girl-girl play)', price: 200},
    {name: 'Couples', price: 200},
    {name: 'Swap partner', price: 200},
    {name: 'DP (vaginal + anal at once)', price: 400},
  ],
  incallRates: [
    {label: '1 Hour', price: 650},
    {label: '2 Hours', price: 750},
    {label: '4 Hours', price: 1175},
    {label: '6 Hours', price: 1600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 650},
    {label: '2 Hours', price: 750},
    {label: '4 Hours', price: 1175},
    {label: '6 Hours', price: 1600},
  ],
  description: [
    "South is a captivating blend of gentle softness and fiery passion, a woman whose presence is felt the moment she enters a room. With deep brown eyes and rich brunette hair, she carries an intense, magnetic femininity that feels both warm and electrifying. Her curves and confident posture reflect a woman who knows her power and enjoys expressing it with natural grace.",
    "Open-minded and full of vibrant energy, South lives with a true party spirit balanced by a soulful depth. She loves to dance, to travel, to lose herself in movement and music, and to explore the wisdom of ancient cultures. Yoga keeps her centered, while her adventurous heart constantly seeks new sensations, places, and emotions. She is the kind of woman who inspires freedom, laughter, and unforgettable moments.",
    "With her Russian-Ukrainian roots, South embodies a unique mix of strength and sensitivity. Tattoos and daring piercings underline her bold character, while her gentle side reveals warmth and emotional connection. She is passionate yet caring, playful yet thoughtful — a woman who turns every encounter into an experience and every moment into a memory.",
    "Outcall bookings additionally include the taxi fare. An MMW booking (two men, one woman) is charged at double the standard rate — open to discussion.",
  ],
  reviews: [],
};

const AMINA_DATA = {
  id: 9954, real: true, vip: true, folder: 'vip-models/Amina', slug: 'amina',
  name: 'Amina', age: 25, height: 165, weight: 62,
  nationality: 'Moroccan', city: 'Dubai',
  languages: 'French · Arabic · English',
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'AM',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const SELENA_DATA = {
  id: 9953, real: true, vip: true, folder: 'vip-models/Selena', slug: 'selena',
  name: 'Selena', age: 22, height: 172, weight: 47,
  clothingSize: '6', breastSize: 'C', breastType: 'Natural',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  nationality: 'Ukrainian', city: 'Dubai',
  languages: 'English · Russian · Ukrainian',
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'SE',
  cats: ['new'],
  // CIM/CIF were quoted at £0 — folded into the plain "included" services
  // list instead of a priced extras list that would show "+£0".
  svcs: ['69', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWC', 'OWO', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Uniforms', 'CIM', 'CIF'],
  extraSvcs: [],
  incallRates: [{label: '1 Hour', price: 1300}],
  outcallRates: [{label: '1 Hour', price: 1300}],
  description: [
    "Selena carries a quiet, irresistible charm—graceful, effortless, and deeply feminine. Her slender silhouette and naturally beautiful curves give her presence a delicate allure, while her warm brown eyes reveal both confidence and softness. With her gentle smile and calm demeanor, she draws attention without ever trying, leaving an impression that lingers long after she enters a room.",
    "Her long brown hair frames her face like a whisper, enhancing her natural radiance and timeless beauty. Selena moves with the poise of someone who understands her own elegance—light, fluid, almost ethereal. Every detail about her, from her natural C-cup curves to her slender frame, speaks of authenticity and understated sensuality.",
    "Ukrainian by origin, Selena brings a blend of warmth, sincerity, and feminine mystery to every moment. She embodies a rare kind of romance—gentle yet captivating, serene yet unforgettable. Being around her feels like a soft exhale, a quiet escape into something tender, beautiful, and effortlessly enchanting.",
  ],
  reviews: [],
};

const MAURA_DATA = {
  id: 9952, real: true, vip: true, folder: 'vip-models/Maura', slug: 'maura',
  name: 'Maura', height: 175, weight: 55,
  eyeColor: 'Green', breastType: 'Natural',
  nationality: 'Brazilian/German', city: 'London',
  languages: 'English',
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'MA',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const ALINA_DATA = {
  id: 9951, real: true, vip: true, folder: 'vip-models/Alina', slug: 'alina',
  name: 'Alina', height: 177,
  measurements: '88-64-92', eyeColor: 'Green/Grey', hairColor: 'Blonde', breastType: 'Natural',
  city: 'London',
  languages: 'English · French',
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'AL',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "Winner of a beauty pageant, Alina has appeared on magazine covers and in the pages of Vogue, and has walked the runway at Fashion Week as a professional model.",
  ],
  reviews: [],
};

const GRACE_DATA = {
  id: 9950, real: true, vip: true, folder: 'vip-models/Grace', slug: 'grace',
  name: 'Grace', age: 28, height: 165, weight: 49,
  clothingSize: '6', breastSize: '5DD', breastType: 'Natural',
  eyeColor: 'Dark brown', hairColor: 'Dark brunette', orientation: 'Heterosexual',
  nationality: 'Dominican Republic', city: 'Ibiza',
  languages: 'English · Spanish · German',
  color: ['rgba(200,150,60,0.4)', 'rgba(140,90,20,0.7)'],
  initials: 'GR',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const KOA_DATA = {
  id: 9949, real: true, vip: true, folder: 'vip-models/Koa', slug: 'koa',
  name: 'Koa', age: 24, height: 170, weight: 50,
  clothingSize: '4', breastSize: '75B',
  eyeColor: 'Brown', hairColor: 'Brown', orientation: 'Heterosexual',
  nationality: 'Russian', station: "Earl's Court", city: 'London',
  languages: 'English',
  color: ['rgba(90,140,200,0.4)', 'rgba(30,80,150,0.7)'],
  initials: 'KO',
  cats: ['new'],
  svcs: ['69', 'FK', 'DFK', 'GFE', 'OWO', 'OWC', 'COB', 'CIF', 'CIM', 'Fingering', 'Face sitting', 'Dirty talk', 'Smoking fetish', 'Roleplay', 'Foot fetish', 'Light domination', 'DUO', 'Massage'],
  extraSvcs: [
    {name: 'Swallow (Includes OWO & CIM)', price: 100},
    {name: 'Snowballing', price: 100},
    {name: 'Rimming giving', price: 50},
    {name: 'Filming with mask', price: 100},
    {name: 'Filming without mask', price: 150},
    {name: 'Strap-on', price: 50},
    {name: 'WS giving', price: 50},
    {name: 'WS receiving', price: 100},
    {name: 'Bi DUO', price: 50},
    {name: 'A-Level', price: 100},
    {name: 'DP', price: 100},
    {name: 'Couples', price: 100},
  ],
  incallRates: [
    {label: '30 Min', price: 750},
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1250},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight (9h)', price: 4000},
  ],
  outcallRates: [
    {label: '30 Min', price: 750},
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1250},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight (9h)', price: 4000},
  ],
  description: [],
  reviews: [],
};

const LIVIA_DATA = {
  id: 9948, real: true, vip: true, folder: 'vip-models/Livia', slug: 'livia',
  name: 'Livia', age: 24, height: 172, weight: 55,
  clothingSize: '6-8', breastSize: '34C', breastType: 'Enhanced',
  eyeColor: 'Dark brown', hairColor: 'Black', orientation: 'Bisexual',
  nationality: 'Brazilian', city: 'Dubai',
  languages: 'Portuguese · English · Spanish',
  color: ['rgba(200,80,120,0.4)', 'rgba(140,30,70,0.7)'],
  initials: 'LI',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 630},
    {label: 'Extra Hour', price: 475},
  ],
  outcallRates: [
    {label: '1 Hour', price: 630},
    {label: 'Extra Hour', price: 475},
  ],
  description: [
    "Livia is happy to travel and meet clients across the UK and internationally. In Dubai specifically, she does not meet local Emirati clients, Arab clients who aren't regular or verified customers, Israeli clients, or anyone who uses illicit substances — she screens new clients carefully and may decline a booking that doesn't feel right.",
  ],
  reviews: [],
};

// =================== TOURING MODELS (non-London, real) ===================
// city is each model's current/home base — travelNote (shown on her
// profile, see assets/profile.js) covers the extra cities she's also
// available in. None of these are part of the fixed homepage CITIES list
// (see _build/build.js's FILTER_CITIES), so they never get their own
// homepage city section, but they do show up as filter options on /models/
// once a real model is based there.
const GARUDA_DATA = {
  id: 9979, real: true, vip: false, folder: 'models/Garuda', slug: 'garuda',
  name: 'Garuda', age: 26, height: 167, weight: 56,
  nationality: 'Brazilian', city: 'Marbella',
  travelNote: 'Based in Marbella — also touring London and Dubai',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'],
  initials: 'GA',
  cats: ['new'],
  breastSize: '36B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese · Spanish',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'PSE', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'CIF', price: 70},
    {name: 'CIM (Includes OWO)', price: 80},
    {name: 'Swallow (Includes OWO & CIM)', price: 100},
    {name: 'A-Level', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Garuda is an open-minded, vibrant 26-year-old girl from Brazil, captivating with her youthful energy and alluring presence. She stands confidently with her luscious brunette hair, radiating charm and a sense of adventure. Her natural beauty, warm smile, and friendly demeanor make her truly unforgettable.",
    "Garuda is incredibly approachable, warm, and welcoming. Spending time with her feels natural and effortless, as she creates a comfortable and fun environment wherever she goes. Her playful and lively personality makes every moment enjoyable, and her desirability is undeniable.",
    "Whether you want to spend a hot night in London or hit the party scene, Garuda is the perfect girl to join you. She's the ideal partner to share exciting adventures, dance the night away, and create unforgettable memories together. Her blend of beauty, open-mindedness, and friendliness makes her a memorable choice for those seeking a charming, adventurous, and fun-loving companion.",
  ],
  reviews: [],
};

const CANTU_DATA = {
  id: 9978, real: true, vip: false, folder: 'models/Cantu', slug: 'cantu',
  name: 'Cantu', age: 23, height: 157, weight: 55,
  nationality: 'Brazilian', city: 'Bali',
  travelNote: 'Based in Bali — also touring London and Dubai',
  rateHour: 600, extraHourPrice: 400,
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'CA',
  cats: ['new', 'under25'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWO', 'Rimming giving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Prostate massage', price: 50},
    {name: 'Strap-on', price: 50},
    {name: 'Bi DUO', price: 100},
    {name: 'WS giving', price: 100},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 800},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1400},
    {label: 'Overnight', price: 3000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 800},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1400},
    {label: 'Overnight', price: 3000},
  ],
  description: [
    "Meet Cantu, a fun and bubbly 23-year-old Brazilian girl with a petite body and a killer, curvy backside. She's got natural beauty and a chill, down-to-earth vibe that makes her super easy to be around. Her lively, cheerful personality keeps the good times rolling and makes every moment fun and relaxed.",
    "She's genuinely sweet, with a kind heart and a cool, easy-going attitude. Whether you're into chatting, hanging out, or just kicking back and relaxing, Cantu knows how to make you feel comfortable and at ease. Her natural charm and honest vibe make everything feel real and special—no pretenses, just her being herself.",
    "If you're drawn to her stunning looks, her bubbly energy, or just her genuine warmth, you're in for a good time. She's confident, charming, and super real—perfect for anyone looking for a laid-back, authentic vibe. Spend some time with her and get to know her natural, irresistible charm—you won't regret it.",
  ],
  reviews: [],
};

const GELATO_DATA = {
  id: 9977, real: true, vip: false, folder: 'models/Gelato', slug: 'gelato',
  name: 'Gelato', age: 28, height: 171, weight: 50,
  nationality: 'Lithuanian', city: 'Zurich',
  travelNote: 'Based in Zurich — touring across Europe and the UK',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'GE',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'Russian · English · Italian',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'PSE', 'Rimming giving', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Striptease', 'WS giving'],
  extraSvcs: [
    {name: 'Bi DUO', price: 150},
  ],
  // Outcall only — see hasIncall handling in assets/profile.js, which
  // hides the Incall tab and defaults to Outcall when this is empty.
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Gelato is a beautiful 28-year-old Lithuanian blonde with a naturally slim, sporty figure and an effortlessly elegant presence. Standing at 171 cm and weighing 50 kg, she maintains a toned physique that complements both fashion and lifestyle settings. Her striking blue eyes, silky blonde hair, and fresh natural beauty create a captivating look that is both sophisticated and approachable.",
    "Active, energetic, and confident, Gelato's sporty lifestyle is reflected in her graceful posture and fit physique. She is a non-smoker who takes pride in maintaining a healthy and polished appearance. With natural 34B measurements, a UK size 6 dress size, and no tattoos, she embodies a clean, classic aesthetic. A subtle belly button piercing adds a playful touch to her otherwise refined appearance.",
    "Fluent in Russian, English, and Italian, with basic Spanish and German skills, Gelato is comfortable communicating with people from diverse international backgrounds. Her friendly personality, natural charm, and professional attitude make her a pleasure to be around and leave a lasting impression wherever she goes.",
  ],
  reviews: [],
};

const YOSHI_DATA = {
  id: 9976, real: true, vip: false, folder: 'models/Yoshi', slug: 'yoshi',
  name: 'Yoshi', age: 24, height: 168, weight: 54,
  nationality: 'Brazilian', city: 'Mykonos',
  travelNote: 'Based in Mykonos — touring across Europe',
  rateHour: 650, extraHourPrice: 500,
  color: ['rgba(80,20,150,0.4)', 'rgba(50,10,100,0.7)'],
  initials: 'YO',
  cats: ['new', 'under25'],
  breastSize: '32D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Black', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'Fisting receiving', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'Strap-on', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 650},
    {label: '90 Min', price: 900},
    {label: '2 Hours', price: 1150},
    {label: '3 Hours', price: 1650},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 650},
    {label: '90 Min', price: 900},
    {label: '2 Hours', price: 1150},
    {label: '3 Hours', price: 1650},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Yoshi is a striking 24-year-old Brazilian beauty with an exotic allure that turns heads instantly. With her sleek black hair and deep black eyes, she carries a mysterious charm that gives her a subtle Asian-inspired elegance. Standing at 168 cm with a beautifully balanced figure, she blends softness and confidence in a way that feels effortlessly captivating.",
    "Her enhanced 32D curves complement her feminine silhouette, while a small tattoo adds a hint of personality and intrigue. Yoshi's presence is calm yet magnetic — she doesn't need to speak loudly to command attention. There is something quietly powerful about her gaze, something that lingers long after the first glance.",
    "Refined, discreet, and selective, Yoshi offers an intimate, elegant experience with the same privacy and comfort clients expect from Paradise Models. Her Brazilian warmth combined with her unique, exotic appearance creates an experience that feels intimate, elegant, and unforgettable.",
  ],
  reviews: [],
};

const MEILYN_DATA = {
  id: 9975, real: true, vip: false, folder: 'models/Meilyn', slug: 'meilyn',
  name: 'Meilyn', age: 28, height: 164, weight: 52,
  nationality: 'Chinese', city: 'Shanghai',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'ME',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Chinese',
  // No services list was provided for Meilyn — the "Services Included"
  // panel is hidden automatically on her profile when svcs is empty.
  svcs: [],
  extraSvcs: [
    {name: 'COB', price: 50},
    {name: 'DT', price: 50},
    {name: 'CIF', price: 100},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 5500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 800},
    {label: '90 Min', price: 1050},
    {label: '2 Hours', price: 1300},
    {label: '3 Hours', price: 1800},
    {label: 'Overnight', price: 5500},
  ],
  description: [
    "A graceful 28-year-old Chinese beauty, she embodies understated elegance, natural charm, and timeless sophistication. Standing at 164 cm with a beautifully balanced, feminine silhouette, she exudes quiet confidence and effortless grace. Her deep brown eyes and lustrous brunette hair enhance her refined features, creating a look that is both captivating and unforgettable.",
    "With natural beauty, a slender figure, and impeccable style, she represents modern luxury with an air of authenticity. Her tasteful tattoos add a subtle touch of individuality while complementing her polished and sophisticated appearance. Every detail of her presentation reflects elegance, confidence, and impeccable taste.",
    "Fluent in both Chinese and English, she is comfortable engaging with an international clientele and is admired for her warmth, intelligence, and genuine personality. Poised, attentive, and effortlessly charming, she offers a refined presence that blends sophistication with approachable femininity, leaving a lasting impression wherever she goes.",
  ],
  reviews: [],
};

const TAVRIA_DATA = {
  id: 9974, real: true, vip: false, folder: 'models/Tavria', slug: 'tavria',
  name: 'Tavria', age: 21, height: 168, weight: 50,
  nationality: 'Ukrainian', station: 'Mansion House', city: 'London',
  travelNote: 'Available to travel across Europe',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'TA',
  cats: ['new', 'under25'],
  breastSize: '32A', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Light Brown', orientation: 'Bisexual',
  languages: 'English · Russian · Ukrainian',
  svcs: ['69', 'COB', 'DFK', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'MMF for double price', 'OWO', 'Party girl', 'Spanking giving'],
  extraSvcs: [
    {name: 'CIF', price: 80},
    {name: 'CIM (Includes OWO)', price: 80},
    {name: 'Swallow (Includes CIM & OWO)', price: 100},
    {name: 'Snowballing (Includes OWO & CIM)', price: 100},
    {name: 'Bi DUO', price: 200},
    {name: 'Couples', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Tavria is a delicate fusion of innocence and hidden fire — a young Ukrainian beauty with light-brown hair and clear blue eyes that seem to glow with quiet emotion. Her natural elegance feels effortless, like a soft melody that lingers in the air. There is something poetic about her presence, a gentle mystery that invites you to look closer and discover what lies beneath her calm exterior.",
    "She moves with subtle grace, her femininity expressed in the smallest gestures — a glance, a smile, a pause in her step. Tavria's energy is tender yet expressive, blending softness with a daring edge. Her tattoo and piercing hint at a deeper story, a soul that is not afraid to feel, explore, and live beyond the ordinary.",
    "Rooted in Ukrainian spirit, Tavria carries both warmth and resilience in her heart. She creates an atmosphere of intimacy and comfort, where moments feel more meaningful and time slows down. With her natural beauty and romantic aura, she leaves behind not just an image, but an emotion — one that stays long after she's gone.",
  ],
  reviews: [],
};

const LUMONA_DATA = {
  id: 9968, real: true, vip: false, folder: 'models/Lumona', slug: 'lumona',
  name: 'Lumona', age: 23, height: 170, weight: 50,
  nationality: 'Brazilian', city: 'Valletta',
  travelNote: 'Available to travel across Europe',
  rateHour: 850,
  color: ['rgba(160,180,70,0.4)', 'rgba(100,120,30,0.7)'],
  initials: 'LU',
  cats: ['new', 'under25'],
  breastType: 'Natural',
  languages: 'Portuguese · Spanish · English',
  svcs: [],
  extraSvcs: [],
  incallRates: [{label: '1 Hour', price: 850}],
  outcallRates: [{label: '1 Hour', price: 850}],
  description: [
    "All-natural body and hair. Fluent in Portuguese and Spanish, with intermediate (B2) English.",
  ],
  reviews: [],
};

const EUPHORIA_DATA = {
  id: 9966, real: true, vip: false, folder: 'models/Euphoria', slug: 'euphoria',
  name: 'Euphoria', age: 25, height: 175, weight: 60,
  measurements: '90-60-90', eyeColor: 'Blue',
  nationality: 'Romanian', city: 'Dubai',
  travelNote: 'Based in Dubai — also available to travel across the USA, Europe and beyond',
  color: ['rgba(200,180,150,0.4)', 'rgba(130,110,80,0.7)'],
  initials: 'EU',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "A well-known influencer, admired online and in person.",
  ],
  reviews: [],
};

const CAMDICE_DATA = {
  id: 9960, real: true, vip: false, folder: 'models/Camdice', slug: 'camdice',
  name: 'Camdice', age: 21, height: 174, weight: 58,
  nationality: 'Brazilian', city: 'Mykonos',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(155,89,208,0.4)', 'rgba(100,40,160,0.7)'],
  initials: 'CA',
  cats: ['new', 'under25'],
  breastSize: '34C', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Heterosexual',
  languages: 'English · Portuguese · Spanish',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'DT', 'Erotic massage', 'Toys', 'Fisting receiving', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease', 'Tie and Tease', 'Uniforms'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Smoking fetish', price: 50},
    {name: 'A-Level', price: 300},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Discover the stunning Camdice, a 22-year-old Brazilian model with a perfect natural body and radiant blonde beauty. Her irresistible charm and confident presence make her the ultimate choice for unforgettable experiences. As a high-class escort, Camdice offers an elite service marked by elegance, sophistication, and genuine allure, ensuring every encounter is both exciting and authentic.",
    "Known as the best roleplay escort in London, Camdice excels at creating immersive and memorable scenarios that cater to your desires. Whether you're seeking a playful partner for a night out, intimate moments, or a fun roleplay session, she is open-minded and adapts effortlessly to your fantasies. Her versatile and easy-going nature makes every moment enjoyable and stress-free.",
    "Camdice is all about providing a relaxed and enjoyable experience in a friendly, party-like atmosphere. She's approachable, open-minded, and eager to make your time together truly special. Book now to indulge in her captivating beauty and charismatic personality for an experience you won't forget.",
  ],
  reviews: [],
};

const ZOMELA_DATA = {
  id: 9959, real: true, vip: false, folder: 'models/Zomela', slug: 'zomela',
  name: 'Zomela', age: 22, height: 162, weight: 48,
  nationality: 'Brazilian', city: 'Barcelona',
  rateHour: 400, extraHourPrice: 300,
  color: ['rgba(200,160,60,0.4)', 'rgba(130,95,20,0.7)'],
  initials: 'ZO',
  cats: ['new', 'under25'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Portuguese · Spanish · French',
  svcs: ['69', 'CIF', 'CIM', 'COB', 'DFK', 'DT', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'GFE', 'Massage', 'OWO', 'Party girl', 'Rimming giving', 'WS giving'],
  extraSvcs: [
    {name: 'COB', price: 50},
    {name: 'CIF', price: 50},
    {name: 'CIM (Includes OWO)', price: 50},
    {name: 'DT', price: 50},
    {name: 'Fingering', price: 50},
    {name: 'WS giving', price: 50},
    {name: 'Rimming giving', price: 100},
  ],
  incallRates: [
    {label: '1 Hour', price: 400},
    {label: '90 Min', price: 600},
    {label: '2 Hours', price: 750},
    {label: '3 Hours', price: 1100},
    {label: 'Overnight', price: 2500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 500},
    {label: '90 Min', price: 700},
    {label: '2 Hours', price: 850},
    {label: '3 Hours', price: 1200},
    {label: 'Overnight', price: 2500},
  ],
  description: [
    "Zomela is one of the most beautiful escorts and attracts lots of attention wherever she goes. She is an elite lady with a great sense of humor, wit, and charm.",
    "She is a sensual, open-minded, warm lady who loves traveling, dancing, and indulging people. She is a well-educated, interesting young girl who can keep any conversation going.",
    "When you meet Zomela apart from her amazing body and flawless face you will notice what a great personality she has. Undoubtedly, one of the most beautiful escorts inside and out you have ever met. Book her now and let yourself forget about everything and have the best time of your life.",
  ],
  reviews: [],
};

const KARMELITA_DATA = {
  id: 9958, real: true, vip: false, folder: 'models/Karmelita', slug: 'karmelita',
  name: 'Karmelita', age: 25, height: 162, weight: 50,
  nationality: 'Brazilian', city: 'Dubai',
  rateHour: 400, extraHourPrice: 350,
  color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'],
  initials: 'KA',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Hazel', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: [],
  extraSvcs: [
    {name: 'CIM (Includes OWO)', price: 50},
    {name: 'Rimming giving', price: 50},
    {name: 'Couples', price: 100},
    {name: 'Bi DUO', price: 100},
    {name: 'Filming with mask', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 400},
    {label: '90 Min', price: 600},
    {label: '2 Hours', price: 750},
    {label: '3 Hours', price: 1100},
    {label: 'Overnight', price: 3000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 450},
    {label: '90 Min', price: 650},
    {label: '2 Hours', price: 800},
    {label: '3 Hours', price: 1150},
    {label: 'Overnight', price: 3000},
  ],
  description: [
    "<strong>A captivating new presence</strong>, Karmelita is a 25-year-old Brazilian beauty who brings a vibrant, utterly fresh energy to the elite scene. With her cascading long brown hair, deeply expressive hazel eyes, and a stunning, naturally curvaceous silhouette, she effortlessly commands attention while maintaining a warm, approachable grace. As a brand-new face, she represents a flawless blend of youthful vitality and sophisticated allure, making her an instant standout for those who appreciate authentic, natural beauty.",
    "<strong>Exceedingly open-minded and worldly</strong>, Karmelita possesses a bright, intuitive social intelligence that perfectly complements her striking aesthetic. She approaches new experiences with an authentic, unpretentious enthusiasm, making her an exceptional conversationalist who connects easily on a variety of topics. Whether sharing an intimate, high-end dinner or exploring the dynamic nightlife of a global metropolis, her fluid charm and genuine warmth ensure that every moment feels entirely effortless and engaging.",
    "<strong>Designed for the discerning individual</strong>, her companionship is ideal for those who value both visual elegance and a sparkling, cosmopolitan outlook. Karmelita is perfectly poised for high-profile international travel, exclusive social gatherings, or quiet, private evenings where discretion and luxury are paramount. Her magnetic charm and spontaneous spirit guarantee an unforgettable experience, leaving a refined and lasting impression.",
  ],
  reviews: [],
};

const MERCEDES_DATA = {
  id: 9947, real: true, vip: false, folder: 'models/Mercedes', slug: 'mercedes',
  name: 'Mercedes', age: 26, height: 160, weight: 55,
  nationality: 'French/Moroccan', station: 'Mayfair', city: 'London',
  rateHour: 1250, extraHourPrice: 800,
  color: ['rgba(120,90,180,0.4)', 'rgba(70,40,130,0.7)'],
  initials: 'ME',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · French · Arabic',
  svcs: ['Bi DUO', 'COB', 'Dirty talk', 'DT', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Striptease'],
  extraSvcs: [
    {name: 'DFK', price: 100},
    {name: 'Erotic massage', price: 100},
    {name: 'Rimming giving', price: 150},
    {name: 'CIF', price: 150},
    {name: 'A-Level', price: 300},
  ],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2050},
    {label: '3 Hours', price: 2850},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2050},
    {label: '3 Hours', price: 2850},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    "A captivating Moroccan-French brunette of 26, she effortlessly blends North African warmth with refined Parisian elegance. With rich dark hair, warm olive skin, and a striking, natural hourglass silhouette, her magnetic presence offers an elite experience defined by beauty, charm, and complete discretion. Warm-hearted, open-minded, and genuinely cultured, she excels at crafting tailored, seamless encounters. Whether accompanying distinguished gentlemen to high-profile dinners, galas, and luxury travel, or hosting private, unhurried rendez-vous, her adaptable nature ensures every moment feels comfortable, natural, and highly refined.",
    "Splitting her time between Paris and select international destinations, Mercedes caters to discerning clients who value privacy and world-class companionship. Offering a broad range of bespoke extra services designed around your desires, she is the ultimate choice for an exquisite, memorable escape.",
  ],
  reviews: [],
};

const SAVANNAH_DATA = {
  id: 9946, real: true, vip: false, folder: 'models/Savannah', slug: 'savannah',
  name: 'Savannah', age: 27, height: 157, weight: 57,
  nationality: 'British', city: 'Monaco',
  rateHour: 600, extraHourPrice: 500,
  color: ['rgba(80,170,140,0.4)', 'rgba(30,110,90,0.7)'],
  initials: 'SA',
  cats: ['new'],
  breastSize: '34D', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Light brown', orientation: 'Bisexual',
  languages: 'English',
  svcs: ['69', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Toys', 'Fingering', 'FK', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'PSE', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 750},
    {label: '2 Hours', price: 900},
    {label: '3 Hours', price: 1200},
  ],
  outcallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 800},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1300},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Savannah is the kind of beauty that stops you in your tracks — effortlessly elegant, with striking green eyes that seem to shimmer under any light. Her natural charm is undeniable, framed by soft features and a radiant smile that makes every glance feel electric. There's a confident, sensual energy about her, the kind that feels both refined and dangerously alluring.",
    "With her warm British accent and natural femininity, Savannah creates an atmosphere of ease and intimacy from the first moment. She's sophisticated yet playful, knowing exactly how to make every encounter feel spontaneous and personal. Her energy is magnetic — graceful, unhurried, and utterly captivating.",
    "If you're seeking someone truly exceptional, Savannah is a rare find. Every meeting with her is more than just a moment — it's an experience that stays with you long after she's gone.",
  ],
  reviews: [],
};

const CAPA_DATA = {
  id: 9945, real: true, vip: false, folder: 'models/Capa', slug: 'capa',
  name: 'Capa', age: 26, height: 170, weight: 55,
  nationality: 'Brazilian', station: 'Nine Elms', city: 'London',
  travelNote: 'Also based in Rio de Janeiro',
  rateHour: 600, extraHourPrice: 400,
  color: ['rgba(210,90,60,0.4)', 'rgba(150,40,20,0.7)'],
  initials: 'CA',
  cats: ['new'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Redhead', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: [],
  extraSvcs: [
    {name: 'CIF', price: 100},
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 800},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1400},
    {label: 'Overnight', price: 3000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 600},
    {label: '90 Min', price: 800},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1400},
    {label: 'Overnight', price: 3000},
  ],
  description: [
    "Capa is a striking redhead with a mature, magnetic presence that instantly captivates. Slim and elegant, she carries herself with the kind of confidence only experience can bring. Her fiery hair frames high cheekbones and a knowing smile, while her toned body moves with feline grace and boundless energy. There's a spark in her eyes — playful, daring, and full of promise — that hints at the wild ride she offers behind closed doors.",
    "Capa lives for the thrill, a true party girl who brings high energy, sensuality, and a taste for the unexpected to every encounter. She's a master of massage, using her skilled hands to melt tension and awaken desire. But what truly sets her apart is her legendary OWO — uninhibited, deep, and passionately attentive, she turns it into an art form that leaves you weak, satisfied, and craving more.",
    "Whether you want to let loose, be pampered, or experience the best oral you've ever had, Capa is the one to call. She doesn't just entertain — she electrifies. Let her lead the way into a night you'll never forget.",
  ],
  reviews: [],
};

const COLENIA_DATA = {
  id: 9944, real: true, vip: false, folder: 'models/Colenia', slug: 'colenia',
  name: 'Colenia', age: 23, height: 170, weight: 65,
  nationality: 'Brazilian', station: "Earl's Court", city: 'London',
  travelNote: 'Also based in Capri',
  rateHour: 350, extraHourPrice: 250,
  color: ['rgba(230,190,90,0.4)', 'rgba(170,130,40,0.7)'],
  initials: 'CO',
  cats: ['new'],
  breastSize: '36C', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Italian · Portuguese',
  svcs: [],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'WS giving', price: 50},
    {name: 'WS receiving', price: 50},
    {name: 'Rimming giving', price: 50},
    {name: 'Strap-on', price: 50},
    {name: 'Couples', price: 100},
    {name: 'Filming with mask', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 350},
    {label: '90 Min', price: 500},
    {label: '2 Hours', price: 600},
    {label: '3 Hours', price: 850},
    {label: 'Overnight', price: 2000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 400},
    {label: '90 Min', price: 550},
    {label: '2 Hours', price: 650},
    {label: '3 Hours', price: 900},
    {label: 'Overnight', price: 2000},
  ],
  description: [
    "Colenia is a mesmerizing Brazilian beauty wrapped in soft light and quiet intrigue. Petite and graceful, she moves with the fluidity of someone who is always half a step ahead of your thoughts. Her hair frames a face lit by green eyes that seem to hold secrets—warm, inviting, yet impossible to fully unravel. There's an aura about her that draws you in, even before she speaks.",
    "Her slender, feminine figure carries a natural elegance, with curves that feel subtle yet captivating. Everything about her is gentle but charged with an undercurrent of sensual energy. She has the kind of presence that lingers in a room—soft, confident, and quietly magnetic. One look from her can feel like a whisper against your skin.",
    "With a spirit that embraces both sweetness and boldness, Colenia brings a mysterious allure to every encounter. Her bisexual openness adds layers to her charm, making her both unpredictable and deeply intriguing. She is the woman who slips into your mind long after she's gone—enigmatic, tempting, and unforgettable in a way that feels almost dreamlike.",
  ],
  reviews: [],
};

const IVY_DATA = {
  id: 9943, real: true, vip: false, folder: 'models/Ivy', slug: 'ivy',
  name: 'Ivy', height: 170, weight: 55,
  measurements: '90-63-90', breastSize: '3', breastType: 'Natural',
  city: 'Phuket',
  color: ['rgba(90,180,110,0.4)', 'rgba(30,120,60,0.7)'],
  initials: 'IV',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

// The VIP page's locked teaser grid (see vipTeaserPool in assets/vip.js)
// deliberately never sends a real VIP model's actual cover photo to the
// browser — a CSS blur filter is trivially stripped client-side (dev
// tools), so a "blurred" real photo isn't meaningfully protected. Instead
// teaserImg points at a derivative baked at build time: downsampled to a
// few dozen pixels, then Gaussian-blurred and scaled back up (see the
// generation note in vip-models/README — regenerate with the same recipe
// for any future VIP model). All identifying detail is destroyed before
// the file ever reaches the client, so there's nothing to un-blur even if
// every CSS filter on the page is disabled — only a rough color/shape
// impression survives. These otherwise mirror each VIP model's public
// stats (name/age/nationality/etc.) so the teaser matches our real
// roster, and stay real:false so they render as non-clickable cards.
const VIP_TEASER_MODELS = [
  {
    id: 9985, real: false, vip: false, slug: 'aaliyah-teaser',
    name: 'Aaliyah', age: 25, height: 166, weight: 46,
    nationality: 'Persian/British', station: 'Battersea', city: 'London',
    rateHour: 1600, color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'], initials: 'AA',
    teaserImg: '/vip-models/Aaliyah/teaser-blur.webp',
    cats: [], svcs: ['69', 'Bi DUO', 'Body to body massage'], rating: '4.9', reviews: [],
  },
  {
    id: 9984, real: false, vip: false, slug: 'kendal-teaser',
    name: 'Kendal', age: 22, height: 170, weight: 50,
    nationality: 'Brazilian', station: 'Paddington', city: 'London',
    rateHour: 1600, color: ['rgba(150,110,70,0.4)', 'rgba(90,60,30,0.7)'], initials: 'KE',
    teaserImg: '/vip-models/Kendal/teaser-blur.webp',
    cats: [], svcs: [], rating: '4.9', reviews: [],
  },
  {
    id: 9983, real: false, vip: false, slug: 'alicia-teaser',
    name: 'Alicia', age: 24, height: 178, weight: 50,
    nationality: 'Italian/Brazilian', station: 'Kensington', city: 'London',
    rateHour: 1600, color: ['rgba(140,60,200,0.4)', 'rgba(90,30,140,0.7)'], initials: 'AL',
    teaserImg: '/vip-models/Alicia/teaser-blur.webp',
    cats: [], svcs: ['69', 'FK', 'GFE'], rating: '4.9', reviews: [],
  },
  {
    id: 9982, real: false, vip: false, slug: 'abbey-teaser',
    name: 'Abbey', age: 25, height: 170, weight: 55,
    nationality: 'British', station: 'Soho', city: 'London',
    rateHour: 1600, color: ['rgba(200,180,150,0.4)', 'rgba(130,110,80,0.7)'], initials: 'AB',
    teaserImg: '/vip-models/Abbey/teaser-blur.webp',
    cats: [], svcs: ['Body to body massage', 'CIF', 'COB'], rating: '4.9', reviews: [],
  },
  {
    id: 9981, real: false, vip: false, slug: 'avrora-teaser',
    name: 'Avrora', age: 25, height: 178, weight: 65,
    nationality: 'Russian', city: 'Istanbul',
    rateHour: 700, color: ['rgba(180,60,90,0.4)', 'rgba(110,25,50,0.7)'], initials: 'AV',
    teaserImg: '/vip-models/Avrora/teaser-blur.webp',
    cats: [], svcs: [], rating: '4.9', reviews: [],
  },
];

// London is where the real roster lives now, so the placeholder/generated
// profiles don't need to (and shouldn't) also claim a London presence —
// same now applies to Zurich, since Gelato covers it. Keep the rest for
// the other cities, which still have no real models yet.
// NOTE: VIP_TEASER_MODELS is intentionally NOT included here — it must
// never reach the general catalog/search MODELS list (see its own comment
// above). _build/build.js embeds it as its own separate script variable,
// only on the /vip-models/ page, for vipTeaserPool() in assets/vip.js.
const FAKE_MODELS = generateModels().filter(m => m.city !== 'London' && m.city !== 'Zurich');
const MODELS = [JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, ESMERALDA_DATA, NASTYA_DATA, NADINE_DATA, SOUTH_DATA, AMINA_DATA, SELENA_DATA, MAURA_DATA, ALINA_DATA, GRACE_DATA, KOA_DATA, LIVIA_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, CAMDICE_DATA, ZOMELA_DATA, KARMELITA_DATA, MERCEDES_DATA, SAVANNAH_DATA, CAPA_DATA, COLENIA_DATA, IVY_DATA, ...FAKE_MODELS];

module.exports = { MODELS, JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, ESMERALDA_DATA, NASTYA_DATA, NADINE_DATA, SOUTH_DATA, AMINA_DATA, SELENA_DATA, MAURA_DATA, ALINA_DATA, GRACE_DATA, KOA_DATA, LIVIA_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, CAMDICE_DATA, ZOMELA_DATA, KARMELITA_DATA, MERCEDES_DATA, SAVANNAH_DATA, CAPA_DATA, COLENIA_DATA, IVY_DATA, VIP_TEASER_MODELS, SERVICES, NATIONALITIES, STATIONS, CITIES, NAMES_F };
