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

const EMMA_DATA = {
  id: 9942, real: true, vip: true, folder: 'vip-models/Emma', slug: 'emma',
  name: 'Emma', age: 27, height: 178, weight: 60,
  clothingSize: '8', breastSize: '34C', breastType: 'Natural',
  eyeColor: 'Blue', hairColor: 'Redhead', orientation: 'Bisexual',
  nationality: 'Latvian', station: 'High Street Kensington', city: 'London',
  languages: 'English · Russian · Latvian',
  color: ['rgba(180,60,140,0.4)', 'rgba(120,20,90,0.7)'],
  initials: 'EM',
  cats: ['new'],
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Domination', 'Erotic massage', 'Couples', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Emma carries an effortless allure—tall, graceful, and striking with her rare combination of fiery red hair and crystal-blue eyes. Her presence feels like a quiet flame: warm, mesmerizing, and impossible to overlook. Whether she enters a room or steps in front of a camera, she radiates a natural confidence shaped by her Latvian charm and her own unmistakable sense of individuality.",
    "Her beauty is entirely natural, highlighted by soft lines, long legs, and a poised silhouette that moves with calm assurance. At 178 cm, she carries herself like someone born to be admired, yet there is a subtle elegance in the way she holds back, leaving just enough mystery in her smile and her eyes. She is both classic and modern at once—refined, fresh, and effortlessly captivating.",
    "Behind her serene look lies a playful and open-minded spirit. Emma's bisexual orientation adds depth to her free-flowing, genuine nature; she connects with people through emotion, atmosphere, and authenticity. She is a woman who loves beauty, movement, and meaningful energy—someone who leaves a quiet, lasting impression wherever she goes.",
  ],
  reviews: [],
};

const HELENA_DATA = {
  id: 9938, real: true, vip: true, folder: 'vip-models/Helena', slug: 'helena',
  name: 'Helena', age: 27, height: 177, weight: 54,
  clothingSize: '8', breastSize: '34C', breastType: 'Natural',
  eyeColor: 'Green', hairColor: 'Brown', orientation: 'Heterosexual',
  nationality: 'Ukrainian', city: 'London',
  languages: 'English · Russian · Ukrainian',
  color: ['rgba(90,150,120,0.4)', 'rgba(30,90,60,0.7)'],
  initials: 'HE',
  cats: ['new'],
  svcs: ['GFE', 'OWC', 'OWO'],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1500},
    {label: '90 Min', price: 2100},
    {label: '2 Hours', price: 2500},
    {label: '3 Hours', price: 3500},
    {label: 'Extra Hour', price: 1000},
    {label: 'Overnight', price: 7000},
  ],
  description: [
    "Helena carries an effortless grace, the kind that turns a quiet moment into something unforgettable. Tall and poised, with a slender silhouette and naturally soft curves, she moves with the calm confidence of someone who understands her own allure. Her green eyes hold a quiet depth, warm and inviting, framed by rich brown hair that falls like a gentle whisper over her shoulders.",
    "There is a purity and natural elegance about her — no tattoos, no piercings, nothing to distract from her innate beauty. She embodies refinement without trying, a serene blend of sophistication and softness. Her presence feels both grounding and intriguing, the type of charm that slowly reveals itself the longer she stays near.",
    "Originally from Ukraine, Helena carries a sense of warmth and sincerity that enhances her captivating appearance. She is the kind of woman whose beauty is not just seen but felt — in her calm smile, her genuine nature, and the quiet confidence she radiates. With her natural 34C shape and graceful height, she leaves an impression that lingers delicately, like a memory you're compelled to return to.",
  ],
  reviews: [],
};

const EMILIANA_DATA = {
  id: 9937, real: true, vip: true, folder: 'vip-models/Emiliana', slug: 'emiliana',
  name: 'Emiliana', age: 26, height: 175, weight: 55,
  clothingSize: '6', breastSize: '32D', breastType: 'Enhanced',
  eyeColor: 'Blue', hairColor: 'Brunette', orientation: 'Bisexual',
  nationality: 'British', station: 'Paddington', city: 'London',
  languages: 'English',
  color: ['rgba(80,110,190,0.4)', 'rgba(30,50,140,0.7)'],
  initials: 'EI',
  cats: ['new'],
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Striptease', 'Tie and Tease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'Couples', price: 600},
  ],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1500},
    {label: '2 Hours', price: 2400},
    {label: '3 Hours', price: 3300},
    {label: 'Extra Hour', price: 900},
    {label: 'Overnight', price: 6000},
  ],
  description: [
    "Emiliana carries the kind of refined charm that feels both effortless and unforgettable. Tall and graceful, with a statuesque frame and a composed presence, she moves with the quiet confidence of someone who knows her own elegance. Her blue eyes are striking—cool, clear, and expressive—set in perfect contrast against her rich brunette hair. Every detail about her feels intentional, polished, and naturally captivating.",
    "Her silhouette is slender yet feminine, highlighted by her smooth lines and subtly enhanced curves. Emiliana's look remains completely natural aside from her beautifully shaped silicone breasts; she wears no tattoos or piercings, giving her a clean, classic, timeless beauty. There is a softness in the way she smiles, a poised stillness in the way she listens, and a graceful fluidity in the way she moves—traits that make her presence magnetic without needing to say a word.",
    "Originally from England, Emiliana embodies a blend of sophistication and intriguing duality. Bisexual and open-minded, she exudes a warm, gentle energy paired with a deeper, more mysterious allure beneath the surface. Whether in conversation or quiet company, she brings refinement, intimacy, and a calming confidence that makes every moment with her feel both elevated and quietly unforgettable.",
  ],
  reviews: [],
};

const ZENDAYA_DATA = {
  id: 9936, real: true, vip: true, folder: 'vip-models/Zendaya', slug: 'zendaya',
  name: 'Zendaya', age: 22, height: 170, weight: 52,
  clothingSize: 'XS', breastSize: '32C', breastType: 'Natural',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  nationality: 'Brazilian', station: "Earl's Court", city: 'London',
  languages: 'English · Spanish · Portuguese',
  color: ['rgba(200,150,90,0.4)', 'rgba(140,90,30,0.7)'],
  initials: 'ZE',
  cats: ['new'],
  svcs: ['69', 'Bi DUO', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Spanking giving', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'Couples', price: 750},
  ],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1650},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1650},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    "Zendaya is an exceptional 22-year-old Brazilian beauty whose refined elegance and effortless sophistication make her a true VIP presence. Standing at 170 cm with a graceful silhouette, she captivates with her naturally radiant appearance, warm brown eyes, and rich brown hair. Her timeless style and quiet confidence create an impression of understated luxury that lingers long after the first meeting.",
    "Completely natural, with a beautifully balanced 32C figure and no tattoos or piercings, Zendaya embodies authenticity and classic femininity. Every aspect of her appearance reflects harmony and refinement, from her polished presentation to her poised demeanor. She carries herself with ease and confidence, making every moment in her company feel exclusive and memorable.",
    "Fluent in English, Spanish, and Portuguese, Zendaya effortlessly connects with an international clientele through her warmth, intelligence, and engaging personality. Her Brazilian charm, combined with her elegant presence and cosmopolitan outlook, creates an atmosphere of comfort, sophistication, and genuine connection. Graceful, charismatic, and unforgettable, Zendaya represents the very definition of modern luxury.",
  ],
  reviews: [],
};

const KAMILA_DATA = {
  id: 9935, real: true, vip: true, folder: 'vip-models/Kamila', slug: 'kamila',
  name: 'Kamila', age: 23, height: 175, weight: 53,
  measurements: '91-67-90', breastSize: '3.5', breastType: 'Natural',
  city: 'London',
  color: ['rgba(170,130,200,0.4)', 'rgba(110,70,150,0.7)'],
  initials: 'KM',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const KETANA_DATA = {
  id: 9934, real: true, vip: true, folder: 'vip-models/Ketana', slug: 'ketana',
  name: 'Ketana', age: 23, height: 175, weight: 53,
  clothingSize: '6', breastSize: '34B', breastType: 'Natural',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Bisexual',
  nationality: 'Russian', station: 'Marble Arch', city: 'London',
  languages: 'English · Russian',
  color: ['rgba(200,190,130,0.4)', 'rgba(150,130,60,0.7)'],
  initials: 'KE',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1700},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    "Ketana is a striking 23-year-old Russian beauty whose statuesque elegance and natural sophistication make an unforgettable first impression. Standing at 175 cm with beautifully balanced proportions and a graceful, all-natural figure, she embodies effortless refinement. Her light blonde hair and captivating green eyes create a luminous contrast, giving her an appearance that is both timeless and exceptionally distinctive.",
    "Completely natural, with no tattoos or piercings, Ketana embraces classic femininity in its purest form. Her slender silhouette and polished style reflect understated luxury, while her calm confidence and poised demeanor add depth to her remarkable beauty. Every detail about her presence feels elegant, harmonious, and effortlessly captivating.",
    "Fluent in English and naturally engaging, Ketana combines intelligence with warmth, creating an atmosphere that is relaxed, sophisticated, and genuinely memorable. Her refined charm and graceful personality make every encounter feel exclusive and personal, offering an experience defined by authenticity, elegance, and lasting impression.",
  ],
  reviews: [],
};

