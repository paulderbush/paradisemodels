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

// London is where the real roster lives now, so the placeholder/generated
// profiles don't need to (and shouldn't) also claim a London presence —
// keep them for the other cities, which still have no real models yet.
const FAKE_MODELS = generateModels().filter(m => m.city !== 'London');
const MODELS = [JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, ...FAKE_MODELS];

module.exports = { MODELS, JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, SERVICES, NATIONALITIES, STATIONS, CITIES, NAMES_F };
