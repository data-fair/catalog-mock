import type { CatalogPlugin, CatalogMetadata } from '@data-fair/lib-common-types/catalog/index.js'

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

const downloadResource = async (catalogConfig: MockConfig, resourceId: string, tmpDir: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate downloading by copying a dummy file
  const fs = await import('fs-extra')
  const path = await import('path')
  const sourceFile = path.join(import.meta.dirname, 'lib', 'jdd-mock.csv')
  const destFile = path.join(tmpDir, 'jdd-mock.csv')
  await fs.copy(sourceFile, destFile)
  return destFile
}

const publishDataset = async (catalogConfig: MockConfig, dataset: any, exp: any) => {
  console.log('Publishing dataset ' + dataset.id)
  return exp
}

const deleteDataset = async () => {
  console.log('Deleting dataset...')
}

const capabilities = [
  'listResources' as const,
  'search' as const,
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
  publishDataset,
  deleteDataset,
  configSchema,
  assertConfigValid,
  metadata
}
export default plugin
