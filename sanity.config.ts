import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schema } from './sanity/schemas'

export default defineConfig({
  name: 'brooklyn-audio',
  title: 'Brooklyn Audio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Brooklyn Audio')
          .items([
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Products')
              .child(S.documentTypeList('product').title('Products')),
          ]),
    }),
    visionTool(),
  ],
  schema,
})
