import fs from 'fs'
import glob from 'glob'
import { transform } from '@babel/core'

const dist = 'dist/'
const files = glob
  .sync(dist + '**/*.js')
  .map(f => ({
    name: f.slice(f.lastIndexOf('/') + 1, f.indexOf('.')),
    path: f.slice(f.indexOf(dist) + dist.length, f.indexOf('.')),
  }))

const index = `${
  files.map(
    f => `import ${f.name} from './${f.path}'`
  ).join('\n')
}

export default {
${
  files.map(f => `  ${f.name},`).join('\n')
}
}
`

fs.writeFileSync(dist + 'index.js',
  transform(index, { extends: './.babelrc' }).code
)
;[
  'package.json'
].forEach(
  f => fs.copyFileSync('./' + f, dist + f)
)
