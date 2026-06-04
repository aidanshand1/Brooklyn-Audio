#!/usr/bin/env node
/**
 * Delete a product from Sanity by name (partial match, case-insensitive).
 *
 * Usage:
 *   node scripts/delete-product.js "1012GX"
 *   node scripts/delete-product.js "Rega Carbon"
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')
const readline = require('readline')

const sanityConfig = JSON.parse(
  fs.readFileSync(process.env.HOME + '/.config/sanity/config.json', 'utf-8')
)
const client = createClient({
  projectId: 'e8x3kd2r', dataset: 'production',
  apiVersion: '2023-12-01', token: sanityConfig.authToken, useCdn: false,
})

const search = process.argv[2]
if (!search) {
  console.error('Usage: node scripts/delete-product.js "product name"')
  process.exit(1)
}

async function run() {
  const matches = await client.fetch(
    `*[_type == "product" && lower(name) match lower($q)] { _id, name, brand }`,
    { q: `*${search.toLowerCase()}*` }
  )

  if (!matches.length) {
    console.log(`No products found matching "${search}"`)
    return
  }

  console.log(`\nFound ${matches.length} match${matches.length > 1 ? 'es' : ''}:`)
  matches.forEach((p, i) => console.log(`  [${i + 1}] ${p.brand} – ${p.name}  (${p._id})`))

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question('\nDelete all of the above? (yes / number to pick one / n to cancel): ', async (ans) => {
    rl.close()
    if (ans.toLowerCase() === 'n' || ans.toLowerCase() === 'no') {
      console.log('Cancelled.')
      return
    }

    let toDelete = matches
    const pick = parseInt(ans)
    if (!isNaN(pick) && pick >= 1 && pick <= matches.length) {
      toDelete = [matches[pick - 1]]
    } else if (ans.toLowerCase() !== 'yes' && ans.toLowerCase() !== 'y') {
      console.log('Cancelled.')
      return
    }

    for (const p of toDelete) {
      await client.delete({ query: `*[_id == $id || _id == "drafts." + $id]`, params: { id: p._id } })
      console.log(`Deleted: ${p.brand} – ${p.name}`)
    }
  })
}

run().catch(err => { console.error(err); process.exit(1) })
