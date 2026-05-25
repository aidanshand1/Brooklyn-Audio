#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'))

// ---------------------------------------------------------------------------
// Category definitions — slugs must match lib/categories.ts subcategory slugs
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { _id: 'cat-turntables',         name: 'Turntables',           slug: 'turntables',          sortOrder: 1 },
  { _id: 'cat-tonearms',           name: 'Tonearms',             slug: 'tonearms',             sortOrder: 2 },
  { _id: 'cat-cartridges',         name: 'Cartridges',           slug: 'cartridges',           sortOrder: 3 },
  { _id: 'cat-phono-preamps',      name: 'Phono Preamps',        slug: 'phono-preamps',        sortOrder: 4 },
  { _id: 'cat-amplifiers',         name: 'Amplifiers',           slug: 'amplifiers',           sortOrder: 5 },
  { _id: 'cat-preamplifiers',      name: 'Preamplifiers',        slug: 'preamplifiers',        sortOrder: 6 },
  { _id: 'cat-integrated',         name: "Integrated/Rec's",     slug: 'integrated-recs',      sortOrder: 7 },
  { _id: 'cat-speakers',           name: 'Speakers',             slug: 'speakers',             sortOrder: 8 },
  { _id: 'cat-subs',               name: 'Subs',                 slug: 'subs',                 sortOrder: 9 },
  { _id: 'cat-headphones',         name: 'Headphones/HP Amps',   slug: 'headphones-hp-amps',   sortOrder: 10 },
  { _id: 'cat-cd-dac',             name: "CD Players/DAC's",     slug: 'cd-players-dacs',      sortOrder: 11 },
  { _id: 'cat-streaming',          name: 'Music Streaming/DAC',  slug: 'music-streaming-dac',  sortOrder: 12 },
  { _id: 'cat-cables',             name: 'Cables',               slug: 'cables',               sortOrder: 13 },
  { _id: 'cat-power-conditioning', name: 'Power Conditioning',   slug: 'power-conditioning',   sortOrder: 14 },
  { _id: 'cat-power-supplies',     name: 'Power Supplies',       slug: 'power-supplies',       sortOrder: 15 },
  { _id: 'cat-stands',             name: 'Stands/Isolation',     slug: 'stands-isolation',     sortOrder: 16 },
  { _id: 'cat-record-care',        name: 'Record Care',          slug: 'record-care',          sortOrder: 17 },
  { _id: 'cat-accessories',        name: 'Accessories',          slug: 'accessories',          sortOrder: 18 },
]

