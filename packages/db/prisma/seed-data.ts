/**
 * Seed data — edit this file to change the talent.
 *
 * Photos:  https://picsum.photos/seed/{picsumSeed}/{w}/{h}
 * Videos:  YouTube embed URL  https://www.youtube.com/embed/{videoId}
 *
 * To add a performer: copy any block, change the slug (used as email prefix),
 * fill in stats and media, and re-run `pnpm db:seed`.
 *
 * To add a YouTube video: use type 'video' with the embed URL.
 * Headshot is always portrait (800×1000). Portfolio photos default to 1200×800.
 */

export type SeedPhoto = {
  type: 'photo'
  picsumSeed: string
  width?: number
  height?: number
  caption?: string
}

export type SeedVideo = {
  type: 'video'
  youtubeEmbedUrl: string
  caption?: string
}

export type SeedMedia = SeedPhoto | SeedVideo

export interface SeedArtist {
  slug: string              // email becomes slug@talent.agency
  displayName: string
  category: 'ACTOR' | 'MODEL' | 'DANCER' | 'MUSICIAN' | 'COMEDIAN' | 'HOST' | 'INFLUENCER' | 'OTHER'
  location: string
  bio: string
  age: number
  height: string
  weight?: string
  measurements?: string
  shoeSize?: string
  hairColor: string
  eyeColor: string
  isFeatured?: boolean      // appears in homepage hero slideshow
  headshotSeed: string      // picsum seed for the 800×1000 portrait headshot
  portfolio: SeedMedia[]    // ordered portfolio items
}

// ─── ACTORS ──────────────────────────────────────────────────────────────────

const ACTORS: SeedArtist[] = [
  {
    slug: 'theo',
    displayName: 'Theo Vance',
    category: 'ACTOR',
    location: 'Los Angeles',
    bio: 'Theo is a Los Angeles–based actor whose work spans film, television, and theatre. He trained at the Royal Academy of Dramatic Art and has appeared in critically acclaimed independent productions across three continents.',
    age: 31,
    height: '6\'1"',
    hairColor: 'Black',
    eyeColor: 'Brown',
    isFeatured: true,
    headshotSeed: 'theo-vance-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'theo-vance-1', caption: 'Press shoot — Spring 2024' },
      { type: 'photo', picsumSeed: 'theo-vance-2', caption: 'On set — The Hollow Season 2' },
      { type: 'photo', picsumSeed: 'theo-vance-3' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
        caption: 'Acting showreel — 2024',
      },
    ],
  },
  {
    slug: 'luca',
    displayName: 'Luca Ferraro',
    category: 'ACTOR',
    location: 'Milan',
    bio: 'Luca is a Milan-born actor with roots in Italian neorealist theatre. His screen presence has drawn comparisons to the great character actors of 1970s European cinema. He works primarily in film and high-end television drama.',
    age: 38,
    height: '5\'11"',
    hairColor: 'Dark brown',
    eyeColor: 'Hazel',
    headshotSeed: 'luca-ferraro-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'luca-ferraro-1', caption: 'Cannes 2023' },
      { type: 'photo', picsumSeed: 'luca-ferraro-2', caption: 'Cinecittà Studios — La Notte Bianca' },
      { type: 'photo', picsumSeed: 'luca-ferraro-3' },
    ],
  },
]

// ─── MODELS ──────────────────────────────────────────────────────────────────