const ISA_DATA = {
  id: 9933, real: true, vip: true, folder: 'vip-models/Isa', slug: 'isa',
  name: 'Isa', age: 22, height: 158, weight: 46,
  clothingSize: '4', breastSize: '32B', breastType: 'Natural',
  eyeColor: 'Brown', hairColor: 'Blonde', orientation: 'Bisexual',
  nationality: 'Brazilian', station: 'Knightsbridge', city: 'London',
  languages: 'English · Portuguese',
  color: ['rgba(220,170,190,0.4)', 'rgba(160,90,120,0.7)'],
  initials: 'IS',
  cats: ['new'],
  svcs: ['69', 'A-Level', 'Bi DUO', 'Body to body massage', 'CIF', 'COB', 'DFK', 'Dirty talk', 'Domination', 'Couples', 'Face sitting', 'GFE', 'OWO', 'Party girl', 'Roleplay', 'Tie and Tease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1250},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 2000},
    {label: '3 Hours', price: 2750},
    {label: 'Extra Hour', price: 750},
    {label: 'Overnight', price: 5750},
  ],
  description: [
    "Isa is a 22-year-old escort with a fresh, natural look and a warm, approachable aura. She is petite, standing at 158 cm and weighing just 46 kg, with a delicate figure that adds to her charm, making her truly memorable.",
    "Her natural beauty and genuine personality create an authentic experience that leaves a lasting impression. Isa exudes a sweet, warm vibe that captivates everyone she meets, and her easygoing demeanor makes her easy to connect with. She radiates an irresistible charm that is both captivating and soothing.",
    "Isa is very open-minded and willing to explore a variety of experiences. She provides excellent A-level services and can accommodate a wide range of preferences and desires. Her flexible attitude and genuine enthusiasm ensure that every encounter is enjoyable and memorable for her clients.",
  ],
  reviews: [],
};

const LEENA_DATA = {
  id: 9932, real: true, vip: true, folder: 'vip-models/Leena', slug: 'leena',
  name: 'Leena', age: 22, height: 173, weight: 58,
  clothingSize: '6', breastSize: '34D', breastType: 'Enhanced',
  eyeColor: 'Brown', hairColor: 'Black', orientation: 'Bisexual',
  nationality: 'French', city: 'London',
  languages: 'English · French · Spanish · Chinese',
  color: ['rgba(90,120,190,0.4)', 'rgba(40,60,140,0.7)'],
  initials: 'LE',
  cats: ['new'],
  svcs: ['A-Level', 'Bi DUO', 'GFE', 'Light domination', 'OWO', 'Roleplay'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1100},
    {label: '90 Min', price: 1550},
    {label: '2 Hours', price: 2200},
    {label: '3 Hours', price: 3300},
    {label: 'Extra Hour', price: 1100},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1100},
    {label: '90 Min', price: 1550},
    {label: '2 Hours', price: 2200},
    {label: '3 Hours', price: 3300},
    {label: 'Extra Hour', price: 1100},
    {label: 'Overnight', price: 5000},
  ],
  description: [],
  reviews: [],
};

const RACHEL_DATA = {
  id: 9931, real: true, vip: true, folder: 'vip-models/Rachel', slug: 'rachel',
  name: 'Rachel', age: 30, height: 173, weight: 56,
  clothingSize: '8', breastSize: '36C', breastType: 'Natural',
  eyeColor: 'Blue', hairColor: 'Light brown', orientation: 'Heterosexual',
  nationality: 'Russian', station: 'Sloane Square', city: 'London',
  languages: 'English · Russian',
  color: ['rgba(90,160,190,0.4)', 'rgba(30,100,130,0.7)'],
  initials: 'RA',
  cats: ['new'],
  svcs: ['69', 'A-Level', 'Bi DUO', 'Body to body massage', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'PSE', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Rachel is one of these gorgeous Russian high-class escorts in London, who is equally beautiful on the inside and out. Rachel, a seductive blue-eyed babe, is an expert at keeping the sexual tension high until it threatens to burst. When you are with her, you will feel king of the world. Being able to immediately arouse a strong connection with you is what distinguishes Rachel as being so unique and unforgettable. She exudes a charm that will make you want to submit to her control.",
    "Every interaction with Rachel is electrifying due to her love of flirting and her inherent sexuality. This escort takes excellent care of her appearance, and in addition to having a flawlessly toned body from frequent gym visits, she also has gorgeous skin and shiny hair. One of her best qualities is how much effort she puts into making you feel loved. Your encounter will be filled with laughter, and as your shoulders and jaw relax, you will feel the pressure of daily life lift.",
  ],
  reviews: [],
};

const SOFIA_DATA = {
  id: 9930, real: true, vip: true, folder: 'vip-models/Sofia', slug: 'sofia',
  name: 'Sofia', age: 24, height: 170, weight: 65,
  clothingSize: 'S/M', breastSize: '36D', breastType: 'Enhanced',
  eyeColor: 'Dark brown', hairColor: 'Black', orientation: 'Heterosexual',
  nationality: 'Colombian', city: 'Dubai',
  languages: 'Spanish · English',
  color: ['rgba(200,120,90,0.4)', 'rgba(150,60,30,0.7)'],
  initials: 'SF',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const SILLA_DATA = {
  id: 9929, real: true, vip: true, folder: 'vip-models/Silla', slug: 'silla',
  name: 'Silla', height: 172,
  breastSize: 'C', breastType: 'Natural', eyeColor: 'Green',
  nationality: 'Italian', city: 'Milan',
  color: ['rgba(90,180,160,0.4)', 'rgba(30,120,100,0.7)'],
  initials: 'SI',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "Silla is an elegant, all-natural Italian beauty based in Milan, with a graceful, well-mannered presence. Her green eyes and completely natural figure give her a refined, effortless look. Well educated and softly spoken, she brings a calm, sophisticated energy to every meeting, and is available to travel across Europe.",
  ],
  reviews: [],
};

const LOLA_DATA = {
  id: 9928, real: true, vip: true, folder: 'vip-models/Lola', slug: 'lola',
  name: 'Lola', age: 21, height: 177,
  breastType: 'Natural',
  nationality: 'French', city: 'Paris',
  color: ['rgba(190,90,140,0.4)', 'rgba(130,30,80,0.7)'],
  initials: 'LO',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [],
  reviews: [],
};

const ISABELLA_DATA = {
  id: 9926, real: true, vip: true, folder: 'vip-models/Isabella', slug: 'isabella',
  name: 'Isabella', height: 174, weight: 56,
  hairColor: 'Light brunette', eyeColor: 'Blue', breastType: 'Natural',
  city: 'Ibiza',
  color: ['rgba(120,150,210,0.4)', 'rgba(60,90,160,0.7)'],
  initials: 'IZ',
  cats: ['new'],
  svcs: [],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "Isabella is a sweet, well-read, and empathetic law student based in Ibiza, with an amusing, warm personality and natural sex appeal. She stands 174 cm with a completely natural figure, light brunette hair, and striking blue eyes, and is available to travel across Europe.",
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
  nationality: 'Brazilian', city: 'Rio de Janeiro',
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
  nationality: 'Brazilian', city: 'Capri',
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

const CORESSA_DATA = {
  id: 9941, real: true, vip: false, folder: 'models/Coressa', slug: 'coressa',
  name: 'Coressa', age: 18, height: 170, weight: 51,
  nationality: 'Brazilian', city: 'Florianopolis',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(200,70,50,0.4)', 'rgba(140,30,20,0.7)'],
  initials: 'CR',
  cats: ['new'],
  breastSize: '32A', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Redhead', orientation: 'Heterosexual',
  languages: 'English · Portuguese · Spanish',
  svcs: ['69', 'Body to body massage', 'CIF', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'Prostate massage', price: 50},
    {name: 'CIM (Includes OWO)', price: 100},
    {name: 'Rimming giving', price: 100},
    {name: 'Swallow (Includes OWO & CIM)', price: 200},
    {name: 'Snowballing', price: 200},
    {name: 'A-Level', price: 300},
    {name: 'DP', price: 500},
  ],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Coressa is a striking 18-year-old Brazilian model, bringing with her a vibrant beauty that is impossible to overlook. With her flowing red hair, luminous fair skin, and captivating green eyes, she has a look that feels both rare and effortlessly elegant. Her warm smile and confident presence create an immediate sense of charm that naturally draws people toward her.",
    "Slim and graceful, Coressa embodies a clean, natural beauty that feels refreshing and authentic. Her porcelain skin, fiery red hair, and bright green eyes give her a distinctive and memorable look, while her relaxed confidence highlights her effortless femininity. Very open-minded and curious about the world, she enjoys meeting new people and discovering new experiences.",
    "Perfect company for elegant dinner dates, Coressa is engaging, attentive, and easy to be around. Her open minded spirit is ready to explore and give unforgettable experience. Various of extra services will make every moment unique and unforgettable. With her natural charm, slender figure, and vibrant personality, Coressa leaves a bright and lasting impression wherever she goes.",
  ],
  reviews: [],
};

