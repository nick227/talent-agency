export const CATEGORIES = ['ACTOR','MODEL','DANCER','MUSICIAN','COMEDIAN','VIDEO', 'AUDIO','INFLUENCER','OTHER', 'WRITER'] as const;

export type PerformerCategory = typeof CATEGORIES[number];

export const CATEGORY_OPTIONS: { value: PerformerCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'ACTOR', label: 'Actors' },
  { value: 'MODEL', label: 'Models' },
  { value: 'WRITER', label: 'Writer' },
  { value: 'MUSICIAN', label: 'Musicians' },
  { value: 'COMEDIAN', label: 'Comedians' },
  { value: 'INFLUENCER', label: 'Influencers' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'AUDIO', label: 'Audio' },
  { value: 'OTHER', label: 'Other' },
];

export const CATEGORY_LABEL: Record<PerformerCategory, string> = {
  ACTOR: 'Actor',
  MODEL: 'Model',
  DANCER: 'Dancer',
  MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian',
  VIDEO: 'Video',
  INFLUENCER: 'Influencer',
  OTHER: 'Other',
  WRITER: 'Writer',
  AUDIO: 'Audio',
};

export const PROJECT_TYPES = [
  'Film',
  'TV',
  'Commercial',
  'Fashion',
  'Music Video',
  'Theatre',
  'Brand Partnership',
  'Other',
] as const;

export type ProjectType = typeof PROJECT_TYPES[number];
