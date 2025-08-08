import type { CatalogPlugin, ListResourcesContext, Folder, GetResourceContext } from '@data-fair/types-catalogs'
import type { MockConfig } from '#types'
import type { MockCapabilities } from './capabilities.ts'

export const listResources = async ({ catalogConfig, secrets, params }: ListResourcesContext<MockConfig, MockCapabilities>): ReturnType<CatalogPlugin['listResources']> => {
  await new Promise(resolve => setTimeout(resolve, catalogConfig.delay)) // Simulate a delay for the mock plugin

  const tree = (await import('./resources/resources-mock.ts')).default

  /**
   * Extracts folders and resources for a given parent/folder ID
   * @param resources - The resources object containing folders and resources
   * @param targetId - The parent ID for folders or folder ID for resources (undefined for root level)
   * @returns Array of folders and resources matching the criteria
   */
  const getFoldersAndResources = (targetId: string | undefined) => {
    const folders = Object.keys(tree.folders).reduce((acc: Folder[], key) => {
      if (tree.folders[key].parentId !== targetId) return acc // Skip folders that are not under the targetId
      acc.push({
        id: key,
        title: tree.folders[key].title,
        type: 'folder'
      })
      return acc
    }, [])

    // In the mock plugin, we assume that resources are always under a folder
    if (!targetId) return folders

    const resources = tree.folders[targetId]?.resourceIds.reduce((acc: Awaited<ReturnType<CatalogPlugin['listResources']>>['results'], resourceId) => {
      const resource = tree.resources[resourceId]
      if (!resource) return acc // Skip if resource not found

      acc.push({
        id: resourceId,
        title: resource.title,
        description: resource.description + '\n\n' + secrets.secretField, // Include the secret in the description for demonstration
        format: resource.format,
        mimeType: resource.mimeType,
        origin: resource.origin,
        size: resource.size,
        type: 'resource'
      })
      return acc
    }, [])

    return [...folders, ...resources]
  }

  const path: Folder[] = []
  let res = getFoldersAndResources(params.currentFolderId)
  // Get total count before search and pagination
  const totalCount = res.length

  // Apply search filter if provided
  if (params.q && catalogConfig.searchCapability) {
    const searchTerm = params.q.toLowerCase()
    res = res.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      ('description' in item && item.description?.toLowerCase().includes(searchTerm))
    )
  }

  if (catalogConfig.paginationCapability && params.page && params.size) {
    // Apply pagination
    const size = params.size || 20
    const page = params.page || 0
    const skip = (page - 1) * size
    res = res.slice(skip, skip + size)
  }

  // Get path to current folder if specified
  if (params.currentFolderId) {
    // Get current folder
    const currentFolder = tree.folders[params.currentFolderId]
    if (!currentFolder) throw new Error(`Folder with ID ${params.currentFolderId} not found`)

    // Get path to current folder (parents folders)
    let parentId = currentFolder.parentId
    while (parentId) {
      const parentFolder = tree.folders[parentId]
      if (!parentFolder) throw new Error(`Parent folder with ID ${parentId} not found`)

      // Add the parent to the start of the list to avoid reversing the path later
      path.unshift({
        id: parentId,
        title: parentFolder.title,
        type: 'folder'
      })
      parentId = parentFolder.parentId
    }

    // Add the current folder to the path
    path.push({
      id: params.currentFolderId,
      title: currentFolder.title,
      type: 'folder'
    })
  }

  return {
    count: totalCount,
    results: res,
    path
  }
}

export const getResource = async ({ catalogConfig, secrets, resourceId, importConfig, tmpDir, log }: GetResourceContext<MockConfig>): ReturnType<CatalogPlugin['getResource']> => {
  await log.info(`Downloading resource ${resourceId}`, { catalogConfig, secrets, importConfig })

  // Simulate a delay for the mock plugin
  await log.task('delay', 'Simulate delay for mock plugin (Response Delay * 10) ', catalogConfig.delay * 10)
  for (let i = 0; i < catalogConfig.delay * 10; i += catalogConfig.delay) {
    await new Promise(resolve => setTimeout(resolve, catalogConfig.delay))
    await log.progress('delay', i + catalogConfig.delay)
  }

  // Validate the importConfig
  await log.step('Validate import configuraiton')
  const { returnValid } = await import('#type/importConfig/index.ts')
  returnValid(importConfig)
  await log.info('Import configuration is valid', { importConfig })

  // First check if the resource exists
  const resources = (await import('./resources/resources-mock.ts')).default
  const resource = resources.resources[resourceId]
  if (!resource) { throw new Error(`Resource with ID ${resourceId} not found`) }

  // Import necessary modules dynamically
  const fs = await import('node:fs/promises')
  const path = await import('node:path')

  await log.step('Download resource file')
  await log.warning('This task can take a while, please be patient')
  // Simulate downloading by copying a dummy file with limited rows
  const sourceFile = path.join(import.meta.dirname, 'resources', 'dataset-mock.csv')
  const destFile = path.join(tmpDir, 'dataset-mock.csv')
  const data = await fs.readFile(sourceFile, 'utf8')

  // Limit the number of rows to importConfig.nbRows (Header excluded)
  const lines = data.split('\n').slice(0, importConfig.nbRows + 1).join('\n')
  await fs.writeFile(destFile, lines, 'utf8')
  await log.info(`${importConfig.nbRows} rows downloaded`)

  await log.step('End of resource download')
  await log.info(`Resource ${resourceId} downloaded successfully`)
  await log.warning('This is a mock resource, the file is not real and does not contain real data.')
  await log.error('Example of an error log for demonstration purposes.')

  const attachments = []
  if (importConfig.importAttachments) {
    // Copy thumbnail to the tmpDir if it exists
    const thumbnailSource = path.join(import.meta.dirname, 'resources', 'thumbnail.svg')
    const thumbnailDest = path.join(tmpDir, 'thumbnail.svg')
    await fs.copyFile(thumbnailSource, thumbnailDest)
    await log.info(`Thumbnail downloaded to ${thumbnailDest}`)
    attachments.push(
      {
        title: 'Mock Attachment',
        description: 'This is a mock attachment',
        url: 'https://example.com/mock-attachment'
      })
    attachments.push({
      title: 'Another Mock Attachment',
      description: 'This is another mock attachment',
      filePath: thumbnailDest
    })
  } else {
    await log.warning('Attachments import is disabled, no attachments will be imported.')
  }

  return {
    id: resourceId,
    ...resource,
    description: resource.description + '\n\n' + secrets.secretField, // Include the secret in the description for demonstration
    filePath: destFile,
    frequency: 'monthly',
    image: 'https://koumoul.com/data-fair-portals/api/v1/portals/8cbc8974-2fd2-46aa-b328-804600dc840f/assets/logo',
    license: {
      href: 'https://www.etalab.gouv.fr/wp-content/uploads/2014/05/Licence_Ouverte.pdf',
      title: 'Licence Ouverte / Open Licence'
    },
    keywords: ['mock', 'example', 'data'],
    origin: 'https://example.com/mock',
    attachments
  }
}