// ---------------------------------------------------------------------------
// Folder → brand + category lookup
// ---------------------------------------------------------------------------
const FOLDER_MAP = {
  // Turntables
  'vpi':            { brand: 'VPI',               cat: 'cat-turntables' },
  'clearaudio':     { brand: 'Clearaudio',         cat: 'cat-turntables' },
  'acousticsolid':  { brand: 'Acoustic Solid',     cat: 'cat-turntables' },
  'acoustic solid': { brand: 'Acoustic Solid',     cat: 'cat-turntables' },
  'transrotor':     { brand: 'Transrotor',         cat: 'cat-turntables' },
  'oracle':         { brand: 'Oracle',             cat: 'cat-turntables' },
  'kronos':         { brand: 'Kronos',             cat: 'cat-turntables' },
  'angel':          { brand: 'Angel',              cat: 'cat-turntables' },
  // Tonearms
  'graham':         { brand: 'Graham',             cat: 'cat-tonearms' },
  'origin':         { brand: 'Origin Live',        cat: 'cat-tonearms' },
  '1sorane':        { brand: 'Sorane',             cat: 'cat-tonearms' },
  'triplanar':      { brand: 'TriPlanar',          cat: 'cat-tonearms' },
  'reed':           { brand: 'Reed',               cat: 'cat-tonearms' },
  // Cartridges
  'benz':           { brand: 'Benz Micro',         cat: 'cat-cartridges' },
  'dynavector':     { brand: 'Dynavector',         cat: 'cat-cartridges' },
  'hana':           { brand: 'Hana',               cat: 'cat-cartridges' },
  'kiseki':         { brand: 'Kiseki',             cat: 'cat-cartridges' },
  '1nagaokoa':      { brand: 'Nagaoka',            cat: 'cat-cartridges' },
  'audio technica': { brand: 'Audio-Technica',     cat: 'cat-cartridges' },
  // Phono preamps
  'sutherland':     { brand: 'Sutherland',         cat: 'cat-phono-preamps' },
  'lehmann':        { brand: 'Lehmann',            cat: 'cat-phono-preamps' },
  // Power amps
  'parasound':      { brand: 'Parasound',          cat: 'cat-amplifiers' },
  'coda':           { brand: 'Coda',               cat: 'cat-amplifiers' },
  'sanders':        { brand: 'Sanders Sound',      cat: 'cat-amplifiers' },
  'modwright':      { brand: 'ModWright',          cat: 'cat-amplifiers' },
  // Integrated / preamps
  'luxman':         { brand: 'Luxman',             cat: 'cat-integrated' },
  'hegel':          { brand: 'Hegel',              cat: 'cat-integrated' },
  'atoll':          { brand: 'Atoll',              cat: 'cat-integrated' },
  'sugden':         { brand: 'Sugden',             cat: 'cat-integrated' },
  'leak':           { brand: 'Leak',               cat: 'cat-integrated' },
  'prima luna':     { brand: 'PrimaLuna',          cat: 'cat-integrated' },
  'ear':            { brand: 'EAR Yoshino',        cat: 'cat-integrated' },
  '1roksan':        { brand: 'Roksan',             cat: 'cat-integrated' },
  '1entracte':      { brand: 'Entracte',           cat: 'cat-integrated' },
  // Speakers
  'afocal':         { brand: 'Focal',              cat: 'cat-speakers' },
  'dynaudio':       { brand: 'Dynaudio',           cat: 'cat-speakers' },
  '1proac':         { brand: 'ProAc',              cat: 'cat-speakers' },
  '0harbeth':       { brand: 'Harbeth',            cat: 'cat-speakers' },
  'fyne':           { brand: 'Fyne Audio',         cat: 'cat-speakers' },
  'revival':        { brand: 'Revival Audio',      cat: 'cat-speakers' },
  'sonus':          { brand: 'Sonus Faber',        cat: 'cat-speakers' },
  'sf':             { brand: 'Sonus Faber',        cat: 'cat-speakers' },
  'wharfedale':     { brand: 'Wharfedale',         cat: 'cat-speakers' },
  'wharfdale':      { brand: 'Wharfedale',         cat: 'cat-speakers' },
  'soltanus':       { brand: 'Soltanus',           cat: 'cat-speakers' },
  // CD / DAC
  'aqua':           { brand: 'Aqua',               cat: 'cat-cd-dac' },
  '1meitner':       { brand: 'Meitner',            cat: 'cat-cd-dac' },
  'cambridge':      { brand: 'Cambridge Audio',    cat: 'cat-cd-dac' },
  'musical fidelity':{ brand: 'Musical Fidelity',  cat: 'cat-cd-dac' },
  '01wattson':      { brand: 'Wattson',            cat: 'cat-cd-dac' },
  'lindemann':      { brand: 'Lindemann',          cat: 'cat-cd-dac' },
  // Streaming
  'aurender':       { brand: 'Aurender',           cat: 'cat-streaming' },
  '1innuos':        { brand: 'Innuos',             cat: 'cat-streaming' },
  'auralic':        { brand: 'Auralic',            cat: 'cat-streaming' },
  '1linn':          { brand: 'Linn',               cat: 'cat-streaming' },
  // Cables
  'audioquest':     { brand: 'AudioQuest',         cat: 'cat-cables' },
  'cardas':         { brand: 'Cardas',             cat: 'cat-cables' },
  '11shunyata':     { brand: 'Shunyata',           cat: 'cat-cables' },
  '1shunyata':      { brand: 'Shunyata',           cat: 'cat-cables' },
  'asynergistic':   { brand: 'Synergistic Research', cat: 'cat-cables' },
  // Stands / isolation
  'aisoaceoustics': { brand: 'IsoAcoustics',       cat: 'cat-stands' },
  'aisoaceoustic':  { brand: 'IsoAcoustics',       cat: 'cat-stands' },
  'hrs':            { brand: 'HRS',                cat: 'cat-stands' },
  'solidsteel':     { brand: 'Solidsteel',         cat: 'cat-stands' },
  'norstone':       { brand: 'Norstone',           cat: 'cat-stands' },
  'target':         { brand: 'Target',             cat: 'cat-stands' },
  '0rogoz':         { brand: 'Rogoz',              cat: 'cat-stands' },
  // Power supplies
  '1sbooster':      { brand: 'SBooster',           cat: 'cat-power-supplies' },
  // Record care
  '1record':        { brand: 'Record Care',        cat: 'cat-record-care' },
}

