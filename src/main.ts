import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import parse from 'parse-gitignore'

async function run(): Promise<void> {
  const workingDir = process.cwd()

  const envFileExists = fs.existsSync(path.join(workingDir, '.env'))
  if (envFileExists) {
  }

  const gitignorePath = path.join(workingDir, '.gitignore')

  const gitignoreFile = fs.readFileSync(gitignorePath)

  const parsedGitignore = parse(gitignoreFile.toString())
  const patterns = (parsedGitignore as unknown as {patterns: string[]}).patterns

  const gitignoreHasEnv = patterns.includes('.env')

  const exampleFileExists = fs.existsSync(path.join(workingDir, '.env.example'))
  if (!exampleFileExists) {
  }

  await core.summary
    .addHeading('Env Check')
    .addTable([
      [
        {header: true, data: 'first'},
        {header: true, data: 'second'}
      ],
      [{data: 'first'}, {data: 'second'}]
    ])
    .write()
}

run()
