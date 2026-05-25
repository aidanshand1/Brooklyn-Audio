const fs = require('fs')
const path = require('path')

// Read the SQL file
const sqlContent = fs.readFileSync('/mnt/user-data/uploads/backup.sql', 'utf-8')

// Extract categories
const categoryMatches = [...sqlContent.matchAll(/INSERT INTO `category_description`.*?VALUES \('(\d+)', '1', '([^']+)'/g)]
const categories = categoryMatches.map(match => ({
  id: match[1],
  name: match[2]
}))

console.log('Categories found:')
categories.forEach(cat => console.log(`- ${cat.id}: ${cat.name}`))

// Extract products
const productMatches = [...sqlContent.matchAll(/INSERT INTO `product`.*?VALUES \('(\d+)', '([^']*)', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '([^']*)', '[^']*', '[^']*', '([^']*)', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '[^']*', '1', '[^']*', '[^']*', '[^']*'\)/g)]

// Extract product descriptions
const productDescMatches = [...sqlContent.matchAll(/INSERT INTO `product_description`.*?VALUES \('(\d+)', '1', '([^']*)', '([^']*)', '[^']*', '[^']*'\)/g)]

const productDescriptions = {}
productDescMatches.forEach(match => {
  productDescriptions[match[1]] = {
    name: match[2],
    description: match[3].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  }
})

// Combine product data
const products = productMatches.map(match => {
  const productId = match[1]
  const model = match[2]
  const image = match[3]
  const price = parseFloat(match[4]) || null
  
  const description = productDescriptions[productId]
  
  return {
    id: productId,
    model: model,
    name: description?.name || model,
    description: description?.description || '',
    image: image,
    price: price
  }
}).filter(product => product.name && product.name.trim())

console.log(`\nProducts found: ${products.length}`)
console.log('\nFirst 10 products:')
products.slice(0, 10).forEach(product => {
  console.log(`- ${product.name} (${product.model}) - $${product.price}`)
})

// Save to JSON files for easier importing
const outputDir = '/home/claude/brooklyn-audio/data'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(path.join(outputDir, 'categories.json'), JSON.stringify(categories, null, 2))
fs.writeFileSync(path.join(outputDir, 'products.json'), JSON.stringify(products, null, 2))

console.log('\nData saved to:')
console.log('- /home/claude/brooklyn-audio/data/categories.json')
console.log('- /home/claude/brooklyn-audio/data/products.json')
