import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Root of the local HRD-AI checkout used by the launcher and Host plugin. */
export const hrdAiRoot = resolve(process.env.HRD_AI_ROOT || fileURLToPath(new URL('../../hrd-ai---/', import.meta.url)))