const RIONA_DATA = {
  id: 9940, real: true, vip: false, folder: 'models/Riona', slug: 'riona',
  name: 'Riona', age: 25, height: 173, weight: 57,
  nationality: 'Ukrainian', station: 'Kensington', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(160,110,190,0.4)', 'rgba(100,50,140,0.7)'],
  initials: 'RI',
  cats: ['new'],
  breastSize: '34D', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Russian · Ukrainian',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'PSE', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'Prostate massage', price: 50},
    {name: 'CIM (Includes OWO)', price: 100},
    {name: 'Rimming giving', price: 100},
    {name: 'Swallow (Includes OWO & CIM)', price: 200},
    {name: 'Snowballing', price: 200},
    {name: 'A-Level', price: 300},
    {name: 'DP', price: 500},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Riona is a Ukrainian escort, and she has all those qualities you would associate with a woman from this part of the world. A hot climate, a hot body, and a hot sexual appetite; that's what you get with Riona! She has been published in magazines like Playboy and L'Officiel.",
    "As one of our high class escorts, Riona creates experiences second to none. From pornstar experiences to getting out the toys, book Riona for a memory that will be unforgettable.",
    "She loves to look after that body of hers in the gym, and she's always getting fancy clothes in order to better show it off. She has a lot of experience — you might have some fun figuring out exactly what that entails!",
  ],
  reviews: [],
};

const SHAE_DATA = {
  id: 9939, real: true, vip: false, folder: 'models/Shae', slug: 'shae',
  name: 'Shae', age: 24, height: 172, weight: 54,
  nationality: 'Brazilian', station: 'Chelsea', city: 'London',
  rateHour: 1000, extraHourPrice: 500,
  color: ['rgba(90,180,150,0.4)', 'rgba(30,120,90,0.7)'],
  initials: 'SH',
  cats: ['new'],
  breastSize: '36C', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Light brown', orientation: 'Bisexual',
  languages: 'English · Portuguese · Spanish',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Group for extra price', "Lady's services", 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Tie and Tease', 'WS giving'],
  extraSvcs: [
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Shae is an elegant Brazilian model with light brown hair and captivating green eyes. Her sophisticated style and confident presence make her the perfect party partner. She exudes charm and grace, ensuring every moment spent with her is memorable and enjoyable.",
    "Open-minded and adventurous, Shae loves exploring new experiences and connecting on a deeper level. Her genuine and friendly nature makes her easy to talk to, creating a relaxed and fun atmosphere. Whether at a social event or private moment, she knows how to make everyone feel special and engaged.",
    "In addition to her elegance and vibrant personality, Shae is also great for long bookings. Her endurance, dedication, and caring attitude ensure that she provides a consistent, enjoyable experience over extended periods. She is the ideal companion for those seeking a memorable, engaging, and lasting connection.",
  ],
  reviews: [],
};

const DEBINI_DATA = {
  id: 9927, real: true, vip: false, folder: 'models/Debini', slug: 'debini',
  name: 'Debini', age: 25, height: 160, weight: 57,
  clothingSize: '8', breastSize: '34C', breastType: 'Enhanced',
  eyeColor: 'Hazel', hairColor: 'Blonde', orientation: 'Heterosexual',
  nationality: 'Brazilian', city: 'Milan',
  rateHour: 500, extraHourPrice: 500,
  languages: 'English · Portuguese',
  color: ['rgba(210,170,80,0.4)', 'rgba(150,110,20,0.7)'],
  initials: 'DE',
  cats: ['new'],
  // Client's 11 named extras have no fixed price ("on request" — manager
  // confirms the cost directly), everything else from the master SERVICES
  // list is included. A null price renders the row without a "+£X" tag
  // or click-to-add behaviour (see buildRealModelHTML/refreshPriceDisplay).
  svcs: SERVICES.filter(s => !['OWO', 'CIM', 'CIF', 'Snowballing', 'WS giving', 'Prostate massage', 'Domination', 'Fisting giving', 'Tie and Tease', 'Filming with mask', 'Strap-on'].includes(s)),
  extraSvcs: [
    {name: 'OWO', price: null},
    {name: 'CIM', price: null},
    {name: 'CIF', price: null},
    {name: 'Snowballing', price: null},
    {name: 'WS giving', price: null},
    {name: 'Prostate massage', price: null},
    {name: 'Domination', price: null},
    {name: 'Fisting giving', price: null},
    {name: 'Tie and Tease', price: null},
    {name: 'Filming with mask', price: null},
    {name: 'Strap-on', price: null},
  ],
  incallRates: [{label: '1 Hour', price: 500}],
  outcallRates: [{label: '1 Hour', price: 500}],
  description: [
    "Debini is a Brazilian beautiful escort who exudes beauty and allure. She has a toned body, brown eyes, and long blonde hair. She is an endlessly imaginative fetish and fantasy escort who is always ready to try new fetishes and fantasies.",
    "Debini will undoubtedly make the occasion memorable that you would want to repeat over and over again. Her flexible nature and hourglass figure make her the perfect partner for trying out novel and exciting positions in the bedroom.",
    "Debini is the ideal option for anyone seeking something genuinely distinctive and memorable. She is enthusiastic, assured, and genuinely enjoys what she does. Experience the best in sensual and fantasy escorting by calling us right away.",
  ],
  reviews: [],
};

const LAUREN_DATA = {
  id: 9925, real: true, vip: false, folder: 'models/Lauren', slug: 'lauren',
  name: 'Lauren', age: 26, height: 173, weight: 53,
  nationality: 'Russian', station: "Earl's Court", city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(90,140,190,0.4)', 'rgba(30,80,140,0.7)'],
  initials: 'LA',
  cats: ['new'],
  breastSize: '34C', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Blue', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Russian',
  svcs: [],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Meet Lauren, a stunning 26-year-old Russian brunette with a delicate and captivating presence. Her amazing blue-grey eyes and natural elegance make her truly stand out. Intelligent and well-educated, she embodies sophistication and class, making her the perfect companion for finer dates and refined occasions. Her graceful demeanor and keen intellect create an atmosphere of aesthetic pleasure and meaningful connection—she truly appreciates interesting chats and stimulating conversations.",
    "Lauren's refined taste and charming personality ensure that every moment spent together is both enjoyable and memorable. She knows how to create a polished, sophisticated experience, blending beauty with brains to leave a lasting impression. Whether you're seeking engaging dialogue, a romantic evening, or an elegant companion, Lauren provides impeccable service tailored to your desires.",
    "For those who value intellect, beauty, and interesting conversations, Lauren is the ideal choice.",
  ],
  reviews: [],
};

const KRETA_DATA = {
  id: 9924, real: true, vip: false, folder: 'models/Kreta', slug: 'kreta',
  name: 'Kreta', age: 24, height: 177, weight: 59,
  nationality: 'Brazilian/Italian', station: 'Chelsea', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(200,150,90,0.4)', 'rgba(140,90,30,0.7)'],
  initials: 'KR',
  cats: ['new'],
  breastSize: '32B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Spanking giving', 'Strap-on', 'Striptease', 'Uniforms', 'WS giving'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Kreta is a stunning 24-year-old beauty with a tall, elegant silhouette and a naturally captivating presence. Standing at 177 cm, she carries herself with effortless confidence, her brunette hair and warm brown eyes creating a soft yet alluring harmony. Her natural figure enhances her refined, authentic look, making her beauty feel both modern and timeless.",
    "With a very small tattoo adding just a hint of individuality, Kreta maintains a clean, polished image that highlights her natural charm. Open-minded and bisexual, she radiates a relaxed confidence and a free-spirited energy, blending sophistication with a subtle, playful edge. She moves with grace, always leaving a quiet but lasting impression.",
    "With Brazilian and Italian roots, Kreta embodies a beautiful mix of passion and elegance. Fluent in Portuguese and English, with intermediate Spanish, she connects easily across cultures. Her presence feels warm, intelligent, and effortlessly engaging — a perfect balance of style, personality, and natural allure.",
  ],
  reviews: [],
};

const CATRINA_DATA = {
  id: 9923, real: true, vip: false, folder: 'models/Catrina', slug: 'catrina',
  name: 'Catrina', age: 23, height: 168, weight: 48,
  nationality: 'Ukrainian', station: 'Paddington', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(180,120,190,0.4)', 'rgba(120,60,140,0.7)'],
  initials: 'CT',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Ukrainian · Russian',
  svcs: ['69', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'WS giving'],
  extraSvcs: [
    {name: 'Bi DUO', price: 100},
  ],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Introducing Catrina, a stunning 23-year-old Ukrainian model renowned for her natural beauty and authentic charm. With her serene and captivating presence, she creates a warm and inviting atmosphere that makes every encounter memorable. Catrina's fresh-faced, effortless elegance and open-minded attitude allow her to connect genuinely with those she interacts with.",
    "Her friendly and professional approach ensures that every session is respectful, discreet, and tailored to your desires. Whether you're seeking engaging conversation or a more adventurous experience, Catrina is dedicated to making your time special. She is attentive to your needs and always strives to provide a satisfying and enjoyable connection.",
    "Catrina offers a range of services designed to meet different preferences, ensuring a thoroughly fulfilling experience. Her genuine personality and commitment to excellence make her the perfect choice for those looking for authenticity and a heartfelt encounter.",
  ],
  reviews: [],
};

