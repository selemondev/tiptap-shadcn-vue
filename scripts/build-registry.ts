// Credits go to Shadcn UI and Shadcn Vue
// Modified by Selemondev

import type { z } from 'zod'
import type { Registry, registryItemTypeSchema } from '../registry/schema'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { registry } from '../registry'
import { registryEntrySchema, registrySchema } from '../registry/schema'
import { buildRegistry as crawlContent } from './registry-content'

const REGISTRY_PATH = path.join(process.cwd(), 'public/r')

const REGISTRY_INDEX_WHITELIST: z.infer<typeof registryItemTypeSchema>[] = [
  'registry:ui',
]

async function buildStyles(registry: Registry) {
  const targetPath = path.join(REGISTRY_PATH)

  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true })
  }

  for (const item of registry) {
    if (!REGISTRY_INDEX_WHITELIST.includes(item.type))
      continue

    let files
    if (item.files) {
      files = await Promise.all(
        item.files.map(async (_file) => {
          const file = {
            path: _file.path,
            type: _file.type,
            content: '',
            target: _file.target ?? '',
          }

          let content: string
          try {
            content = await fs.readFile(
              path.join(process.cwd(), 'app', 'components', file.path),
              'utf8',
            )
          }
          catch (error) {
            console.error(error)
            return
          }

          const target = file.target || ''

          return {
            path: file.path,
            type: file.type,
            content,
            target,
          }
        }),
      )
    }

    const payload = registryEntrySchema
      .omit({
        category: true,
        subcategory: true,
      })
      .safeParse({
        ...item,
        files,
      })

    if (payload.success) {
      await writeFile(
        path.join(targetPath, `${item.name}.json`),
        JSON.stringify(payload.data, null, 2),
      )
    }
  }
}

try {
  if (!existsSync(REGISTRY_PATH)) {
    await fs.mkdir(REGISTRY_PATH, { recursive: true })
  }

  const content = await crawlContent()
  const result = registrySchema.safeParse([...registry, ...content])

  if (!result.success) {
    console.error(result.error)
    process.exit(1)
  }

  await buildStyles(result.data)

  console.log('✅ Done!')
}
catch (error) {
  console.error(error)
  process.exit(1)
}

async function writeFile(path: string, payload: any) {
  return fs.writeFile(path, `${payload}\r\n`, 'utf8')
}
