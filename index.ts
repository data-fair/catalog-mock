import type { CatalogPlugin } from '@data-fair/lib-common-types/catalog/index.js'
import { importConfigSchema, configSchema, assertConfigValid, type MockConfig } from '#types'
import capabilities from './lib/capabilities.ts'
import Debug from 'debug'
const debug = Debug('catalog-mock')

// Since the plugin is very frequently imported, each function is imported on demand,
// instead of loading the entire plugin.
// This file should not contain any code, but only constants and dynamic imports of functions.

const plugin: CatalogPlugin<MockConfig, typeof capabilities> = {
  async prepare ({ catalogConfig, secrets }) {
    debug('Preparing catalog mock plugin...')
    const secretField = catalogConfig.secretField

    // If the config contains a secretField, and it is not already hidden
    if (secretField && secretField !== '********') {
      // Hide the secret in the catalogConfig, and copy it to secrets
      secrets.secretField = secretField
      catalogConfig.secretField = '********'

    // If the secretField is in the secrets, and empty in catalogConfig,
    // then it means the user has cleared the secret in the config
    } else if (secrets?.secretField && secretField === '') {
      delete secrets.secretField
    } else {
      // The secret is already set, do nothing
    }

    return {
      catalogConfig,
      secrets
    }
  },

  async list (context) {
    const { list } = await import('./lib/imports.ts')
    return list(context)
  },

  async getResource (context) {
    const { getResource } = await import('./lib/imports.ts')
    return getResource(context)
  },

  async downloadResource (context) {
    const { downloadResource } = await import('./lib/imports.ts')
    return downloadResource(context)
  },

  async publishDataset ({ dataset, publication }) {
    debug('Publishing dataset ' + dataset.id)
    publication.remoteDataset = {
      id: 'my-mock-' + dataset.id,
      title: dataset.title,
      url: 'https://example.com/dataset/' + dataset.id,
    }
    return publication
  },

  async deleteDataset () {
    debug('Deleting dataset...')
  },

  metadata: {
    title: 'Catalog Mock',
    description: 'Mock plugin for Data Fair Catalog',
    capabilities
  },

  importConfigSchema,
  configSchema,
  assertConfigValid
}
export default plugin