const ESMIRA_DATA = {
  id: 9922, real: true, vip: false, folder: 'models/Esmira', slug: 'esmira',
  name: 'Esmira', age: 24, height: 165, weight: 57,
  nationality: 'German', station: 'Brixton', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(150,110,80,0.4)', 'rgba(100,60,30,0.7)'],
  initials: 'EB',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · German',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Group for extra price', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWO', 'Party girl', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'Filming with mask', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "A stunning 24-year-old German beauty, she embodies effortless elegance, confidence, and refined sophistication. Standing at 165 cm with a beautifully feminine silhouette, she captivates with her expressive brown eyes and luxurious brunette hair, creating a timeless and effortlessly glamorous appearance.",
    "Her enhanced curves and polished presentation give her a naturally sophisticated allure, while her completely tattoo- and piercing-free appearance adds to her classic, elegant aesthetic. Poised, confident, and impeccably presented, she carries herself with an understated sense of luxury and feminine grace.",
    "Fluent in both German and English, she is comfortable in international settings and connects effortlessly through her warm, engaging personality. Sophisticated yet approachable, she combines classic German elegance with modern glamour, leaving a memorable impression wherever she goes.",
  ],
  reviews: [],
};

const NEMUNA_DATA = {
  id: 9921, real: true, vip: false, folder: 'models/Nemuna', slug: 'nemuna',
  name: 'Nemuna', age: 18, height: 175, weight: 50,
  nationality: 'Russian', station: "Earl's Court", city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(160,130,100,0.4)', 'rgba(110,80,50,0.7)'],
  initials: 'NE',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Hazel', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Russian',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving'],
  extraSvcs: [
    {name: 'CIM (Includes OWO)', price: 50},
    {name: 'CIF', price: 50},
    {name: 'Bi DUO', price: 50},
    {name: 'WS giving', price: 50},
    {name: 'Couples', price: 100},
  ],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Nemuna has a naturally elegant presence, with soft brunette curls framing her face and warm hazel eyes. Standing tall at 175 cm, she moves with effortless grace and an easy, unhurried confidence.",
    "She brings a gentle, curious energy to every meeting — sincere, attentive, and genuinely present. Every moment with Nemuna feels calm and unrushed, with a warmth that lingers well after you've said goodbye.",
    "If you're looking for a companion who is graceful, warm, and easy to talk to, Nemuna is ready to welcome you.",
  ],
  reviews: [],
};

const SAVAGE_DATA = {
  id: 9920, real: true, vip: false, folder: 'models/Savage', slug: 'savage',
  name: 'Savage', age: 23, height: 177, weight: 56,
  nationality: 'Russian/Ukrainian', station: 'Marylebone', city: 'London',
  rateHour: 1000, extraHourPrice: 500,
  color: ['rgba(190,190,90,0.4)', 'rgba(130,130,30,0.7)'],
  initials: 'SV',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Blonde', orientation: 'Heterosexual',
  languages: 'English · Russian · Ukrainian',
  svcs: ['69', 'CIF', 'CIM', 'COB', 'DFK', 'Dirty talk', 'Erotic massage', 'Face sitting', 'FK', 'Massage', 'OWO', 'Party girl', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Savage — the name alone hints at something untamed, and she lives up to it in the most captivating way. A true Ukrainian fashion model, she exudes runway elegance with every step. Tall, slender, and strikingly poised, her angular cheekbones and piercing gaze speak of editorial glamour and natural intensity. She doesn't just walk into a room—she owns it.",
    "With a background in high fashion, Savage brings a unique blend of refinement and raw magnetism to every encounter. She's sophisticated yet unpredictable, cool yet innately sensual. Her presence is electric—whether in a private setting or an upscale event, she turns moments into memories with a mix of intellect, charm, and subtle seduction. This is not your typical GFE—it's a heightened experience, curated with finesse and instinct.",
    "For those who crave more than beauty—for those drawn to power wrapped in elegance—Savage is the embodiment of modern allure. A true party lover, to turn every moment into pure excitement. One evening with her, and you'll understand: some names aren't given, they're earned.",
  ],
  reviews: [],
};

const ARIELLE_DATA = {
  id: 9919, real: true, vip: false, folder: 'models/Arielle', slug: 'arielle',
  name: 'Arielle', age: 24, height: 170, weight: 47,
  nationality: 'Russian', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(150,120,200,0.4)', 'rgba(90,60,150,0.7)'],
  initials: 'AR',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '4',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Russian',
  svcs: ['69', 'COB', 'DFK', 'Erotic massage', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Massage', 'OWC', 'OWO', 'Soft spanking receiving', 'Spanking giving'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1400},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "A mesmerizing young Russian beauty, she embodies timeless elegance, effortless sophistication, and irresistible femininity. Standing at 170 cm with a graceful, ultra-slim silhouette, she captivates with her refined presence and natural charm. Her expressive brown eyes and lustrous brunette hair create a classic and unforgettable beauty, enhanced by delicate features and impeccable style.",
    "Blessed with natural 34B curves and a slender, feminine figure, she radiates understated luxury and modern glamour. Free from tattoos and always immaculately presented, her look is both sophisticated and effortlessly chic, while subtle piercings add a touch of contemporary allure.",
    "Fluent in both Russian and English, she moves comfortably in international circles with confidence, intelligence, and grace. Warm, attentive, and naturally charismatic, she possesses an enchanting presence that leaves a lasting impression. Elegant yet approachable, she is the epitome of contemporary luxury and refined femininity.",
  ],
  reviews: [],
};

const AVA_DATA = {
  id: 9918, real: true, vip: false, folder: 'models/Ava', slug: 'ava',
  name: 'Ava', age: 26, height: 165, weight: 52,
  nationality: 'Persian', station: 'Chelsea', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(210,140,160,0.4)', 'rgba(150,70,100,0.7)'],
  initials: 'AY',
  cats: ['new'],
  breastSize: '34D', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Farsi',
  svcs: ['69', 'CIM', 'COB', 'Dirty talk', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'Foot fetish', 'GFE', 'Handcuffs', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'CIM', price: 100},
    {name: 'Erotic massage', price: 100},
    {name: 'Tantric massage', price: 100},
    {name: 'OWO', price: 100},
    {name: 'CIM (Includes OWO)', price: 100},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Her beauty is the kind that stops time. Ava is an exotic blend of Latin fire and Persian elegance, with a radiant glow that commands attention in any room she enters. Every detail — from her silk-dark hair to the hypnotic depth of her eyes — speaks of luxury, mystery, and allure. Her graceful poise and sensual aura make her unforgettable from the very first glance.",
    "Ava is a true high-class companion for those who appreciate refinement and intensity in equal measure. Whether you're attending an elite event or indulging in a private escape, she brings sophistication and warmth with effortless charm. Her presence is polished, her style immaculate, and her conversation captivating — the perfect match for a man who values taste and discretion.",
    "Let Ava take you to a world where pleasure meets elegance. She's not just a luxury escort — she's an experience wrapped in silk, spice, and temptation. Ready to make your party fantasy something you can touch, feel, and never forget.",
  ],
  reviews: [],
};

const PAULA_DATA = {
  id: 9917, real: true, vip: false, folder: 'models/Paula', slug: 'paula',
  name: 'Paula', age: 22, height: 170, weight: 50,
  nationality: 'Spanish', station: 'South Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(90,150,190,0.4)', 'rgba(30,90,140,0.7)'],
  initials: 'PA',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', "Lady's services", 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'PSE', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease', 'WS giving', 'WS receiving'],
  extraSvcs: [
    {name: 'CIF', price: 100},
    {name: 'CIM (Includes OWO)', price: 100},
    {name: 'Swallow (Includes CIM & OWO)', price: 100},
    {name: 'Squirting', price: 200},
    {name: 'Couples', price: 200},
    {name: 'Rimming giving', price: 300},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  description: [
    "Paula is a gorgeous 22 year old bisexual Spanish escort in London. She looks absolutely incredible in a bikini and even better when she is wearing her sexy lingerie. Her slim, petite figure, tanned skin, long brunette hair and all natural beauty really make her an unbelievably amazing girl to meet.",
    "Paula is much more than just beauty, which is why she is one of the most popular high class escorts around the world. She is intelligent and offers a huge range of exciting escort services including Swallow, CIM, dinner dates, domination, fetish play, massages, roleplay. Her skill set and professionalism can not be questioned.",
    "To book the services of one of most popular and highly recommended girls, be sure to contact Paradise Models. A true party lover, available 24/7 to turn every moment into pure excitement. Paula is exclusively represented by our agency!",
  ],
  reviews: [],
};

