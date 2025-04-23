import type { CatalogPlugin, CatalogMetadata } from '@data-fair/lib-common-types/catalog.js'
import { schema as configSchema, assertValid as assertConfigValid, type MockConfig } from './types/config/index.ts'
import { allDatasets } from './lib/utils.ts'

const listDatasets = async (catalogConfig: MockConfig, params?: { q?: string }) => {
  // Filter datasets based on search query
  let results = allDatasets
  if (params?.q) {
    const searchTerm = params.q.toLowerCase()
    results = allDatasets.filter(dataset =>
      dataset.title.toLowerCase().includes(searchTerm)
    )
  }

  return {
    count: results.length,
    results
  }
}

const getDataset = async (catalogConfig: MockConfig, datasetId: string) => {
  return (await listDatasets(catalogConfig)).results.find(d => d.id === datasetId)
}

const publishDataset = async (catalogConfig: MockConfig, dataset: any, publication: any) => {
  console.log('Publishing dataset ' + dataset.id)
  return publication
}

const deleteDataset = async () => {
  console.log('Deleting dataset...')
}

const capabilities = [
  'listDatasets' as const,
  'search' as const,
  'publishDataset' as const,
]

const metadata: CatalogMetadata<typeof capabilities> = {
  title: 'Catalog Mock',
  description: 'Mock plugin for Data Fair Catalog',
  icon: 'M6,22A3,3 0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 21,19A3,3 0 0,1 18,22H6M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59 18.82,18.43L16.53,14.47L14,17L8.93,11.93L5.18,18.43C5.07,18.59 5,18.79 5,19M13,10A1,1 0 0,0 12,11A1,1 0 0,0 13,12A1,1 0 0,0 14,11A1,1 0 0,0 13,10Z',
  capabilities
}

const plugin: CatalogPlugin<MockConfig, typeof capabilities> = {
  listDatasets,
  getDataset,
  publishDataset,
  deleteDataset,
  configSchema,
  assertConfigValid,
  metadata
}
export default plugin