const MODELS: SeedArtist[] = [
  {
    slug: 'margaux',
    displayName: 'Margaux Delacroix',
    category: 'MODEL',
    location: 'Paris',
    bio: 'Margaux is a Paris-based model with over a decade of editorial and runway experience. Known for her distinctive presence in luxury fashion, she has fronted campaigns for some of the world\'s most recognised houses.',
    age: 27,
    height: '5\'11"',
    measurements: '33–24–35',
    shoeSize: 'EU 40',
    hairColor: 'Dark brown',
    eyeColor: 'Green',
    isFeatured: true,
    headshotSeed: 'margaux-delacroix-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'margaux-editorial-1', caption: 'Vogue Paris — Automne/Hiver 2023' },
      { type: 'photo', picsumSeed: 'margaux-editorial-2', caption: 'Runway — Couture Week Paris' },
      { type: 'photo', picsumSeed: 'margaux-editorial-3', caption: 'Campaign — Maison Aldric' },
      { type: 'photo', picsumSeed: 'margaux-editorial-4' },
    ],
  },
  {
    slug: 'petra',
    displayName: 'Petra Wohl',
    category: 'MODEL',
    location: 'Berlin',
    bio: 'Petra is a Berlin-based model and visual artist. Her work is defined by an architectural stillness — she brings a sculptor\'s eye to every frame. She divides her time between editorial, fine art, and her own photographic practice.',
    age: 24,
    height: '5\'10"',
    measurements: '32–23–34',
    shoeSize: 'EU 39',
    hairColor: 'Platinum',
    eyeColor: 'Blue',
    headshotSeed: 'petra-wohl-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'petra-wohl-1', caption: 'Dazed Beauty — Berlin Winter' },
      { type: 'photo', picsumSeed: 'petra-wohl-2', caption: 'Self-portrait series, 2024' },
      { type: 'photo', picsumSeed: 'petra-wohl-3', caption: 'Wallpaper* — Architecture Issue' },
      { type: 'photo', picsumSeed: 'petra-wohl-4' },
    ],
  },
]

// ─── DANCERS ─────────────────────────────────────────────────────────────────

const DANCERS: SeedArtist[] = [
  {
    slug: 'ines',
    displayName: 'Inés Nakamura',
    category: 'DANCER',
    location: 'New York',
    bio: 'Inés is a contemporary dancer and choreographer whose movement practice draws on classical ballet, butoh, and West African traditions. She performs internationally with her own company and as a principal with leading contemporary dance organisations.',
    age: 29,
    height: '5\'6"',
    hairColor: 'Black',
    eyeColor: 'Dark brown',
    isFeatured: true,
    headshotSeed: 'ines-nakamura-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'ines-nakamura-1', caption: 'Alvin Ailey American Dance Theater — Revelations' },
      { type: 'photo', picsumSeed: 'ines-nakamura-2', caption: 'Studio rehearsal — Breath/Less' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs',
        caption: 'Performance reel — 2024',
      },
    ],
  },
  {
    slug: 'kiran',
    displayName: 'Kiran Bose',
    category: 'DANCER',
    location: 'Mumbai',
    bio: 'Kiran is a Mumbai-born Bharatanatyam dancer and contemporary choreographer. His cross-disciplinary practice fuses classical Indian movement vocabulary with European contemporary technique, and has been presented at festivals from Edinburgh to Bengaluru.',
    age: 26,
    height: '5\'8"',
    hairColor: 'Black',
    eyeColor: 'Dark brown',
    headshotSeed: 'kiran-bose-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'kiran-bose-1', caption: 'National Centre for the Performing Arts — Confluence' },
      { type: 'photo', picsumSeed: 'kiran-bose-2', caption: 'Edinburgh International Festival 2023' },
      { type: 'photo', picsumSeed: 'kiran-bose-3' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        caption: 'Choreography reel — Confluence',
      },
    ],
  },
]

// ─── MUSICIANS ───────────────────────────────────────────────────────────────

const MUSICIANS: SeedArtist[] = [
  {
    slug: 'rafferty',
    displayName: 'Rafferty Cole',
    category: 'MUSICIAN',
    location: 'London',
    bio: 'Rafferty is a British multi-instrumentalist and producer whose sound defies easy categorisation. Equal parts melancholy and kinetic, his records have been described as "the architecture of feeling" by Pitchfork.',
    age: 26,
    height: '6\'0"',
    hairColor: 'Auburn',
    eyeColor: 'Grey',
    headshotSeed: 'rafferty-cole-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'rafferty-cole-1', caption: 'Press photo — Still/Noise LP, 2024' },
      { type: 'photo', picsumSeed: 'rafferty-cole-2', caption: 'Glastonbury Festival 2023' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        caption: 'Still/Noise — live at the Roundhouse',
      },
    ],
  },
  {
    slug: 'ama',
    displayName: 'Ama Owusu',
    category: 'MUSICIAN',
    location: 'Accra',
    bio: 'Ama is an Accra-based singer, songwriter, and producer whose Afrobeats and neo-soul compositions have crossed the Atlantic since her debut in 2021. Her voice has been compared to a "ceremony in itself" — raw, ceremonial, and fully her own.',
    age: 24,
    height: '5\'5"',
    hairColor: 'Black',
    eyeColor: 'Brown',
    headshotSeed: 'ama-owusu-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'ama-owusu-1', caption: 'Afropunk 2023 — Atlanta' },
      { type: 'photo', picsumSeed: 'ama-owusu-2', caption: 'Studio session — Osu, Accra' },
      { type: 'photo', picsumSeed: 'ama-owusu-3' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8',
        caption: '"Harmattan" — official video',
      },
    ],
  },
]

