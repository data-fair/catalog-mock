import type { CatalogPlugin, CatalogMetadata, ListContext, DownloadResourceContext } from '@data-fair/lib-common-types/catalog/index.js'
import { configSchema, assertConfigValid, type MockConfig } from '#types'
import capabilities from './lib/capabilities.ts'

// Since the plugin is very frequently imported, each function is imported on demand,
// instead of loading the entire plugin.
// This file should not contain any code, but only constants and dynamic imports of functions.

const list = async (context: ListContext<MockConfig, typeof capabilities>) => {
  const { list } = await import('./lib/imports.ts')
  return list(context)
}

const getResource = async (catalogConfig: MockConfig, resourceId: string) => {
  const { getResource } = await import('./lib/imports.ts')
  return getResource(catalogConfig, resourceId)
}

const downloadResource = async (context: DownloadResourceContext<MockConfig>) => {
  const { downloadResource } = await import('./lib/imports.ts')
  return downloadResource(context)
}

const publishDataset = async (catalogConfig: MockConfig, dataset: any, publication: any) => {
  console.log('Publishing dataset ' + dataset.id)
  return publication
}

const deleteDataset = async () => {
  console.log('Deleting dataset...')
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

const metadata: CatalogMetadata<typeof capabilities> = {
  title: 'Catalog Mock',
  description: 'Mock plugin for Data Fair Catalog',
  capabilities
}

const plugin: CatalogPlugin<MockConfig, typeof capabilities> = {
  list,
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
