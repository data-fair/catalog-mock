import type { CatalogPlugin, CatalogMetadata, DownloadContext } from '@data-fair/lib-common-types/catalog/index.js'

import clone from '@data-fair/lib-utils/clone.js'
import { schema as configSchema, assertValid as assertConfigValid, type MockConfig } from './types/config/index.ts'
import { rootFolder } from './lib/utils.ts'

const listResources = async (catalogConfig: MockConfig, params?: { q?: string }) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const filterFolders = clone(rootFolder)
  // Filter datasets based on search query
  // if (params?.q) {
  //   const searchTerm = params.q.toLowerCase()
  //   results = allDatasets.filter(dataset =>
  //     dataset.title.toLowerCase().includes(searchTerm)
  //   )
  // }

  return {
    count: 15,
    rootFolder: filterFolders
  }
}

const getResource = async (catalogConfig: MockConfig, resourceId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return clone(rootFolder.folders?.['category-demographic'].resources?.['resource-population-2023']) || undefined
}

const downloadResource = async ({ importConfig, tmpDir }: DownloadContext<MockConfig>) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate downloading by copying a dummy file with limited rows
  const fs = await import('node:fs/promises')
  const path = await import('path')
  const sourceFile = path.join(import.meta.dirname, 'lib', 'jdd-mock.csv')
  const destFile = path.join(tmpDir, 'jdd-mock.csv')
  const data = await fs.readFile(sourceFile, 'utf8')
  const lines = data.split('\n').slice(0, importConfig.nbRows).join('\n')
  await fs.writeFile(destFile, lines, 'utf8')
  return destFile
}

const importConfigSchema = {
  type: 'object',
  properties: {
    nbRows: {
      title: 'Nombre de lignes à importer',
      type: 'integer',
      default: 10,
      minimum: 5,
      maximum: 50
    }
  },
  required: ['nbRows'],
  additionalProperties: false
}

const publishDataset = async (catalogConfig: MockConfig, dataset: any, publication: any) => {
  console.log('Publishing dataset ' + dataset.id)
  return publication
}

const deleteDataset = async () => {
  console.log('Deleting dataset...')
}

const capabilities = [
  'listResources' as const,
  'search' as const,
  'importConfig' as const,
  'publishDataset' as const,
  'deletePublication' as const
]

const metadata: CatalogMetadata<typeof capabilities> = {
  title: 'Catalog Mock',
  description: 'Mock plugin for Data Fair Catalog',
  capabilities
}

const plugin: CatalogPlugin<MockConfig, typeof capabilities> = {
  listResources,
  getResource,
  downloadResource,
  importConfigSchema,
  publishDataset,
  deleteDataset,
  configSchema,
  assertConfigValid,
  metadata
}
export default plugin
