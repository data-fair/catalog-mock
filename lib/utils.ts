import type { CatalogDataset } from '@data-fair/lib-common-types/catalog/index.js'

export const allDatasets: CatalogDataset[] = [
  {
    id: 'dataset-feline-behavior',
    title: 'Comportements des félins domestiques - MeowCity',
    description: "Le comportement des félins domestiques illustré dans cette étude comporte dix catégories caractérisant :\n\n* des comportements distincts\n* et des aires de jeux préférées. \n\n**Contexte de collecte**\nDécoulant des observations du Plan Félin, la carte des comportements exprime les habitudes des chats dans les espaces à aménager ou à transformer et confirme celles des espaces déjà établis.\n\nInclusives, les catégories de comportements favorisent la diversité et regroupent une variété d'activités pouvant avoir cours dans une même aire de jeu, moyennant des règles de cohabitation que précisent les recommandations adoptées par les propriétaires.\n\n**Méthode de collecte**\nSelon l'approche retenue, les catégories traduisent la nature générale des comportements, s'éloignant ainsi d'une forme d'analyse dont le caractère trop normatif conduirait à une catégorisation inutilement complexe. \n\n**Attributs**\n| Champ | Alias | Type |\n| --- | --- | --- |\n| `categorie` | Catégorie de comportement félin | `varchar` |\n\nPour plus d'informations, consultez [la métadonnée sur le catalogue CatIpsum](https://catipsum.example.com/catalog/feline-data).",
    keywords: [
      'comportement',
      'plan-félin',
      'meow-city',
      'habitudes-des-chats',
      'éthologie'
    ],
    origin: 'https://catipsum.example.com/datasets/feline-behavior',
    private: true,
    resources: [
      {
        id: 'dataset-feline-behavior-csv',
        title: 'Comportements_Felins_2023',
        format: 'csv',
        fileName: 'Comportements_Felins_2023.csv',
        url: 'https://data.catipsum.example.com/datasets/feline/behavior?format=csv',
        mimeType: 'text/csv',
        size: 1234567,
      },
      {
        id: 'dataset-feline-behavior-shapefile',
        title: 'Comportements_Felins_2023',
        format: 'shapefile',
        fileName: 'Comportements_Felins_2023.shp',
        url: 'https://data.catipsum.example.com/datasets/feline/behavior?format=shapefile',
        mimeType: 'application/octet-stream',
        size: 12345678,
      }
    ]
  },
  {
    id: 'dataset-hunting-paths',
    title: 'Parcours de chasse nocturne - MeowCity',
    description: "Ensemble de données contenant les informations géospatiales des tracés des parcours de chasse nocturne des chats domestiques de MeowCity.\n\n**Méthode de collecte**\nLes parcours (tracks.txt) contenus dans le fichier GPS des colliers félins sont disponibles en format shapefile de façon à faciliter l'intégration dans les systèmes d'information géospatiaux (SIG).\n\n**Attributs**\n| Champ | Alias | Type |\n| --- | --- | --- |\n| `cat_id` |  | `long` |\n| `owner_id` |  | `varchar` |\n| `path_short` |  | `long` |\n| `path_long` |  | `varchar` |\n| `path_type` |  | `long` |\n| `path_url` |  | `varchar` |\n| `path_color` |  | `varchar` |\n| `path_text` |  | `long` |\n\nPour plus d'informations, consultez [la métadonnée sur le catalogue CatIpsum](https://catipsum.example.com/catalog/hunting-paths).",
    keywords: [
      'chasse-nocturne',
      'félin',
      'meow-city',
      'comportement'
    ],
    origin: 'https://catipsum.example.com/datasets/hunting-paths',
    resources: [
      {
        id: 'dataset-hunting-paths-csv',
        title: 'Feline_Hunting_Paths',
        format: 'csv',
        url: 'https://data.catipsum.example.com/datasets/hunting/paths?format=csv',
      },
      {
        id: 'dataset-hunting-paths-shapefile',
        title: 'Feline_Hunting_Paths',
        format: 'shapefile',
        url: 'https://data.catipsum.example.com/datasets/hunting/paths?format=shapefile',
        mimeType: 'application/octet-stream'
      },
      {
        id: 'dataset-hunting-paths-geojson',
        title: 'Feline_Hunting_Paths',
        format: 'geojson',
        url: 'https://data.catipsum.example.com/datasets/hunting/paths?format=geojson',
        mimeType: 'application/geo+json'
      }
    ]
  }
]
