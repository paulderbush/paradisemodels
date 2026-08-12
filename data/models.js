// =================== DATA ===================
const SERVICES = ["69","Anal Sex","BDSM","Belly-dance","Bisexual DUO","Blowjob With Condom","Blowjob Without Condom","Body to Body Massage","Couples","Cum In Mouth","Cum On Body","Cum On Face","Deep French Kissing","Deep Throat","Dirty Talk","Domination","Double Penetration","DUO","Erotic Massage","Face Sitting","Fetish","Filming With Mask","Filming Without Mask","Fingering","Fisting Giving","Foot Fetish","French Kissing","Girlfriend Experience","Group For Extra","Handcuffs","Lady's Services","Lap Dancing","Latex Outfit","Leather Outfit","Light Domination","Lomilomi Massage","Massage","MMF For Double Price","Nuru Massage","Open Minded","Party Girl","Peeing On Client","Peeing On Model","Photos With Mask","Poppers","Pornstar Experience","Professional Massage","Prostate Massage","Rimming Gives","Rimming Receives","Roleplay","Sensual Massage","Shower Together","Smoking Fetish","Snowballing","Soft Spanking Receiving","Spanking Giving","Squirting","Strapon","Striptease","Swallow Sperm","Tantric Massage","Tie & Tease","Toys","Uniform","Women Clients"];

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
  svcs: ['69', 'Bisexual DUO', 'Body to Body Massage', 'Cum On Face', 'Cum On Body', 'Deep French Kissing', 'Dirty Talk', 'Domination', 'Deep Throat', 'Erotic Massage', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', 'Latex Outfit', 'Light Domination', 'Massage', 'Blowjob With Condom', 'Blowjob Without Condom', 'Party Girl', 'Roleplay', 'Soft Spanking Receiving', 'Spanking Giving', 'Striptease', 'Tie & Tease', 'Peeing On Client', 'Peeing On Model'],
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
  svcs: ['69', 'Bisexual DUO', 'Body to Body Massage', 'Cum On Face', 'Cum On Body', 'Deep French Kissing', 'Dirty Talk', 'Erotic Massage', 'Couples', 'Toys', 'Face Sitting', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', 'Lap Dancing', 'Massage', 'Blowjob With Condom', 'Prostate Massage', 'Rimming Receives', 'Roleplay', 'Soft Spanking Receiving', 'Striptease'],
  extraSvcs: [
    {name: 'OWO', price: 50},
    {name: 'CIM (Includes OWO)', price: 50},
    {name: 'Swallow', price: 80},
    {name: 'Snowballing', price: 80},
    {name: 'Deep Throat', price: 80},
    {name: 'Tantric Massage', price: 100},
    {name: 'WS Giving', price: 150},
    {name: 'Rimming Giving', price: 150},
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
  svcs: ['69', 'Bisexual DUO', 'Cum On Face', 'Cum In Mouth', 'Cum On Body', 'Deep French Kissing', 'Erotic Massage', 'Toys', 'Face Sitting', 'Filming With Mask', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', 'Massage', 'Blowjob With Condom', 'Blowjob Without Condom', 'Party Girl', 'Pornstar Experience', 'Soft Spanking Receiving', 'Spanking Giving'],
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
  svcs: ['69', 'Bisexual DUO', 'Body to Body Massage', 'Cum On Body', 'Deep French Kissing', 'Dirty Talk', 'Domination', 'Deep Throat', 'Erotic Massage', 'Couples', 'Toys', 'Face Sitting', 'Fingering', 'Fisting Giving', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', 'Handcuffs', 'Lap Dancing', 'Latex Outfit', 'Leather Outfit', 'Light Domination', 'Massage', 'MMF For Double Price', 'Blowjob With Condom', 'Blowjob Without Condom', 'Party Girl', 'Poppers', 'Prostate Massage', 'Pornstar Experience', 'Rimming Gives', 'Rimming Receives', 'Roleplay', 'Soft Spanking Receiving', 'Spanking Giving', 'Squirting', 'Strapon', 'Striptease', 'Tie & Tease', 'Uniform', 'Peeing On Client'],
  extraSvcs: [
    {name: 'CIF', price: 300},
    {name: 'A-Level', price: 500},
    {name: 'Filming Without Mask', price: 2000},
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
  svcs: ['69', 'Body to Body Massage', 'Cum On Face', 'Cum In Mouth', 'Cum On Body', 'Deep French Kissing', 'Dirty Talk', 'Deep Throat', 'Toys', 'Face Sitting', 'Fingering', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', 'Light Domination', 'Massage', 'Party Girl', 'Poppers', 'Pornstar Experience', 'Rimming Receives', 'Roleplay', 'Swallow Sperm', 'Tie & Tease', 'Uniform'],
  extraSvcs: [
    {name: 'Service For Ladies', price: 150},
    {name: 'Couples', price: 200},
    {name: 'Group (Must Be At Least 1 More Girl)', price: 300},
    {name: 'Filming With Mask', price: 500},
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
  svcs: ['69', 'Body to Body Massage', 'Cum On Body', 'Deep French Kissing', 'Dirty Talk', 'Erotic Massage', 'Face Sitting', 'Fingering', 'French Kissing', 'Foot Fetish', 'Girlfriend Experience', "Lady's Services", 'Lap Dancing', 'Light Domination', 'Massage', 'Blowjob Without Condom', 'Pornstar Experience', 'Rimming Receives', 'Soft Spanking Receiving', 'Spanking Giving', 'Striptease', 'Tie & Tease'],
  extraSvcs: [
    {name: 'CIF', price: 50},
    {name: 'Bi Duo', price: 50},
    {name: 'Prostate Massage', price: 50},
    {name: 'Fisting Giving', price: 50},
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

// London is where the real roster lives now, so the placeholder/generated
// profiles don't need to (and shouldn't) also claim a London presence —
// keep them for the other cities, which still have no real models yet.
const FAKE_MODELS = generateModels().filter(m => m.city !== 'London');
const MODELS = [JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, ...FAKE_MODELS];

module.exports = { MODELS, JULIA_DATA, LUISA_DATA, AIRA_DATA, ANASTASIIA_DATA, SKYLAH_DATA, ELDORA_DATA, SERVICES, NATIONALITIES, STATIONS, CITIES, NAMES_F };
