import appPaths from '../lib/utils/app-paths'

const config = {...appPaths,
  ...{
    port: process.env.PORT || 3000
  }
}

export default config
