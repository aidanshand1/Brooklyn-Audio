# Brooklyn Audio Website

A modern, fast website for Brooklyn Audio built with Next.js and Sanity CMS. Features a clean, professional design with white background and burgundy/red accents that matches the hi-fi audio aesthetic.

## Features

- **Modern Design**: Clean white background with burgundy and red accents
- **Product Management**: Easy-to-use Sanity Studio for managing inventory
- **Category Filtering**: Filter products by category (Turntables, Amplifiers, etc.)
- **Responsive**: Looks great on all devices
- **Fast**: Built with Next.js for optimal performance
- **SEO Optimized**: Proper meta tags and structured data

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **CMS**: Sanity Studio
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)
- **Images**: Sanity CDN

## Getting Started

### 1. Install Dependencies

```bash
cd brooklyn-audio
npm install
```

### 2. Set up Sanity

1. Go to [sanity.io](https://www.sanity.io) and create a new project
2. Note your Project ID and Dataset name
3. Copy `.env.local.example` to `.env.local`
4. Fill in your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 3. Deploy Sanity Schema

```bash
npm install -g @sanity/cli
sanity deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## Importing Product Data

The old Brooklyn Audio SQL database has been extracted to JSON files:

- `data/categories.json` - All product categories
- `data/products.json` - 1100+ products with descriptions and pricing

### Import to Sanity:

1. Go to http://localhost:3000/studio
2. Create categories manually using the categories.json as reference
3. Add products either manually or via Sanity's import tools

### Key Categories to Set Up:

- Turntables
- Amplifiers  
- Speakers
- Cartridges
- Headphones
- CD Players / DACs
- Phono Preamps
- Cables & Accessories
- Used / Demo

## Content Management

### Adding Products

1. Go to **Studio** → **Products**
2. Fill in:
   - **Name**: Product name (e.g., "Rega Planar 3")
   - **Brand**: Manufacturer (e.g., "Rega") 
   - **Category**: Select from dropdown
   - **Condition**: New, Used, or Demo
   - **Price**: Leave empty for "Price on Request"
   - **Image**: Upload product photo
   - **Description**: Brief description for the card

### Managing Categories

1. Go to **Studio** → **Categories**
2. Add category name and slug
3. Set sort order to control display order

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

## File Structure

```
brooklyn-audio/
├── app/                    # Next.js app router
│   ├── about/             # About page
│   ├── contact/           # Contact page  
│   ├── studio/            # Sanity Studio
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── Hero.tsx          # Hero section
│   ├── ProductGrid.tsx   # Product grid with filters
│   └── Footer.tsx        # Site footer
├── lib/                  # Utilities
│   └── sanity.ts         # Sanity client config
├── sanity/               # Sanity configuration
│   └── schemas/          # Content schemas
├── data/                 # Extracted SQL data
└── scripts/              # Utility scripts
```

## Customization

### Colors

Main colors are defined in `tailwind.config.js`:

- `burgundy`: #5c1a1a (main dark red)
- `red`: #9b1c1c (accent red)
- `cream`: #f4f1ec (subtle background)

### Fonts

- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

### Layout

The design uses a clean grid-based layout with consistent spacing and typography hierarchy.

## Support

For questions about the website:
- **Developer**: [Your contact info]
- **Content Management**: Access Sanity Studio at `/studio`

## License

© 2024 Brooklyn Audio Inc. All rights reserved.
