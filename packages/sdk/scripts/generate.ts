import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve } from 'path'

const execAsync = promisify(exec)

const specPath = resolve(__dirname, '../../api-spec/openapi.yaml')
const outputPath = resolve(__dirname, '../src/generated/types.ts')

async function generate() {
  console.log('Generating types from OpenAPI spec...')
  await execAsync(`npx openapi-typescript "${specPath}" -o "${outputPath}"`)
  console.log('✓ Generated packages/sdk/src/generated/types.ts')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