// ─── COMEDIANS ───────────────────────────────────────────────────────────────

const COMEDIANS: SeedArtist[] = [
  {
    slug: 'jack',
    displayName: 'Jack Malone',
    category: 'COMEDIAN',
    location: 'Dublin',
    bio: 'Jack is a Dublin-born stand-up comic, writer, and actor whose debut hour Quiet Riot won Best Newcomer at the Edinburgh Fringe. His material is deceptively gentle — until it isn\'t. He tours internationally and writes for television.',
    age: 32,
    height: '5\'10"',
    hairColor: 'Red',
    eyeColor: 'Green',
    headshotSeed: 'jack-malone-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'jack-malone-1', caption: 'Edinburgh Fringe 2023 — Pleasance Courtyard' },
      { type: 'photo', picsumSeed: 'jack-malone-2', caption: 'Press shot — Quiet Riot UK tour' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
        caption: 'Quiet Riot — excerpt, Vicar Street Dublin',
      },
    ],
  },
  {
    slug: 'priya',
    displayName: 'Priya Nair',
    category: 'COMEDIAN',
    location: 'London',
    bio: 'Priya is a British-Indian comedian and writer whose sharp, character-driven comedy has earned her spots on BBC Three and Channel 4. Her debut special Controlled Chaos was called "surgically precise and very funny" by The Guardian.',
    age: 29,
    height: '5\'4"',
    hairColor: 'Black',
    eyeColor: 'Brown',
    headshotSeed: 'priya-nair-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'priya-nair-1', caption: 'Soho Theatre, London 2024' },
      { type: 'photo', picsumSeed: 'priya-nair-2', caption: 'Toronto Just For Laughs 2023' },
      { type: 'photo', picsumSeed: 'priya-nair-3' },
    ],
  },
]

// ─── HOSTS ───────────────────────────────────────────────────────────────────

const HOSTS: SeedArtist[] = [
  {
    slug: 'zola',
    displayName: 'Zola Mensah',
    category: 'HOST',
    location: 'Lagos',
    bio: 'Zola is a broadcaster, journalist, and cultural commentator based between Lagos and London. She has presented major live television events, documentary series, and award ceremonies across Europe and West Africa.',
    age: 33,
    height: '5\'8"',
    hairColor: 'Black',
    eyeColor: 'Brown',
    headshotSeed: 'zola-mensah-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'zola-mensah-1', caption: 'Africa Magic Viewers\' Choice Awards 2024' },
      { type: 'photo', picsumSeed: 'zola-mensah-2', caption: 'BBC Africa — Futures series' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0',
        caption: 'Showreel — broadcast 2022–2024',
      },
    ],
  },
  {
    slug: 'caspar',
    displayName: 'Caspar Lindqvist',
    category: 'HOST',
    location: 'Stockholm',
    bio: 'Caspar is a Swedish broadcaster and journalist with two decades of live television experience across Scandinavia, Germany, and the UK. He is known for his forensic interviewing style and ability to hold a room of thousands.',
    age: 44,
    height: '6\'2"',
    hairColor: 'Blonde',
    eyeColor: 'Blue',
    headshotSeed: 'caspar-lindqvist-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'caspar-lindqvist-1', caption: 'Eurovision 2023 — Liverpool' },
      { type: 'photo', picsumSeed: 'caspar-lindqvist-2', caption: 'SVT Agenda — Stockholm Studio' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/hT_nvWreIhg',
        caption: 'Hosting reel — 2024',
      },
    ],
  },
]

// ─── INFLUENCERS ─────────────────────────────────────────────────────────────