const TALISTA_DATA = {
  id: 9916, real: true, vip: false, folder: 'models/Talista', slug: 'talista',
  name: 'Talista', age: 26, height: 174, weight: 55,
  nationality: 'Russian/Ukrainian', station: 'South Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(160,90,120,0.4)', 'rgba(110,40,70,0.7)'],
  initials: 'TL',
  cats: ['new'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Hazel', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Russian · Ukrainian',
  svcs: ['69', 'Body to body massage', 'DFK', 'DT', 'Dirty talk', 'Erotic massage', 'Face sitting', 'FK', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWO', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Uniforms'],
  extraSvcs: [
    {name: 'COB', price: 50},
    {name: 'Bi DUO', price: 50},
    {name: 'CIF', price: 100},
    {name: 'CIM (Includes OWO)', price: 100},
    {name: 'Couples', price: 100},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  description: [
    "Talista is one of the most beautiful high-class escorts in London, with seductive eyes and a flawless body. It's impossible to resist this drop-dead gorgeous lady, and she will make sure that you won't forget her. With her 34C bust, sparkling eyes, brown hair, and model-like body she will be a stand-out at any social gathering. Talista has a good skillset in holding an interesting conversation and leaving each meeting with a great impression.",
    "If you are looking for an amazing top-class escort in London and want to have the best experience ever, Talista is a perfect choice for that. Schedule a meeting with this stunning and seductive lady today.",
  ],
  reviews: [],
};

const DIAMOND_DATA = {
  id: 9915, real: true, vip: false, folder: 'models/Diamond', slug: 'diamond',
  name: 'Diamond', age: 25, height: 172, weight: 48,
  nationality: 'Russian', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(90,130,190,0.4)', 'rgba(30,70,140,0.7)'],
  initials: 'DI',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '4',
  eyeColor: 'Blue', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Russian',
  svcs: ['69', 'COB', 'DFK', 'Dirty talk', 'Domination', 'Toys', 'Face sitting', 'FK', 'Foot fetish', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Roleplay', 'Soft spanking receiving'],
  extraSvcs: [
    {name: 'CIF', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1600},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "A striking 25-year-old Russian beauty, she embodies timeless elegance and effortless sophistication. Standing at 172 cm with a graceful, ultra-slim silhouette, she exudes refined femininity and natural allure. Her luminous blue eyes and silky light brown hair create a captivating combination, enhancing her delicate features and poised presence.",
    "Blessed with natural beauty and impeccable style, she represents understated luxury and modern glamour. With a flawless, slender figure and a polished, classic appearance free from tattoos and piercings, she possesses an effortlessly chic aesthetic that never goes unnoticed.",
    "Fluent in both English and Russian, she moves with ease in international circles, combining intelligence, charm, and sophistication. Her warm personality, graceful manners, and magnetic presence make every moment in her company truly memorable. Elegant yet approachable, she is the epitome of contemporary luxury and timeless feminine beauty.",
  ],
  reviews: [],
};

const APRILINA_DATA = {
  id: 9914, real: true, vip: false, folder: 'models/Aprilina', slug: 'aprilina',
  name: 'Aprilina', age: 22, height: 174, weight: 52,
  nationality: 'Russian', station: 'Sloane Square', city: 'London',
  rateHour: 1000, extraHourPrice: 500,
  color: ['rgba(110,180,140,0.4)', 'rgba(50,120,80,0.7)'],
  initials: 'AP',
  cats: ['new'],
  breastSize: '32B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Green', hairColor: 'Light brown', orientation: 'Heterosexual',
  languages: 'English · Russian',
  svcs: ['69', 'CIF', 'CIM', 'COB', 'DT', 'Erotic massage', 'Face sitting', 'FK', 'GFE', 'Light domination', 'Massage', 'OWO', 'Party girl', 'PSE', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1250},
    {label: '2 Hours', price: 1500},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Aprilina arrives with a spark that's impossible to ignore — a striking Russian beauty with an effortless glow, the kind that pulls your attention before she even speaks. Her presence feels vivid and magnetic, blending sweet sophistication with a bold, confident allure that makes her instantly unforgettable.",
    "Time with her is all about easy chemistry and natural excitement. She brings an upbeat, vibrant energy, the kind that turns any meeting into something fun, smooth, and effortlessly enjoyable. Elegant yet playful, classy yet thrilling — she knows exactly how to create a mood that feels both luxurious and wonderfully relaxed.",
    "If you're craving a top-tier experience with someone truly special, Aprilina is the one you don't want to miss. Reach out and let this gorgeous Russian stunner show you just how amazing a night can be.",
  ],
  reviews: [],
};

const MATRIX_DATA = {
  id: 9913, real: true, vip: false, folder: 'models/Matrix', slug: 'matrix',
  name: 'Matrix', age: 25, height: 170, weight: 52,
  nationality: 'Brazilian', station: 'Mayfair', city: 'London',
  rateHour: 1000, extraHourPrice: 600,
  color: ['rgba(90,90,90,0.4)', 'rgba(40,40,40,0.7)'],
  initials: 'MX',
  cats: ['new'],
  breastSize: '32B', breastType: 'Natural',
  eyeColor: 'Dark brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'Dirty talk', 'Domination', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Strap-on', 'Striptease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'A-Level', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  outcallRates: [
    {label: '1 Hour', price: 1000},
    {label: '90 Min', price: 1300},
    {label: '2 Hours', price: 1600},
    {label: '3 Hours', price: 2200},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 4600},
  ],
  description: [
    "Matrix is a radiant 25-year-old Brazilian beauty with a naturally elegant charm. Standing at 170 cm with a slender 52 kg figure, she carries herself with effortless grace. Her dark brown eyes and sleek black hair create a striking contrast that highlights her soft yet captivating features.",
    "With natural 32B curves and a fresh, clean look — no tattoos, no piercings, and a non-smoking lifestyle — Matrix embodies pure, understated femininity. Her presence feels warm and inviting, combining confidence with a subtle sensuality. She moves with ease, never trying too hard, simply owning her natural allure.",
    "Heterosexual and open-hearted, Matrix connects easily thanks to her vibrant personality and international spirit. Fluent in English and Spanish, with native Portuguese, she communicates with ease and charm. Her Brazilian energy shines through in her smile, leaving an impression that feels sweet, genuine, and unforgettable.",
  ],
  reviews: [],
};

const BELVA_DATA = {
  id: 9912, real: true, vip: false, folder: 'models/Belva', slug: 'belva',
  name: 'Belva', age: 20, height: 161, weight: 46,
  nationality: 'Brazilian', station: 'South Kensington', city: 'London',
  rateHour: 800, extraHourPrice: 600,
  color: ['rgba(200,90,70,0.4)', 'rgba(140,40,20,0.7)'],
  initials: 'BE',
  cats: ['new'],
  breastSize: '34C', breastType: 'Natural', clothingSize: '4',
  eyeColor: 'Brown', hairColor: 'Redhead', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWC', 'Party girl', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Spanking giving', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'OWO', price: 50},
    {name: 'WS giving', price: 60},
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 800},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1400},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 6000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 800},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1400},
    {label: '3 Hours', price: 2000},
    {label: 'Extra Hour', price: 600},
    {label: 'Overnight', price: 6000},
  ],
  description: [
    "Belva is a 20-year-old redhead dream—petite, all-natural, and irresistibly seductive. Her fiery beauty is matched by an intoxicating energy that's both playful and daring. With every glance and gesture, she pulls you into her world of unspoken temptations and raw, magnetic allure.",
    "With her naturally flawless figure and playful, confident spirit, Belva is the ultimate blend of sweetness and heat. She knows how to make you feel like the only one in the room—present, desired, and completely captivated. Whether it's an intimate escape or a night of indulgent adventure, she adapts with ease and elegance.",
    "Ready to explore the spark that only Belva can ignite? This top-rated redhead muse is in high demand—secure your time with her now for an unforgettable experience filled with fire, finesse, and fantasy. Advance bookings are highly encouraged.",
  ],
  reviews: [],
};

const MALAGA_DATA = {
  id: 9911, real: true, vip: false, folder: 'models/Malaga', slug: 'malaga',
  name: 'Malaga', age: 22, height: 175, weight: 50,
  nationality: 'Brazilian', station: "Earl's Court", city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(120,180,110,0.4)', 'rgba(60,120,50,0.7)'],
  initials: 'MG',
  cats: ['new'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Light brown', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'DFK', 'Toys', 'Face sitting', 'FK', 'GFE', 'Light domination', 'Massage', 'MMF for double price', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'PSE', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Tie and Tease'],
  extraSvcs: [
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4500},
  ],
  description: [
    "Malaga is a striking 22-year-old Brazilian beauty with a tall, elegant silhouette and a naturally captivating presence. Standing at 175 cm with a slim 50 kg figure, she embodies effortless grace and modern femininity. Her light-brown hair and vivid green eyes create a fresh, luminous look that instantly draws attention and leaves a lasting impression.",
    "Her enhanced 34C curves complement her long, refined frame, adding a touch of glamour to her naturally balanced proportions. With no tattoos or piercings, Malaga maintains a clean and polished image that highlights her pure, sophisticated beauty. Open-minded and bisexual, she carries a confident, relaxed energy with a subtle playful edge.",
    "Fluent in Portuguese and English, Malaga connects easily in international settings, bringing warmth and charm into every interaction. Her Brazilian energy, combined with her tall elegance and confident aura, makes her presence unforgettable — a perfect blend of beauty, confidence, and effortless allure.",
  ],
  reviews: [],
};

