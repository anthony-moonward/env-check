import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import parse from 'parse-gitignore'

async function run(): Promise<void> {
  const workingDir = process.cwd()

  const envFileExists = fs.existsSync(path.join(workingDir, '.env'))

  const gitignorePath = path.join(workingDir, '.gitignore')

  const gitignoreFile = fs.readFileSync(gitignorePath)

  const parsedGitignore = parse(gitignoreFile.toString())
  const patterns = (parsedGitignore as unknown as {patterns: string[]}).patterns

  const gitignoreHasEnv = patterns.includes('.env')

  const exampleFileExists = fs.existsSync(path.join(workingDir, '.env.example'))
  if (envFileExists || !gitignoreHasEnv || !exampleFileExists) {
    core.setFailed('Invalid .env configuration')
  }

  await core.summary
    .addHeading('Env Check')
    .addTable([
      [
        {header: true, data: 'Check'},
        {header: true, data: 'Passed'}
      ],
      [
        {data: 'No .env in project'},
        {data: `${envFileExists ? ':x: Fail' : ':white_check_mark: Pass'}`}
      ],
      [
        {data: '.gitignore contains .env'},
        {data: `${gitignoreHasEnv ? ':white_check_mark: Pass' : ':x: Fail'}`}
      ],
      [
        {data: '.env.example exists'},
        {data: `${exampleFileExists ? ':white_check_mark: Pass' : ':x: Fail'}`}
      ]
    ])
    .write()
}

run()
