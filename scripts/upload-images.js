#!/usr/bin/env node
/**
 * Uploads product images from "site pictures/" to Sanity and patches each
 * product document with the resulting image reference.
 *
 * Usage:  node scripts/upload-images.js
 *
 * Reads  : data/products.json   (original product list with image paths)
 * Images : "site pictures/<folder>/<file>"  (stripped of leading "data/")
 * Patches: prod-<id> documents in Sanity
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

// ── Config ────────────────────────────────────────────────────────────────────
const PROJECT_ID = 'e8x3kd2r'
const DATASET    = 'production'
const API_VERSION = '2023-12-01'
const PICS_DIR   = path.join(__dirname, '..', 'site pictures')
const PRODUCTS_JSON = path.join(__dirname, '..', 'data', 'products.json')
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'upload-progress.json')
const CONCURRENCY = 4   // parallel uploads

// Read auth token from Sanity CLI config
const sanityConfig = JSON.parse(
  fs.readFileSync(path.join(process.env.HOME, '.config', 'sanity', 'config.json'), 'utf-8')
)
const token = sanityConfig.authToken
if (!token) {
  console.error('No Sanity auth token found. Run: npx sanity login')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token })

// ── Load progress (resume if interrupted) ────────────────────────────────────
let done = {}
if (fs.existsSync(PROGRESS_FILE)) {
  done = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'))
  console.log(`Resuming — ${Object.keys(done).length} already done`)
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(done, null, 2))
}

// ── Build work list ───────────────────────────────────────────────────────────
const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'))

const work = []
for (const p of products) {
  const id = String(p.id)
  if (done[id]) continue                         // already uploaded
  if (!p.image) continue

  const rel  = p.image.replace(/^data\//, '')
  const full = path.join(PICS_DIR, rel)
  if (!fs.existsSync(full)) continue             // image file not found

  work.push({ id, docId: `prod-${id}`, full, rel })
}

console.log(`${work.length} images to upload (${Object.keys(done).length} skipped — already done, ${products.length - work.length - Object.keys(done).length} missing files)`)
if (work.length === 0) {
  console.log('Nothing to do.')
  process.exit(0)
}

// ── Upload worker ─────────────────────────────────────────────────────────────
let completed = 0
let errors    = 0

async function uploadOne({ id, docId, full, rel }) {
  const ext  = path.extname(full).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
             : ext === 'png'  ? 'image/png'
             : ext === 'gif'  ? 'image/gif'
             : ext === 'webp' ? 'image/webp'
             : 'image/jpeg'

  try {
    const stream = fs.createReadStream(full)
    const asset  = await client.assets.upload('image', stream, {
      filename: path.basename(full),
      contentType: mime,
    })

    await client.patch(docId).set({
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    }).commit()

    done[id] = asset._id
    completed++

    if (completed % 20 === 0) {
      saveProgress()
      console.log(`  ${completed}/${work.length} uploaded...`)
    }
  } catch (err) {
    errors++
    console.error(`  ✗ ${rel}: ${err.message}`)
  }
}

// ── Run with limited concurrency ──────────────────────────────────────────────
async function run() {
  const queue = [...work]
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()
      await uploadOne(item)
    }
  })

  await Promise.all(workers)
  saveProgress()

  console.log(`\nDone. ${completed} uploaded, ${errors} errors, ${Object.keys(done).length} total complete.`)
  if (errors > 0) console.log('Re-run the script to retry failed items.')
}

run().catch(err => {
  console.error('Fatal:', err)
  saveProgress()
  process.exit(1)
})