// Name-based keyword overrides (checked before folder map)
function inferCategoryFromName(name) {
  const n = name.toLowerCase()
  if (/\bturntable\b/.test(n))                          return 'cat-turntables'
  if (/\btonearm\b|\btone.?arm\b/.test(n))              return 'cat-tonearms'
  if (/\bcartridge\b|\bstylus\b/.test(n))               return 'cat-cartridges'
  if (/\bphono.?stage\b|\bphono.?pre/.test(n))          return 'cat-phono-preamps'
  if (/\bpreamplifier\b|\bpreamp\b/.test(n))            return 'cat-preamplifiers'
  if (/\bintegrated\b/.test(n))                         return 'cat-integrated'
  if (/\bamplifier\b|\bpower.?amp\b/.test(n))           return 'cat-amplifiers'
  if (/\bsubwoofer\b|\bsub.?woofer\b/.test(n))         return 'cat-subs'
  if (/\bloudspeaker\b|\bspeaker\b/.test(n))            return 'cat-speakers'
  if (/\bheadphone\b|\bhead.?amp\b/.test(n))            return 'cat-headphones'
  if (/\bsacd\b|\bcd.?player\b|\bdisc.?player\b/.test(n)) return 'cat-cd-dac'
  if (/\b(dac|d\/a)\b/.test(n))                        return 'cat-cd-dac'
  if (/\bstreamer\b|\bstreaming\b|\bnetwork.?player\b/.test(n)) return 'cat-streaming'
  if (/\bcable\b|\binterconnect\b/.test(n))             return 'cat-cables'
  if (/\bpower.?conditioner\b|\bpower.?conditioning\b/.test(n)) return 'cat-power-conditioning'
  if (/\bpower.?supply\b|\blinear.?power\b/.test(n))   return 'cat-power-supplies'
  if (/\brack\b|\bstand\b|\bshelf\b|\bisolat/.test(n)) return 'cat-stands'
  if (/\brecord.?clean\b|\bstylus.?clean\b|\brecord.?care\b/.test(n)) return 'cat-record-care'
  return null
}

function inferFromFolder(folder) {
  const f = folder.toLowerCase().trim()
  // Exact match first
  if (FOLDER_MAP[f]) return FOLDER_MAP[f]
  // Prefix match
  for (const [key, val] of Object.entries(FOLDER_MAP)) {
    if (f.startsWith(key)) return val
  }
  return null
}

function isUsed(product) {
  const folder = (product.image || '').split('/')[1] || ''
  const f = folder.toLowerCase()
  return f === '1used' || f === 'aused' || /\bused\b/.test((product.name || '').toLowerCase())
}

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\\r\\n|\\n/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/�/g, '')   // remove unicode replacement characters
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-퟿-�]/g, '') // strip non-printable
    .replace(/\s+/g, ' ')
    .trim()
}

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 96)
}

// ---------------------------------------------------------------------------
// Build NDJSON lines
// ---------------------------------------------------------------------------
const lines = []

// 1. Categories
for (const cat of CATEGORIES) {
  lines.push(JSON.stringify({
    _id: cat._id,
    _type: 'category',
    name: cat.name,
    slug: { _type: 'slug', current: cat.slug },
    sortOrder: cat.sortOrder,
  }))
}

// 2. Products
let skipped = 0
const slugsSeen = new Set()

for (const p of products) {
  const name = (p.name || '').trim()
  if (!name) { skipped++; continue }

  const folder = (p.image || '').split('/')[1] || ''
  const used = isUsed(p)

  // Determine category
  const fromName = inferCategoryFromName(name)
  const fromFolder = inferFromFolder(folder)
  const catId = fromName || (fromFolder?.cat) || 'cat-accessories'

  // Determine brand
  let brand = fromFolder?.brand || name.split(' ')[0]

  // Deduplicate slugs
  let slug = toSlug(name)
  if (slugsSeen.has(slug)) slug = `${slug}-${p.id}`
  slugsSeen.add(slug)

  const description = stripHtml(p.description)

  const doc = {
    _id: `prod-${p.id}`,
    _type: 'product',
    name,
    slug: { _type: 'slug', current: slug },
    brand,
    model: (p.model || '').trim() || undefined,
    category: { _type: 'reference', _ref: catId },
    condition: used ? 'used' : 'new',
    price: typeof p.price === 'number' ? p.price : undefined,
    priceOnRequest: !p.price,
    inStock: true,
    featured: false,
  }

  if (description) doc.description = description
  if (!doc.model) delete doc.model
  if (!doc.price) delete doc.price

  lines.push(JSON.stringify(doc))
}

const output = lines.join('\n')
fs.writeFileSync(path.join(__dirname, '../data/import.ndjson'), output)
console.log(`✓ ${CATEGORIES.length} categories`)
console.log(`✓ ${lines.length - CATEGORIES.length} products`)
if (skipped) console.log(`  (${skipped} skipped — no name)`)
console.log('Written to data/import.ndjson')
