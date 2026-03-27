import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: {
        type: 'doc',
        id: 'introduction/01-overview',
      },
      items: [
        'introduction/01-overview',
        'introduction/02-installation',
        'introduction/03-quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'doc',
        id: 'guides/index',
      },
      items: [
        'guides/index',
        'guides/basic-usage',
      ],
    },
    {
      type: 'category',
      label: 'Patterns',
      link: {
        type: 'doc',
        id: 'patterns/index',
      },
      items: [
        'patterns/index',
      ],
    },
  ],
  
  apiSidebar: [
    {
      type: 'category',
      label: '@resultsafe/core-fp-result',
      link: {
        type: 'doc',
        id: 'api/core-fp-result/index',
      },
      items: [
        {
          type: 'category',
          label: 'Constructors',
          items: [
            'api/core-fp-result/constructors/Ok',
            'api/core-fp-result/constructors/Err',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
