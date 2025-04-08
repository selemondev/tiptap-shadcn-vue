import type { Registry } from './schema'

export const lib: Registry = [
  {
    name: 'utils',
    type: 'registry:lib',
    dependencies: ['clsx', 'tailwind-merge', '@atlaskit/pragmatic-drag-and-drop', '@atlaskit/pragmatic-drag-and-drop-hitbox', '@iconify/vue'],
    files: [
      {
        path: 'lib/utils.ts',
        type: 'registry:lib',
      },
    ],
  },
]
