import type { CatalogPlugin, CatalogMetadata, ListContext, DownloadResourceContext, Folder } from '@data-fair/lib-common-types/catalog/index.js'

import clone from '@data-fair/lib-utils/clone.js'
import { schema as configSchema, assertValid as assertConfigValid, type MockConfig } from './types/config/index.ts'
import { folders } from './lib/utils.ts'

const list = async ({ params }: ListContext<MockConfig, typeof capabilities>) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const filterData = clone(folders)

  // Helper function to find parent path
  const findParentPath = (folders: any[], targetId: string, path: any[] = []): any[] | null => {
    for (const folder of folders) {
      if (folder.id === targetId) {
        return path
      }
      if (folder.folders) {
        const found = findParentPath(folder.folders, targetId, [...path, { id: folder.id, title: folder.title }])
        if (found) return found
      }
    }
    return null
  }

  const res = []
  let path: Folder[] = []

  if (params.currentFolderId) { // If a folder is specified, navigate through the folder structure
    const findFolder = (folders: any[], targetId: string): any => {
      for (const folder of folders) {
        if (folder.id === targetId) {
          return folder
        }
        if (folder.folders) {
          const found = findFolder(folder.folders, targetId)
          if (found) return found
        }
      }
      return null
    }

    // Get parent path for current folder
    const parentPath = findParentPath(filterData || [], params.currentFolderId) || []
    const currentFolder = findFolder(filterData || [], params.currentFolderId)

    // Include parents and current folder in path
    path = [...parentPath]
    if (currentFolder) {
      path.push({ id: currentFolder.id, title: currentFolder.title, type: 'folder' })
    }

    const targetFolder = findFolder(filterData || [], params.currentFolderId)
    if (targetFolder) {
      for (const subFolder of targetFolder.folders || []) {
        res.push({
          id: subFolder.id,
          title: subFolder.title,
          type: 'folder'
        })
      }
      for (const resource of targetFolder.resources || []) {
        res.push(resource)
      }
    }
  } else {
    for (const subFolder of filterData || []) {
      res.push({
        id: subFolder.id,
        title: subFolder.title,
        type: 'folder'
      })
    }
  }

  return {
    count: res.length,
    results: res,
    path
  }
}

const getResource = async (catalogConfig: MockConfig, resourceId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const findResourceById = (folders: any[], targetId: string): any => {
    for (const folder of folders) {
      // Check resources in current folder
      if (folder.resources) {
        const resource = folder.resources.find((r: any) => r.id === targetId)
        if (resource) return resource
      }

      // Check subfolders recursively
      if (folder.folders) {
        const found = findResourceById(folder.folders, targetId)
        if (found) return found
      }
    }
    return null
  }

  return findResourceById(folders, resourceId)
}

const downloadResource = async ({ catalogConfig, resourceId, importConfig, tmpDir }: DownloadResourceContext<MockConfig>) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  // First check if the resource exists
  const resource = await getResource(catalogConfig, resourceId)
  if (!resource) {
    return undefined
  }

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
  'import' as const,
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
