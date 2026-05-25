export interface SubCategory {
  slug: string
  label: string
}

export interface BroadCategory {
  key: string
  label: string
  description: string
  subcategories: SubCategory[]
  conditionFilter?: true
}

export const BROAD_CATEGORIES: BroadCategory[] = [
  {
    key: 'all',
    label: 'All products',
    description: 'Our full inventory — new, used, and demo.',
    subcategories: [],
  },
  {
    key: 'turntables',
    label: 'Turntables',
    description: 'Turntables, tonearms, cartridges, phono stages, and record care.',
    subcategories: [
      { slug: 'turntables', label: 'Turntables' },
      { slug: 'tonearms', label: 'Tonearms' },
      { slug: 'cartridges', label: 'Cartridges' },
      { slug: 'phono-preamps', label: 'Phono Preamps' },
      { slug: 'record-care', label: 'Record Care' },
    ],
  },
  {
    key: 'amplifiers',
    label: 'Amplifiers',
    description: 'Integrated amplifiers, preamplifiers, and power amplifiers.',
    subcategories: [
      { slug: 'amplifiers', label: 'Amplifiers' },
      { slug: 'preamplifiers', label: 'Preamplifiers' },
      { slug: 'integrated-recs', label: 'Integrated / Rec\'s' },
    ],
  },
  {
    key: 'speakers',
    label: 'Speakers',
    description: 'Floorstanding and bookshelf loudspeakers, and subwoofers.',
    subcategories: [
      { slug: 'speakers', label: 'Speakers' },
      { slug: 'subs', label: 'Subwoofers' },
    ],
  },
  {
    key: 'headphones',
    label: 'Headphones',
    description: 'Headphones and headphone amplifiers.',
    subcategories: [
      { slug: 'headphones-hp-amps', label: 'Headphones & HP Amps' },
    ],
  },
  {
    key: 'sources',
    label: 'Sources',
    description: 'CD players, DACs, and network streamers.',
    subcategories: [
      { slug: 'cd-players-dacs', label: 'CD Players / DACs' },
      { slug: 'music-streaming-dac', label: 'Music Streaming / DAC' },
    ],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    description: 'Cables, power conditioning, equipment stands, and isolation.',
    subcategories: [
      { slug: 'cables', label: 'Cables' },
      { slug: 'power-conditioning', label: 'Power Conditioning' },
      { slug: 'power-supplies', label: 'Power Supplies' },
      { slug: 'stands-isolation', label: 'Stands & Isolation' },
      { slug: 'accessories', label: 'Accessories' },
    ],
  },
  {
    key: 'used',
    label: 'Used & Demo',
    description: 'Pre-owned and demonstration equipment at reduced prices.',
    subcategories: [],
    conditionFilter: true,
  },
]
