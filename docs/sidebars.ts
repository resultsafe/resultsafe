import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: { type: 'doc', id: 'introduction/01-overview' },
      items: [
        'introduction/01-overview',
        'introduction/02-installation',
        'introduction/03-quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: { type: 'doc', id: 'guides/index' },
      items: ['guides/index', 'guides/basic-usage'],
    },
    {
      type: 'category',
      label: 'Patterns',
      link: { type: 'doc', id: 'patterns/index' },
      items: ['patterns/index'],
    },
    {
      type: 'category',
      label: 'Examples',
      link: { type: 'doc', id: 'examples/index' },
      items: [
        'examples/index',
        {
          type: 'category',
          label: 'Quick Start',
          link: { type: 'doc', id: 'examples/00-quick-start/index' },
          items: [
            'examples/00-quick-start/index',
            'examples/00-quick-start/001-hello-world/example',
            'examples/00-quick-start/002-basic-usage/example',
            'examples/00-quick-start/003-error-handling/example',
            'examples/00-quick-start/004-chaining/example',
          ],
        },
        {
          type: 'category',
          label: 'API Reference',
          link: { type: 'doc', id: 'examples/01-api-reference/index' },
          items: [
            'examples/01-api-reference/index',
            {
              type: 'category',
              label: 'Constructors',
              items: [
                'examples/01-api-reference/01-constructors/01-ok/001-basic-usage/example',
                'examples/01-api-reference/01-constructors/01-ok/002-with-generics/example',
                'examples/01-api-reference/01-constructors/01-ok/003-real-world/example',
                'examples/01-api-reference/01-constructors/02-err/001-basic-usage/example',
                'examples/01-api-reference/01-constructors/02-err/002-with-custom-error/example',
                'examples/01-api-reference/01-constructors/02-err/003-real-world/example',
              ],
            },
            {
              type: 'category',
              label: 'Guards',
              items: [
                'examples/01-api-reference/02-guards/01-is-ok/001-basic-usage/example',
                'examples/01-api-reference/02-guards/02-is-err/001-basic-usage/example',
                'examples/01-api-reference/02-guards/03-is-ok-and/001-basic-usage/example',
                'examples/01-api-reference/02-guards/04-is-err-and/001-basic-usage/example',
              ],
            },
            {
              type: 'category',
              label: 'Methods',
              items: [
                'examples/01-api-reference/03-methods/01-transformation/01-map/001-basic-usage/example',
                'examples/01-api-reference/03-methods/01-transformation/02-map-err/001-basic-usage/example',
                'examples/01-api-reference/03-methods/02-chaining/01-and-then/001-basic-usage/example',
                'examples/01-api-reference/03-methods/02-chaining/02-or-else/001-basic-usage/example',
                'examples/01-api-reference/03-methods/03-extraction/01-unwrap/001-basic-usage/example',
                'examples/01-api-reference/03-methods/03-extraction/02-unwrap-or/002-basic/example',
                'examples/01-api-reference/03-methods/03-extraction/03-expect/003-basic/example',
                'examples/01-api-reference/03-methods/03-extraction/04-unwrap-err/004-basic/example',
                'examples/01-api-reference/03-methods/03-extraction/05-expect-err/005-basic/example',
                'examples/01-api-reference/03-methods/03-extraction/06-unwrap-or-else/006-basic/example',
                'examples/01-api-reference/03-methods/04-side-effects/01-tap/001-basic-usage/example',
                'examples/01-api-reference/03-methods/04-side-effects/02-tap-err/002-basic/example',
                'examples/01-api-reference/03-methods/04-side-effects/03-inspect/003-basic/example',
                'examples/01-api-reference/03-methods/04-side-effects/04-inspect-err/004-basic/example',
                'examples/01-api-reference/03-methods/05-advanced/01-match/001-basic-usage/example',
                'examples/01-api-reference/03-methods/05-advanced/02-flatten/002-basic/example',
                'examples/01-api-reference/03-methods/05-advanced/03-transpose/003-basic/example',
                'examples/01-api-reference/03-methods/05-advanced/04-ok/004-basic/example',
                'examples/01-api-reference/03-methods/05-advanced/05-err/005-basic/example',
              ],
            },
            {
              type: 'category',
              label: 'Refiners',
              items: [
                'examples/01-api-reference/04-refiners/01-is-typed-variant/001-basic-usage/example',
                'examples/01-api-reference/04-refiners/02-is-typed-variant-of/002-basic/example',
                'examples/01-api-reference/04-refiners/03-match-variant/003-basic/example',
                'examples/01-api-reference/04-refiners/04-match-variant-strict/004-basic/example',
                'examples/01-api-reference/04-refiners/05-refine-result/005-basic/example',
                'examples/01-api-reference/04-refiners/06-refine-result-u/006-basic/example',
                'examples/01-api-reference/04-refiners/07-refine-async-result/007-basic/example',
                'examples/01-api-reference/04-refiners/08-refine-async-result-u/008-basic/example',
                'examples/01-api-reference/04-refiners/09-refine-variant-map/009-basic/example',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Patterns',
          link: { type: 'doc', id: 'examples/02-patterns/index' },
          items: [
            'examples/02-patterns/index',
            'examples/02-patterns/01-async/001-basics/example',
            'examples/02-patterns/01-async/002-concurrent/example',
            'examples/02-patterns/01-async/003-streams/example',
            'examples/02-patterns/02-http/001-api-client/example',
            'examples/02-patterns/02-http/002-web-scraping/example',
            'examples/02-patterns/03-validation/001-validation/example',
            'examples/02-patterns/04-error-handling/001-error-recovery/example',
            'examples/02-patterns/05-events/001-event-handling/example',
            'examples/02-patterns/06-workers/001-worker-pool/example',
          ],
        },
      ],
    },
  ],
  apiSidebar: [
    {
      type: 'category',
      label: '@resultsafe/core-fp-result',
      link: { type: 'doc', id: 'api/core-fp-result/index' },
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