const ANGELIN_DATA = {
  id: 9910, real: true, vip: false, folder: 'models/Angelin', slug: 'angelin',
  name: 'Angelin', age: 25, height: 171, weight: 55,
  nationality: 'Portuguese', station: 'South Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(180,140,90,0.4)', 'rgba(120,80,30,0.7)'],
  initials: 'AG',
  cats: ['new'],
  breastSize: '34C', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'A-Level', 'Bi DUO', 'COB', 'DFK', 'Dirty talk', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'GFE', 'Lapdancing', 'Massage', 'OWC', 'OWO', 'Party girl', 'Striptease'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Allow yourself to be enchanted by Angelin — a refined brunette with a soft, innocent allure and a deeply seductive edge. With natural grace and luxury in every detail, she brings an elevated touch to every encounter, blending sweetness with sophistication.",
    "As a top-tier companion for distinguished gentlemen, she offers more than a pretty face — she provides a genuine, intimate connection wrapped in elegance and charm. Whether it's an evening out or a private rendezvous, she adapts seamlessly to your desires with poise and authenticity.",
    "Discretion, quality, and chemistry define every moment she shares. She keeps her circle exclusive and her standards high. If you're seeking a luxurious escape with someone who's available 24/7, loves party, and embodies both warmth and temptation, Angelin is just a reservation away.",
  ],
  reviews: [],
};

const WEIZEL_DATA = {
  id: 9909, real: true, vip: false, folder: 'models/Weizel', slug: 'weizel',
  name: 'Weizel', age: 26, height: 163, weight: 50,
  nationality: 'Brazilian', station: 'West Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(210,190,110,0.4)', 'rgba(150,130,40,0.7)'],
  initials: 'WE',
  cats: ['new'],
  breastSize: '32B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWO', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Spanking giving', 'Striptease', 'WS giving'],
  extraSvcs: [
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Weizel is a captivating 26-year-old Brazilian blonde whose delicate beauty and striking blue eyes create an unforgettable first impression. Standing at 163 cm with a graceful 32B natural figure, she combines effortless femininity with a fresh, radiant appearance. Her soft blonde hair and expressive blue eyes give her a luminous charm that feels both elegant and irresistibly alluring.",
    "With her natural silhouette and subtle tattoos adding a touch of individuality, Weizel perfectly balances classic beauty with modern confidence. Her polished appearance and graceful demeanor create an atmosphere that feels relaxed, inviting, and effortlessly sophisticated. Every detail about her reflects authenticity, style, and a naturally magnetic presence.",
    "Fluent in Portuguese and with basic English, Weizel brings warmth and vibrant Brazilian energy to every interaction. Open-minded, engaging, and naturally charismatic, she creates a memorable atmosphere through her beauty and genuine charm. Elegant, distinctive, and full of personality, Weizel offers an experience defined by confidence, femininity, and lasting appeal.",
  ],
  reviews: [],
};

const MEARA_DATA = {
  id: 9908, real: true, vip: false, folder: 'models/Meara', slug: 'meara',
  name: 'Meara', age: 24, height: 167, weight: 56,
  nationality: 'Brazilian', station: 'Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(160,90,60,0.4)', 'rgba(100,50,20,0.7)'],
  initials: 'MR',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English · Spanish · Portuguese · Italian',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Domination', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'PSE', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [
    {name: 'CIF', price: 80},
    {name: 'CIM (Includes OWO)', price: 80},
    {name: 'A-Level', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1050},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 5000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1050},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 5000},
  ],
  description: [
    "Meara is a luxurious Latin beauty with an air of innocence that only enhances her irresistible charm. Her velvety skin, dark flowing hair, and soulful eyes create an enchanting first impression with a quiet seduction that builds slowly, drawing you in. Her elegance is effortless, her curves sculpted to be explored, and her energy radiates a soft, sensual warmth.",
    "Open-minded and delightfully uninhibited, Meara offers an experience tailored to your most refined desires. She welcomes A-level and your boldest fantasies with grace and curiosity. She speaks fluent English, Portuguese, Spanish, and Italian, making her an exquisite companion for international clients. Available 24/7 for unforgettable party or chill time.",
    "For the gentleman who craves both sophistication and surrender, Meara invites you into her world, where every fantasy is given the attention it deserves.",
  ],
  reviews: [],
};

const ELARA_DATA = {
  id: 9907, real: true, vip: false, folder: 'models/Elara', slug: 'elara',
  name: 'Elara', age: 25, height: 167, weight: 52,
  nationality: 'Brazilian', station: 'Marylebone', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(90,170,130,0.4)', 'rgba(30,110,70,0.7)'],
  initials: 'ER',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Green', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'COB', 'DFK', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'PSE', 'Spanking giving'],
  extraSvcs: [
    {name: 'Bi DUO', price: 100},
    {name: 'Couples', price: 100},
    {name: 'A-Level', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3800},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3800},
  ],
  description: [
    "Elara is a breathtaking 25-year-old Brazilian blonde whose radiant beauty and graceful elegance leave an unforgettable impression. Standing at 167 cm with a slender, feminine silhouette and beautifully enhanced curves, she embodies modern sophistication with effortless charm. Her luminous green eyes and silky blonde hair create a striking combination, giving her a naturally glamorous and irresistibly captivating presence.",
    "With no tattoos or piercings, Elara embraces a timeless and polished aesthetic that highlights her refined beauty. Her confident yet graceful demeanor reflects elegance in its purest form, while her warm smile and poised personality make every moment in her company feel relaxed and exclusive. Every detail about her appearance radiates femininity, luxury, and understated sophistication.",
    "A proud Brazilian, Elara brings vibrant warmth and positive energy wherever she goes. Fluent in Portuguese and Spanish, she connects naturally through her engaging personality and open-minded spirit. Beautiful, charismatic, and effortlessly refined, Elara offers an experience defined by elegance, genuine connection, and lasting memories.",
  ],
  reviews: [],
};

const TWILIGHT_DATA = {
  id: 9906, real: true, vip: false, folder: 'models/Twilight', slug: 'twilight',
  name: 'Twilight', age: 23, height: 163,
  nationality: 'Brazilian', station: 'Paddington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(90,90,150,0.4)', 'rgba(40,40,100,0.7)'],
  initials: 'TW',
  cats: ['new'],
  breastSize: '36B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'COB', 'Erotic massage', 'Toys', 'Face sitting', 'FK', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [
    {name: 'DT', price: 50},
    {name: 'Strap-on', price: 50},
    {name: 'CIF', price: 100},
    {name: 'Couples', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Twilight is the best GFE luxury escort you were looking for! She will make your experience unforgettable with her hot personality. Twilight offers a huge variety of services that will make all your wildest dreams come true.",
    "Twilight is a high class model, and we can guarantee you an incredible time together, full of naughtiness.",
    "Book her now before anyone else does!",
  ],
  reviews: [],
};

const SAVANA_DATA = {
  id: 9905, real: true, vip: false, folder: 'models/Savana', slug: 'savana',
  name: 'Savana', age: 27, height: 180, weight: 62,
  nationality: 'Russian', station: 'Victoria', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(90,150,200,0.4)', 'rgba(30,90,150,0.7)'],
  initials: 'SN',
  cats: ['new'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '10',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Russian',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWO', 'Party girl', 'PSE', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Squirting', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'CIF', price: 100},
    {name: 'CIM (Includes OWO)', price: 100},
    {name: 'DT', price: 100},
    {name: 'DP', price: 100},
    {name: 'Bi DUO', price: 100},
    {name: 'WS giving', price: 100},
    {name: 'WS receiving', price: 100},
    {name: 'A-Level', price: 150},
    {name: 'Couples', price: 150},
    {name: 'Rimming giving', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1100},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Savana is a striking 27-year-old Russian beauty whose tall, sculpted silhouette and natural elegance captivate at first glance. Standing 180 cm with a graceful, athletic presence, she combines striking blue eyes and soft blonde hair into a look that is both refined and effortlessly sensual. Confident, versatile, and magnetic, she carries herself with the poise of a true international model.",
    "Her name is well-recognized in the fashion world: Savana is the Best Model of Emirates Fashion Week 2025 and a cover model for Playboy and FHM, achievements that speak to her professionalism, charisma, and natural star quality. She thrives in front of the camera, bringing intensity, sophistication, and emotion to every shoot, whether high fashion, editorial, or lifestyle.",
    "Beyond modeling, Savana leads an active and adventurous life. She loves skiing, sailing, swimming, and kitesurfing, embracing travel, adrenaline, and the freedom of movement. Open-minded, confident, and bisexual, she combines beauty with independence, ambition, and a vibrant, cosmopolitan spirit that makes her unforgettable.",
  ],
  reviews: [],
};

const ALDARI_DATA = {
  id: 9904, real: true, vip: false, folder: 'models/Aldari', slug: 'aldari',
  name: 'Aldari', age: 26, height: 165,
  nationality: 'Russian', station: "Earl's Court", city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(150,190,110,0.4)', 'rgba(90,130,50,0.7)'],
  initials: 'AK',
  cats: ['new'],
  breastSize: '34B', clothingSize: '6',
  eyeColor: 'Green', orientation: 'Heterosexual',
  languages: 'English · Russian',
  svcs: ['69', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'GFE', 'Light domination', 'Massage', 'OWO', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Uniforms'],
  extraSvcs: [],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Welcome to Aldari's profile.",
    "Aldari is a gorgeous high end escort in London. She is 26 years old from Russia. Aldari is currently located in London and is available for a huge selection of elite escort services in the city.",
    "If you still find it hard to accept someone can look as good as Aldari does, take a look at her selfie picture and you can see she looks just as good in person as she does compared to her professional images. Aldari is the type of lady who looks great wearing a long dress as she accompanies you to dinner and looks even better in just her underwear in your hotel room.",
    "If you are obsessed as we are about offering our clientele the chance to meet the beautiful Aldari, contact Paradise Models and we will introduce you to this amazing lady.",
  ],
  reviews: [],
};

