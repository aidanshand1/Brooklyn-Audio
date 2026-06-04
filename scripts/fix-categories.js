#!/usr/bin/env node
/**
 * Reclassifies miscategorized products in Sanity.
 * Targets products in 'accessories' and 'cd-players-dacs' that belong elsewhere.
 *
 * Usage:
 *   node scripts/fix-categories.js          # dry run — prints changes only
 *   node scripts/fix-categories.js --apply  # commits changes to Sanity
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')

const sanityConfig = JSON.parse(
  fs.readFileSync(process.env.HOME + '/.config/sanity/config.json', 'utf-8')
)
const client = createClient({
  projectId: 'e8x3kd2r', dataset: 'production',
  apiVersion: '2023-12-01', token: sanityConfig.authToken, useCdn: false,
})

const APPLY = process.argv.includes('--apply')

// ── Category ID map ──────────────────────────────────────────────────────────
const CAT = {
  accessories:      'cat-accessories',
  amplifiers:       'cat-amplifiers',
  cables:           'cat-cables',
  cartridges:       'cat-cartridges',
  'cd-dac':         'cat-cd-dac',
  headphones:       'cat-headphones',
  integrated:       'cat-integrated',
  streaming:        'cat-streaming',
  'phono-preamps':  'cat-phono-preamps',
  'power-cond':     'cat-power-conditioning',
  'power-supplies': 'cat-power-supplies',
  preamplifiers:    'cat-preamplifiers',
  'record-care':    'cat-record-care',
  speakers:         'cat-speakers',
  stands:           'cat-stands',
  subs:             'cat-subs',
  tonearms:         'cat-tonearms',
  turntables:       'cat-turntables',
}

// ── Classification logic ─────────────────────────────────────────────────────
function classify(brand, name, currentSlug) {
  // Only fix known problem categories
  if (currentSlug !== 'accessories' && currentSlug !== 'cd-players-dacs') return null

  const b = brand
  const n = name

  // ── SPEAKERS ──────────────────────────────────────────────────────────────
  if (b === 'GoldenEar') {
    const sub = ['SS60','SS3','SS50','SS XXL','SCREF'].some(s => n.includes(s))
    return sub ? CAT.subs : CAT.speakers
  }
  if (['Spendor','Soltanus'].includes(b)) return CAT.speakers
  if (b === 'Invisa') return CAT.speakers                      // KEF Invisa in-ceiling
  if (b === 'Triton' && n === 'Triton II') return CAT.speakers // GoldenEar Triton II
  if (b === '3D' && n === '3D Array X') return CAT.speakers

  // ── SUBWOOFERS ────────────────────────────────────────────────────────────
  if (b === 'Rel') return CAT.subs                             // all REL items (No.31, T-5x…)
  if (b === 'SuperSub') return CAT.subs
  if (b === 'T-9x') return CAT.subs                           // REL T-9x SE (mangled brand)

  // ── INTEGRATED AMPLIFIERS ─────────────────────────────────────────────────
  if (['Cronus','Elicit','Sphinx','NAIT','Nait','SuperNait-3'].includes(b)) return CAT.integrated
  if (b === 'Uniti') return CAT.integrated                    // Naim Uniti Atom, Nova
  if (b === 'Osiris' && n === 'Osiris') return CAT.integrated // Rega Osiris (mangled brand)
  if (b === 'deHavilland') return CAT.integrated
  if (b === 'Unison' && !n.includes('CD')) return CAT.integrated
  if (b === 'Unico' && !n.includes('CD')) return CAT.integrated
  if (b === 'Rogue') {
    if (/Pharaoh|Sphinx|DragoN/i.test(n)) return CAT.integrated
    if (/ST100|Atlas|Apollo/i.test(n)) return CAT.amplifiers
    if (/RP-1|RP-5|RP-9/i.test(n)) return CAT.preamplifiers
    if (/Ares/i.test(n)) return CAT['phono-preamps']
    return null
  }
  if (b === 'Zesto') {
    if (/Bia|Eros|Tessera/i.test(n)) return CAT.integrated
    if (/Andros|Allasso/i.test(n)) return CAT['phono-preamps']
    return null
  }
  if (b === 'Rega') {
    if (/Elex|Aethos|Osiris|Io\b/.test(n)) return CAT.integrated
    if (/RB78|RB220|RB880|RB3000/.test(n)) return CAT.tonearms
    if (/Planar|Planar 1 Package/.test(n)) return CAT.turntables
    if (/Carbon|Apheta|Ania|Aura MC/.test(n)) return CAT.cartridges
    if (/Fono|Aura/.test(n)) return CAT['phono-preamps']
    if (/Isis/.test(n)) return CAT['cd-dac']
    if (/ND3|ND5|ND7/.test(n)) return CAT.streaming
    if (/TTPSU|24V Upgrade/.test(n)) return CAT['power-supplies']
    return null // belts, acrylic etc stay in accessories
  }
  if (b === 'Naim') {
    if (/Mu-so|Uniti Core|NSS 333|ND5 XS|NDX/.test(n)) return CAT.streaming
    if (/Uniti Star/.test(n)) return CAT.integrated
    if (/NSC222|NAC 332/.test(n)) return CAT.preamplifiers
    if (/NAP350/.test(n)) return CAT.amplifiers
    if (/FlatCap/.test(n)) return CAT['power-supplies']
    if (/NACA/.test(n)) return CAT.cables
    if (/Audio Stack/.test(n)) return CAT.stands
    return null
  }
  if (b === 'Music') {
    if (/A 70\.2|A 15\.3/.test(n)) return CAT.integrated
    if (/CDAC/.test(n)) return CAT['cd-dac']
    if (/MMF/.test(n)) return CAT.turntables
    if (/PA 2\.2|PH 25\.2/.test(n)) return CAT['phono-preamps']
    return null // Cork Mat, Cruise Control stay
  }
  if (currentSlug === 'cd-players-dacs' && b === 'Musical Fidelity') {
    if (/M[2356]SI|M6 Encore/.test(n)) return CAT.integrated
    if (/M6 Connect/.test(n)) return CAT.streaming
    return null
  }
  if (currentSlug === 'cd-players-dacs' && b === 'Lindemann') return CAT.streaming

  // ── POWER AMPLIFIERS ──────────────────────────────────────────────────────
  if (b === 'M-180') return CAT.amplifiers
  if (b === 'NAP250') return CAT.amplifiers
  if (b === 'PS') {
    if (/BHK 250|BHK 300/.test(n)) return CAT.amplifiers
    if (/PP20|PP12|PP15|PP3|Noise Harvester|Dectect/.test(n)) return CAT['power-cond']
    if (/AC-5|AC-3/.test(n)) return CAT.cables
    if (/AC-12/.test(n)) return CAT.cables
    if (/Stellar Phono/.test(n)) return CAT['phono-preamps']
    return null
  }
  if (b === 'Perfect') return CAT.cables  // PS Audio Perfect Wave AC-12

  // ── PREAMPLIFIERS ─────────────────────────────────────────────────────────
  if (b === 'Leto') return CAT.preamplifiers
  if (b === 'UltraVerve') return CAT.preamplifiers
  if (b === 'Rotel') return CAT.preamplifiers

  // ── POWER SUPPLIES ────────────────────────────────────────────────────────
  if (['HiCap','SuperCap','XPS-DR'].includes(b)) return CAT['power-supplies']
  if (b === 'Goldnote') {
    if (/PSU|PST/.test(n)) return CAT['power-supplies']
    if (/PH-1000|PH-5/.test(n)) return CAT['phono-preamps']
    return null
  }

  // ── TURNTABLES ────────────────────────────────────────────────────────────
  if (['MMF','Soulines','Valore','StudioDeck','UltraDeck'].includes(b)) return CAT.turntables
  if (b === 'Planar') return CAT.turntables
  if (b === 'RP-7') return CAT.turntables
  if (b === 'Avenger') return CAT.turntables                  // VPI Avenger Plus
  if (b === 'Clearaudio' && n.includes('Concept')) return CAT.turntables

  // ── TONEARMS ──────────────────────────────────────────────────────────────
  if (b === 'Jelco' && /TK-|TS-|Easy VTA/.test(n)) return CAT.tonearms
  if (['TS-350S','TS-550L','TS-550S'].includes(b)) return CAT.tonearms
  if (b === 'RB330') return CAT.tonearms
  if (b === 'Tri-Planar') return CAT.tonearms

  // ── CARTRIDGES ────────────────────────────────────────────────────────────
  if (b === 'Grado') {
    if (/\bSR|\bRS|\bGS/.test(n)) return CAT.headphones
    return CAT.cartridges // Prestige, Platinum, Opus 3 etc.
  }
  if (b === 'SR80x') return CAT.headphones
  if (b === 'Aeon') return CAT.headphones                     // Dan Clark Aeon 3
  if (['Goldring','DRT','Ania','Aphelion','Paua','Zephyr','Soundsmith',
       'MC','Prestige','Spirit','Irox','1012GX'].includes(b)) {
    if (/Sleeve|Brush|Exstatic/.test(n)) return CAT['record-care']
    if (/EZ-Mount|Counter Intuitive/.test(n)) return null // stay as accessories
    return CAT.cartridges
  }
  if (b === 'MoFi' && /Tracker/.test(n)) return CAT.cartridges
  if (b === 'Ortofon') {
    if (/Tracking Force Gauge/.test(n)) return null // stay as accessories
    return CAT.cartridges
  }

  // ── PHONO PREAMPS ─────────────────────────────────────────────────────────
  if (['Aria','Fono','PH-10','MMP4','Ares'].includes(b)) return CAT['phono-preamps']
  if (b === 'Chord' && /Huei/.test(n)) return CAT['phono-preamps']

  // ── CD PLAYERS / DACs ─────────────────────────────────────────────────────
  if (['CD5si','Saturn'].includes(b)) return CAT['cd-dac']
  if (b === 'Musical' && /M6SCD/.test(n)) return CAT['cd-dac']
  if (b === 'Unico' && /CD/.test(n)) return CAT['cd-dac']
  if (b === 'Unison' && /CD/.test(n)) return CAT['cd-dac']
  if (b === 'Chord' && /Hugo|Qutest|Scaler/.test(n)) return CAT['cd-dac']
  if (['MD-105T','MD-107T','MD-109','MD-301','MD-306','MD-307',
       'MD-309','MD-801','MD-806T','MD-807T','MD-809T','MD-90T','Magnum'].includes(b))
    return CAT['cd-dac'] // Magnum Dynalab FM tuners

  // ── STREAMING ─────────────────────────────────────────────────────────────
  if (b === 'Melco') return CAT.streaming
  if (b === 'Silent') return CAT.streaming
  if (b === 'N100') return CAT.streaming

  // ── POWER CONDITIONING ────────────────────────────────────────────────────
  if (['Hydra','Venom','ForceField','Quantum'].includes(b)) return CAT['power-cond']
  if (b === 'Nordost') {
    if (/Sort Kones/.test(n)) return CAT.stands
    if (/Qv2|Qk1|QRT|QNet/.test(n)) return CAT['power-cond']
    return CAT.cables
  }

  // ── CABLES ────────────────────────────────────────────────────────────────
  if (['Cardas','Kubala','Norse','Hiline','Powerline'].includes(b)) return CAT.cables
  if (b === 'Blue') return CAT.cables   // Nordost Blue Heaven
  if (b === 'Purple') return CAT.cables // Nordost Purple Flare
  if (b === 'Red') return CAT.cables    // Nordost Red Dawn
  if (b === 'White') return CAT.cables  // Nordost White Lightning
  if (b === 'Clear') return CAT.cables  // Cardas/Nordost Clear
  if (b === 'Crosslink') return CAT.cables
  if (b === 'Elation') return CAT.cables   // Nordost Elation PC
  if (b === 'REL' && /Bassline/.test(n)) return CAT.cables
  if (b === 'ROS') return CAT.cables

  // ── STANDS / ISOLATION ───────────────────────────────────────────────────
  if (['Gingko','IsoAcoustics','Rollerblock','Segue','Solid'].includes(b)) return CAT.stands
  if (['Iso-Puck','IsoClear'].includes(b)) return CAT.stands
  if (b === 'Cloud') return CAT.stands
  if (b === 'Mini' && /Cloud/.test(n)) return CAT.stands
  if (b === 'Ultra' && /Platform/.test(n)) return CAT.stands
  if (b === 'Fat' && /Padz/.test(n)) return CAT.stands
  if (b === 'Point' && /Pods/.test(n)) return CAT.stands
  if (b === 'Precision' && /Coupler/.test(n)) return CAT.stands

  // ── RECORD CARE ──────────────────────────────────────────────────────────
  if (['Okki','Zerostat','Concentrate'].includes(b)) return CAT['record-care']
  if (b === 'Nitty') return CAT['record-care']
  if (b === 'Spin') return CAT['record-care']
  if (b === 'Record') return CAT['record-care']
  if (b === 'Audio' && /Audio Desk/.test(n)) return CAT['record-care']
  if (b === 'Disc' && /Silence/.test(n)) return CAT['record-care']

  return null // leave unchanged
}

// ── Fetch all products (paginated) ───────────────────────────────────────────
async function fetchAll() {
  const all = []
  let offset = 0
  while (true) {
    const batch = await client.fetch(
      `*[_type == "product"] | order(_id) [${offset}...${offset + 200}] {
         _id, name, brand,
         "catSlug": category->slug.current,
         "catRef":  category._ref
       }`
    )
    if (!batch.length) break
    all.push(...batch)
    offset += 200
    if (batch.length < 200) break
  }
  return all
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('Fetching all products…')
  const products = await fetchAll()
  console.log(`${products.length} products total\n`)

  const moves = []
  for (const p of products) {
    const target = classify(p.brand, p.name, p.catSlug)
    if (target && target !== p.catRef) {
      moves.push({ _id: p._id, brand: p.brand, name: p.name, from: p.catSlug, to: target })
    }
  }

  // Group by destination for readability
  const byTarget = {}
  for (const m of moves) {
    byTarget[m.to] = byTarget[m.to] || []
    byTarget[m.to].push(m)
  }

  console.log(`${moves.length} products to reclassify:\n`)
  for (const [cat, items] of Object.entries(byTarget)) {
    console.log(`→ ${cat} (${items.length})`)
    for (const i of items) console.log(`   ${i.from} → ${i.brand} – ${i.name}`)
    console.log()
  }

  if (!APPLY) {
    console.log('Dry run. Pass --apply to commit changes.')
    return
  }

  console.log('Applying…')
  let done = 0
  for (let i = 0; i < moves.length; i += 50) {
    const batch = moves.slice(i, i + 50)
    const tx = client.transaction()
    for (const m of batch) {
      tx.patch(m._id, { set: { category: { _type: 'reference', _ref: m.to } } })
    }
    await tx.commit()
    done += batch.length
    console.log(`  ${done}/${moves.length} patched`)
  }
  console.log('Done.')
}

run().catch(err => { console.error(err); process.exit(1) })
