import type { CatalogPlugin } from '@data-fair/lib-common-types/catalog/index.js'
import { strict as assert } from 'node:assert'
import { it, describe } from 'node:test'
import plugin from '../index.ts'

// First, use default type like it's done in Catalogs
const catalogPlugin: CatalogPlugin = plugin as CatalogPlugin

/**
 * Mock catalog configuration for testing purposes.
 */
const catalogConfig = {
  url: 'http://localhost:3000',
}

describe('catalog-mock', () => {
  it('should list resources and folder from root', async () => {
    const res = await catalogPlugin.list({
      catalogConfig,
      params: {}
    })

    assert.equal(res.count, 2, 'Expected 2 items in the root folder')
    assert.equal(res.results.length, 2)
    assert.equal(res.results[0].type, 'folder', 'Expected folders in the root folder')

    assert.equal(res.path.length, 0, 'Expected no path for root folder')
  })

  it('should list resources and folder from a folder', async () => {
    const res = await catalogPlugin.list({
      catalogConfig,
      params: { currentFolderId: 'category-geospatial' }
    })

    assert.equal(res.count, 2, 'Expected 2 items in category-geospatial folder')
    assert.equal(res.results.length, 2)
    assert.equal(res.results[0].type, 'folder', 'Expected folders in category-geospatial folder')

    assert.equal(res.path.length, 1, 'Expected path to contain the current folder')
    assert.equal(res.path[0].id, 'category-geospatial')
  })

  it('should list resources and folder with pagination', { skip: 'This catalog does not support pagination' }, async () => {})

  it('should get a resource', async () => {
    const resourceId = 'category-demographic/resource-population-2023'
    const resource = await catalogPlugin.getResource(catalogConfig, resourceId)
    assert.ok(resource, 'The resource should exist')

    assert.equal(resource.id, resourceId, 'Resource ID should match')
    assert.equal(resource.title, 'Population par commune 2023', 'Resource title should match')
    assert.equal(resource.type, 'resource', 'Expected resource type to be "resource"')
  })

  it('should download a resource', async () => {
    const fs = await import('fs-extra')

    // Create a temporary directory for the download
    const tmpDir = './data/test/downloads'
    await fs.ensureDir(tmpDir)

    const resourceId = 'category-demographic/resource-population-2023'
    const downloadUrl = await catalogPlugin.downloadResource({
      catalogConfig,
      resourceId,
      importConfig: {
        nbRows: 10
      },
      tmpDir
    })

    assert.ok(downloadUrl, 'Download URL should not be undefined')
    assert.ok(downloadUrl.endsWith('jdd-mock.csv'), 'Download URL should contain the downloaded file name')

    // Check if the file exists
    const fileExists = await fs.pathExists(downloadUrl)
    assert.ok(fileExists, 'The downloaded file should exist')
  })

  it('should publish a resource', async () => {
    const dataset = {
      id: 'test-dataset',
      title: 'Test Dataset',
      description: 'This is a test dataset'
    }
    const publication = {
      publicationSite: 'http://localhost:3000',
      isResource: false
    }

    const result = await catalogPlugin.publishDataset(catalogConfig, dataset, publication)
    assert.ok(result, 'The publication should be successful')
    assert.equal(result.publicationSite, publication.publicationSite, 'Publication site should not be changed')
    assert.equal(result.isResource, publication.isResource, 'Publication type should not be changed')
  })

  it('should delete a resource', async () => {
    const datasetId = 'test-dataset'
    const resourceId = 'category-demographic/resource-population-2023'

    await catalogPlugin.deleteDataset(catalogConfig, datasetId, resourceId)
    // Since this is a mock plugin, we cannot verify the deletion, but we can check that no error is thrown
    assert.ok(true, 'Delete operation should not throw an error')
  })
})