const INFLUENCERS: SeedArtist[] = [
  {
    slug: 'sofia',
    displayName: 'Sofía Reyes',
    category: 'INFLUENCER',
    location: 'Mexico City',
    bio: 'Sofía is a Mexico City–based digital creator and creative director whose visual world has attracted collaborations with fashion, beauty, and lifestyle brands across Latin America, Europe, and North America.',
    age: 25,
    height: '5\'5"',
    hairColor: 'Black',
    eyeColor: 'Brown',
    headshotSeed: 'sofia-reyes-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'sofia-reyes-1', caption: 'Zara x Sofía — campaign, 2024' },
      { type: 'photo', picsumSeed: 'sofia-reyes-2', caption: 'Mexico Design Week' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/09R8_2nJtjg',
        caption: 'Creator reel — 2024',
      },
    ],
  },
  {
    slug: 'yuki',
    displayName: 'Yuki Tanaka',
    category: 'INFLUENCER',
    location: 'Tokyo',
    bio: 'Yuki is a Tokyo-based content creator and stylist whose aesthetic — spare, considered, quietly maximalist — has made her one of the most referenced creators in Japanese and Korean fashion circles. She works across photography, video, and editorial.',
    age: 27,
    height: '5\'4"',
    hairColor: 'Black',
    eyeColor: 'Dark brown',
    headshotSeed: 'yuki-tanaka-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'yuki-tanaka-1', caption: 'Issey Miyake collaboration, 2024' },
      { type: 'photo', picsumSeed: 'yuki-tanaka-2', caption: 'Self-portrait — Kyoto series' },
      { type: 'photo', picsumSeed: 'yuki-tanaka-3', caption: 'Tokyo Fashion Week 2024' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/GxBSyx85Kp8',
        caption: 'Style journal — Winter 2024',
      },
    ],
  },
]

// ─── OTHER ───────────────────────────────────────────────────────────────────

const OTHER: SeedArtist[] = [
  {
    slug: 'orion',
    displayName: 'Orion Blake',
    category: 'OTHER',
    location: 'London',
    bio: 'Orion is a performance artist and installation designer whose immersive works have been staged at the Barbican, Tate Modern, and the Venice Biennale. He works at the intersection of the body, architecture, and duration.',
    age: 35,
    height: '6\'0"',
    hairColor: 'Dark brown',
    eyeColor: 'Grey',
    headshotSeed: 'orion-blake-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'orion-blake-1', caption: 'Barbican — Dissolution series, 2023' },
      { type: 'photo', picsumSeed: 'orion-blake-2', caption: 'Venice Biennale 2022 — British Pavilion' },
      { type: 'photo', picsumSeed: 'orion-blake-3', caption: 'Studio, Hackney' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/RgKAFK5djSk',
        caption: 'Dissolution — documentation reel',
      },
    ],
  },
  {
    slug: 'nadia',
    displayName: 'Nadia Rousseau',
    category: 'OTHER',
    location: 'Montreal',
    bio: 'Nadia is a Québécois spoken word artist, poet, and essayist who performs in English and French. Her debut collection Cartographies of Grief was shortlisted for the Griffin Poetry Prize. She is equally at home on a festival stage as on the page.',
    age: 31,
    height: '5\'7"',
    hairColor: 'Dark brown',
    eyeColor: 'Green',
    headshotSeed: 'nadia-rousseau-portrait',
    portfolio: [
      { type: 'photo', picsumSeed: 'nadia-rousseau-1', caption: 'Nuits de la poésie — Montreal 2024' },
      { type: 'photo', picsumSeed: 'nadia-rousseau-2', caption: 'Griffin Poetry Prize ceremony, Toronto' },
      {
        type: 'video',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs',
        caption: '"Still Water" — performed at Place des Arts',
      },
    ],
  },
]

// ─── Full export ─────────────────────────────────────────────────────────────

export const SEED_ARTISTS: SeedArtist[] = [
  ...ACTORS,
  ...MODELS,
  ...DANCERS,
  ...MUSICIANS,
  ...COMEDIANS,
  ...HOSTS,
  ...INFLUENCERS,
  ...OTHER,
]

export const ADMIN_EMAIL = 'admin@talent.agency'
export const ADMIN_PASSWORD = 'admin123'
export const PERFORMER_PASSWORD = 'performer123'
