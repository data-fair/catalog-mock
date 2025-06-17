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
    // TODO: Check also importConfig validation
  })

  it('should publish a resource', async () => {

  })

  it('should delete a resource', async () => {

  })
})