const LINDA_DATA = {
  id: 9903, real: true, vip: false, folder: 'models/Linda', slug: 'linda',
  name: 'Linda', height: 183,
  nationality: 'Spanish', city: 'London',
  color: ['rgba(200,90,110,0.4)', 'rgba(140,40,60,0.7)'],
  initials: 'LD',
  cats: ['new'],
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'Dirty talk', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Handcuffs', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Poppers', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease', 'Tie and Tease', 'Uniforms', 'WS giving'],
  extraSvcs: [],
  incallRates: [],
  outcallRates: [],
  description: [
    "With her striking height of 183 cm and unmistakable Spanish flair, Linda is impossible to miss. Elegant yet effortlessly sultry, she turns heads with her confident posture, glowing complexion, and that smoldering gaze that speaks volumes before she even utters a word. Every inch of her exudes sophistication, yet there's a playful sparkle in her eyes that hints at the wild side waiting just beneath the surface.",
    "Linda is degree educated in economics and has professionally modelled in Spain. She is here in London to continue her studies and hopefully break into the real estate business as her career goal.",
    "For dinner dates Linda adores seafood, and Scotts in Mayfair would do just nicely. Linda is the embodiment of high-class indulgence blended with the thrill of a true party girl. She knows how to elevate any encounter, whether it's an upscale soirée or a night out that blurs into sunrise. Her vibe is addictive — a magnetic mix of refined taste and irresistible spontaneity. You'll find her company both thrilling and grounding, with laughter, flirtation, and genuine chemistry flowing naturally.",
    "If you're ready for something out of the ordinary — a woman who brings both top-tier elegance and unapologetic fun — Linda is your perfect match. Time with her is never rushed, always memorable, and undeniably worth repeating.",
  ],
  reviews: [],
};

const AGAVA_DATA = {
  id: 9902, real: true, vip: false, folder: 'models/Agava', slug: 'agava',
  name: 'Agava', age: 24, height: 176, weight: 58,
  nationality: 'Brazilian', station: 'Mayfair', city: 'London',
  color: ['rgba(180,100,150,0.4)', 'rgba(120,40,90,0.7)'],
  initials: 'AZ',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Spanish · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'DT', 'Erotic massage', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'OWO', 'Party girl', 'PSE', 'Roleplay', 'Soft spanking receiving', 'Spanking giving', 'Strap-on', 'Striptease', 'Uniforms'],
  extraSvcs: [
    {name: 'Fisting giving', price: 50},
    {name: 'Bi DUO', price: 100},
    {name: 'WS receiving', price: 100},
    {name: 'Filming with mask', price: 150},
    {name: 'Filming without mask', price: 200},
  ],
  incallRates: [],
  outcallRates: [],
  description: [
    "Agava is a breathtaking 24-year-old Brazilian beauty who radiates confidence and irresistible charm. Tall and striking at 176 cm, with a perfectly sculpted figure and enhanced curves, she moves with a sultry grace that captures every eye in the room. Her rich brunette hair frames a face of flawless allure, while her deep brown eyes hint at passion, mischief, and a world of unspoken temptation.",
    "There's a boldness to Agava — the kind that excites and entices in equal measure. She's playful yet commanding, sweet yet daring, and loves to explore both sides of pleasure with her open, sensual spirit. Her tattoos trace a story of confidence and seduction, each one a glimpse into the wild heart that beats beneath her smooth skin.",
    "Whether you're drawn to her fiery energy or her soft, teasing touch, Agava knows exactly how to make every encounter unforgettable. She's more than a fantasy — she's a living, breathing temptation, ready to awaken your desires and leave you craving more.",
  ],
  reviews: [],
};

const MIKAMI_DATA = {
  id: 9901, real: true, vip: false, folder: 'models/Mikami', slug: 'mikami',
  name: 'Mikami', age: 23, height: 165, weight: 42,
  nationality: 'Brazilian', station: 'Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(210,180,90,0.4)', 'rgba(150,120,30,0.7)'],
  initials: 'MI',
  cats: ['new'],
  breastSize: '32A', breastType: 'Natural', clothingSize: '4',
  eyeColor: 'Brown', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['Body to body massage', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWC', 'OWO', 'Party girl', 'Prostate massage', 'PSE', 'Striptease', 'Tie and Tease'],
  extraSvcs: [
    {name: 'WS giving', price: 100},
    {name: 'WS receiving', price: 100},
    {name: 'Bi DUO', price: 150},
    {name: 'Couples', price: 150},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Mikami is a delicate blend of innocence and quiet magnetism. With her soft blonde hair and warm brown eyes, she carries an effortless charm that draws attention without ever asking for it. There is something gentle in the way she moves, as if she floats through the world with her own quiet rhythm, leaving behind a feeling of lightness and curiosity.",
    "Her presence is calm, yet intriguing. Mikami has a playful, open-minded spirit and a natural warmth that makes people feel instantly comfortable around her. She enjoys simple pleasures, meaningful moments, and the beauty hidden in everyday life. There is a subtle mystery in her smile — the kind that invites you to look a little closer and wonder what stories she holds inside.",
    "Born in Brazil, Mikami brings with her a touch of sun and softness wherever she goes. She is graceful, authentic, and true to herself, embracing her individuality with confidence. Behind her gentle exterior lives a vibrant soul, full of color, emotion, and a quiet passion for life that makes every encounter unforgettable.",
  ],
  reviews: [],
};

const DARISTE_DATA = {
  id: 9900, real: true, vip: false, folder: 'models/Dariste', slug: 'dariste',
  name: 'Dariste', age: 24, height: 160, weight: 50,
  nationality: 'Brazilian', station: 'Mayfair', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(190,110,140,0.4)', 'rgba(130,50,80,0.7)'],
  initials: 'DA',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWO', 'Party girl', 'Prostate massage', 'Rimming receiving', 'Roleplay', 'Soft spanking receiving', 'Spanking giving'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Rimming giving', price: 100},
    {name: 'Bi DUO', price: 100},
    {name: 'A-Level', price: 200},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 4000},
  ],
  description: [
    "Dariste is a sweet and irresistible 24-year-old beauty who knows how to leave a lasting impression. Standing at 160 cm, she carries herself with a natural elegance that's both youthful and alluring. Her soft features, gentle smile, and playful gaze make her feel like a dream you don't want to wake up from. Everything about her — from the way she moves to the way she speaks — radiates charm and warmth.",
    "Beneath that angelic exterior is a deliciously naughty side. Dariste is full of sensual energy and loves to explore desire without hesitation. She thrives on passion and connection, always eager to make every encounter intense and unforgettable. With her, every moment feels spontaneous, fiery, and deeply satisfying.",
    "Whether you're craving soft kisses or wild nights, Dariste is ready to turn your fantasies into reality. Let her sweetness disarm you, then let her fire take over — she's waiting for you in London.",
  ],
  reviews: [],
};

const MEL_DATA = {
  id: 9899, real: true, vip: false, folder: 'models/Mel', slug: 'mel',
  name: 'Mel', age: 29, height: 170, weight: 54,
  nationality: 'British', station: 'Kensington', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(210,190,120,0.4)', 'rgba(150,130,50,0.7)'],
  initials: 'ML',
  cats: ['new'],
  breastSize: '34D', breastType: 'Enhanced', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English',
  svcs: ['69', 'Bi DUO', 'Body to body massage', 'COB', 'DFK', 'Dirty talk', 'DT', 'Erotic massage', 'Couples', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'OWO', 'Party girl', 'PSE', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease', 'WS receiving'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'CIM', price: 50},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Mel is a dazzling British blonde with that unmistakable Playboy charm — sexy, glamorous, and impossible to ignore. At 29, she radiates polished confidence and high-end allure, with curves in all the right places and a smile that's pure seduction. Her look is classic yet bold, the kind that turns heads in five-star lobbies and lingers in your thoughts long after the night ends.",
    "Every encounter with Mel is like stepping into a world where indulgence is the only rule. She's witty, attentive, and deeply sensual, the perfect luxury companion for the man who expects more than just beauty. Whether it's an elite dinner date or an unforgettable night behind closed doors, she brings a mix of elegance and fire that makes every second feel tailored and exclusive.",
    "Anyone wanting services from GFE to PSE, massages to watersports, Mel is a choice that will deliver, exceeding expectations.",
    "Mel isn't just high-class — she defines it. Sophisticated, provocative, party lover, and utterly unforgettable, she's here to make your fantasies feel like your new reality.",
  ],
  reviews: [],
};

