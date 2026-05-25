#!/usr/bin/env node
// Fetches ALL products (paginated), finds any description containing literal \t,
// and replaces them. Works around Sanity GROQ index lag on bulk-imported documents.

const { createClient } = require('@sanity/client')
const fs = require('fs')

const sanityConfig = JSON.parse(
  fs.readFileSync(process.env.HOME + '/.config/sanity/config.json', 'utf-8')
)
const client = createClient({
  projectId: 'e8x3kd2r', dataset: 'production',
  apiVersion: '2023-12-01', token: sanityConfig.authToken, useCdn: false,
})

const BACKSLASH_T = String.fromCharCode(92) + 't'   // literal \t as 2 chars

function clean(str) {
  return str
    .split(BACKSLASH_T).join(' ')    // replace ALL literal \t with space
    .replace(/[ ]+/g, ' ')           // collapse runs of spaces
    .trim()
}

async function fetchAllProducts() {
  const all = []
  let offset = 0
  while (true) {
    const batch = await client.fetch(
      `*[_type == "product"] | order(_id) [${offset}...${offset + 200}] { _id, description }`
    )
    if (batch.length === 0) break
    all.push(...batch)
    offset += 200
    if (batch.length < 200) break
  }
  return all
}

async function run() {
  console.log('Fetching all products...')
  const all = await fetchAllProducts()
  console.log(`${all.length} products total`)

  const needsFix = all.filter(p =>
    p.description && p.description.includes(BACKSLASH_T)
  )
  console.log(`${needsFix.length} descriptions contain literal \\t`)

  if (needsFix.length === 0) { console.log('Nothing to do.'); return }

  let done = 0
  for (let i = 0; i < needsFix.length; i += 50) {
    const batch = needsFix.slice(i, i + 50)
    const tx = client.transaction()
    for (const p of batch) {
      tx.patch(p._id, { set: { description: clean(p.description) } })
    }
    await tx.commit()
    done += batch.length
    console.log(`  ${done}/${needsFix.length} patched`)
  }
  console.log('Done.')
}

run().catch(err => { console.error(err); process.exit(1) })
