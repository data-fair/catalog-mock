import type { Metadata } from '@data-fair/types-catalogs'

const i18n: Metadata['i18n'] = {
  en: {
    description: 'This catalog allows testing the service by simulating a folder and file structure.',
    actionLabels: {
      createResource: 'Create file',
      replaceResource: 'Replace file'
    },
    actionButtons: {
      createResource: 'Create file here',
      replaceResource: 'Replace file'
    },
    stepTitles: {
      replaceResource: 'File to replace selection'
    }
  },
  fr: {
    description: 'Ce catalogue permet de tester le service en simulant une arborescence de dossiers et de fichiers.',
    actionLabels: {
      createResource: 'Créer un fichier',
      replaceResource: 'Remplacer un fichier'
    },
    actionButtons: {
      createResource: 'Créer le fichier ici',
      replaceResource: 'Remplacer le fichier'
    },
    stepTitles: {
      replaceResource: 'Sélection du fichier à remplacer'
    }
  }
}

export default i18n