const MERCURY_DATA = {
  id: 9898, real: true, vip: false, folder: 'models/Mercury', slug: 'mercury',
  name: 'Mercury', age: 23, height: 188, weight: 62,
  nationality: 'Brazilian', station: 'West Kensington', city: 'London',
  color: ['rgba(150,110,190,0.4)', 'rgba(90,50,140,0.7)'],
  initials: 'MU',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '8',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Toys', 'Face sitting', 'Fingering', 'FK', 'Foot fetish', 'GFE', 'Group for extra price', 'Lapdancing', 'Light domination', 'Massage', 'MMF for double price', 'OWC', 'Poppers', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease', 'Tie and Tease', 'Uniforms', 'WS giving'],
  extraSvcs: [
    {name: 'OWO', price: 50},
    {name: 'CIF', price: 50},
    {name: 'Bi DUO', price: 50},
    {name: 'Rimming giving', price: 50},
    {name: 'Prostate massage', price: 50},
    {name: 'Squirting', price: 50},
    {name: 'Strap-on', price: 100},
    {name: 'Couples', price: 200},
  ],
  incallRates: [],
  outcallRates: [],
  description: [
    "Mercury is a striking 23-year-old Brazilian beauty whose exceptional height and graceful silhouette make her impossible to overlook. Standing at an impressive 188 cm, she possesses a rare statuesque presence that exudes confidence, elegance, and effortless individuality. Her rich brunette hair and warm brown eyes add softness to her distinctive appearance, creating a beautiful balance between strength and femininity.",
    "With her naturally feminine 34B figure and subtle tattoos, Mercury embraces a look that is both authentic and modern. Her extraordinary height gives her a commanding, model-like presence, while her graceful demeanor and natural confidence make her equally captivating on a personal level. Every detail about her reflects originality, sophistication, and a magnetic charm that leaves a lasting impression.",
    "Proud of her Brazilian heritage, Mercury brings warmth and vibrant energy to every interaction. Speaking Portuguese and basic English, she connects through her engaging personality and naturally charismatic spirit. Tall, elegant, and truly distinctive, Mercury offers a presence defined by confidence, beauty, and unforgettable individuality.",
  ],
  reviews: [],
};

const BELLORIA_DATA = {
  id: 9897, real: true, vip: false, folder: 'models/Belloria', slug: 'belloria',
  name: 'Belloria', age: 25, height: 170, weight: 55,
  nationality: 'Ukrainian', station: "Earl's Court", city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(210,200,110,0.4)', 'rgba(150,140,40,0.7)'],
  initials: 'BL',
  cats: ['new'],
  breastSize: '34B', breastType: 'Natural', clothingSize: '6',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English · Ukrainian · Russian',
  svcs: ['69', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'Lapdancing', 'Light domination', 'Massage', 'OWC', 'OWO', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Striptease'],
  extraSvcs: [
    {name: 'CIM (Includes OWO)', price: 100},
  ],
  incallRates: [],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Belloria is the kind of blonde beauty who turns heads the moment she enters the room. Standing at 172 cm with natural elegance and a radiant smile, she embodies the perfect balance of charm and sensuality. Her striking Slavic features reflect both her Ukrainian and Russian heritage, giving her a unique allure that feels irresistible.",
    "At just 25, Belloria is vibrant, confident, and effortlessly captivating. Her presence carries a natural sophistication, while her playful energy keeps every moment exciting. Whether it's a refined evening engagement or a more private encounter, she knows exactly how to make her company feel unforgettable.",
    "Treat yourself to the company of someone truly exceptional. Belloria is here to make your time extraordinary, leaving you with memories as dazzling as her beauty.",
  ],
  reviews: [],
};

const MAINE_DATA = {
  id: 9896, real: true, vip: false, folder: 'models/Maine', slug: 'maine',
  name: 'Maine', age: 27, height: 179, weight: 65,
  nationality: 'Brazilian', station: 'Marylebone', city: 'London',
  rateHour: 750, extraHourPrice: 500,
  color: ['rgba(90,160,150,0.4)', 'rgba(30,100,90,0.7)'],
  initials: 'MN',
  cats: ['new'],
  breastSize: '34C', breastType: 'Enhanced', clothingSize: '10',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Bisexual',
  languages: 'English · Portuguese',
  svcs: ['69', 'Body to body massage', 'COB', 'DFK', 'Erotic massage', 'Face sitting', 'FK', 'Foot fetish', 'GFE', 'Light domination', 'Massage', 'OWC', 'Party girl', 'Poppers', 'Rimming receiving', 'Soft spanking receiving', 'Spanking giving', 'Tie and Tease'],
  extraSvcs: [
    {name: 'OWO', price: 100},
    {name: 'A-Level', price: 100},
    {name: 'Bi DUO', price: 100},
  ],
  incallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '1 Hour', price: 750},
    {label: '90 Min', price: 1000},
    {label: '2 Hours', price: 1250},
    {label: '3 Hours', price: 1750},
    {label: 'Extra Hour', price: 500},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    "Maine is a striking 27-year-old Brazilian beauty with a tall, commanding presence and an effortlessly confident aura. Standing at 179 cm, she carries herself with elegance and strength, her long silhouette and graceful posture making her stand out in any setting. Her brunette hair and warm brown eyes create a rich, inviting look that feels both sophisticated and deeply feminine.",
    "Her enhanced 34C curves complement her statuesque figure, adding softness to her powerful presence. A tasteful tattoo brings a touch of individuality and edge, reflecting her expressive personality. As a non-smoker with a bisexual orientation, Maine embodies a modern, open-minded spirit paired with calm self-assurance.",
    "Fluent in Portuguese and speaking basic English, she connects through genuine warmth and confident energy. Maine's Brazilian charm, combined with her tall elegance and magnetic personality, creates an unforgettable impression — a woman who is both strong and alluring, leaving a lasting sense of confidence and desire.",
  ],
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
const MODELS = [JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, ESMERALDA_DATA, NASTYA_DATA, NADINE_DATA, SOUTH_DATA, AMINA_DATA, SELENA_DATA, MAURA_DATA, ALINA_DATA, GRACE_DATA, KOA_DATA, LIVIA_DATA, EMMA_DATA, HELENA_DATA, EMILIANA_DATA, ZENDAYA_DATA, KAMILA_DATA, KETANA_DATA, ISA_DATA, LEENA_DATA, RACHEL_DATA, SOFIA_DATA, SILLA_DATA, LOLA_DATA, ISABELLA_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, CAMDICE_DATA, ZOMELA_DATA, KARMELITA_DATA, MERCEDES_DATA, SAVANNAH_DATA, CAPA_DATA, COLENIA_DATA, IVY_DATA, CORESSA_DATA, RIONA_DATA, SHAE_DATA, DEBINI_DATA, LAUREN_DATA, KRETA_DATA, CATRINA_DATA, ESMIRA_DATA, NEMUNA_DATA, SAVAGE_DATA, ARIELLE_DATA, AVA_DATA, PAULA_DATA, TALISTA_DATA, DIAMOND_DATA, APRILINA_DATA, MATRIX_DATA, BELVA_DATA, MALAGA_DATA, ANGELIN_DATA, WEIZEL_DATA, MEARA_DATA, ELARA_DATA, TWILIGHT_DATA, SAVANA_DATA, ALDARI_DATA, LINDA_DATA, AGAVA_DATA, MIKAMI_DATA, DARISTE_DATA, MEL_DATA, MERCURY_DATA, BELLORIA_DATA, MAINE_DATA,...FAKE_MODELS];

module.exports = { MODELS, JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, ESMERALDA_DATA, NASTYA_DATA, NADINE_DATA, SOUTH_DATA, AMINA_DATA, SELENA_DATA, MAURA_DATA, ALINA_DATA, GRACE_DATA, KOA_DATA, LIVIA_DATA, EMMA_DATA, HELENA_DATA, EMILIANA_DATA, ZENDAYA_DATA, KAMILA_DATA, KETANA_DATA, ISA_DATA, LEENA_DATA, RACHEL_DATA, SOFIA_DATA, SILLA_DATA, LOLA_DATA, ISABELLA_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, CAMDICE_DATA, ZOMELA_DATA, KARMELITA_DATA, MERCEDES_DATA, SAVANNAH_DATA, CAPA_DATA, COLENIA_DATA, IVY_DATA, CORESSA_DATA, RIONA_DATA, SHAE_DATA, DEBINI_DATA, LAUREN_DATA, KRETA_DATA, CATRINA_DATA, ESMIRA_DATA, NEMUNA_DATA, SAVAGE_DATA, ARIELLE_DATA, AVA_DATA, PAULA_DATA, TALISTA_DATA, DIAMOND_DATA, APRILINA_DATA, MATRIX_DATA, BELVA_DATA, MALAGA_DATA, ANGELIN_DATA, WEIZEL_DATA, MEARA_DATA, ELARA_DATA, TWILIGHT_DATA, SAVANA_DATA, ALDARI_DATA, LINDA_DATA, AGAVA_DATA, MIKAMI_DATA, DARISTE_DATA, MEL_DATA, MERCURY_DATA, BELLORIA_DATA, MAINE_DATA,VIP_TEASER_MODELS, SERVICES, NATIONALITIES, STATIONS, CITIES, NAMES_F };
