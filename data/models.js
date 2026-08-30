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
const MODELS = [JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, ...FAKE_MODELS];

module.exports = { MODELS, JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, LUNA_DATA, AALIYAH_DATA, KENDAL_DATA, ALICIA_DATA, ABBEY_DATA, AVRORA_DATA, ANA_DATA, BAYLA_DATA, ADRIANA_DATA, LEYLA_DATA, RUNALDA_DATA, TETIANA_DATA, RAVEN_DATA, MAIAN_DATA, TANIA_DATA, ESTELLE_DATA, GARUDA_DATA, CANTU_DATA, GELATO_DATA, YOSHI_DATA, MEILYN_DATA, TAVRIA_DATA, LUMONA_DATA, EUPHORIA_DATA, VIP_TEASER_MODELS, SERVICES, NATIONALITIES, STATIONS, CITIES, NAMES_F };
