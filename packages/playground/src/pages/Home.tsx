import { Navigator } from 'react-mobile-router'

import { useTracker } from '../hooks/useTracker'

const HomePage = () => {
  useTracker('Home')

  return (
    <div className='home-page'>
      Caveats for Project References Project references have a few trade-offs
      you should be aware of. Because dependent projects make use of .d.ts files
      that are built from their dependencies, you’ll either have to check in
      certain build outputs or build a project after cloning it before you can
      navigate the project in an editor without seeing spurious errors. When
      using VS Code (since TS 3.7) we have a behind-the-scenes in-memory .d.ts
      generation process that should be able to mitigate this, but it has some
      perf implications. For very large composite projects you might want to
      disable this using disableSourceOfProjectReferenceRedirect option.
      Additionally, to preserve compatibility with existing build workflows, tsc
      will not automatically build dependencies unless invoked with the --build
      switch. Let’s learn more about --build. Build Mode for TypeScript A
      long-awaited feature is smart incremental builds for TypeScript projects.
      In 3.0 you can use the --build flag with tsc. This is effectively a new
      entry point for tsc that behaves more like a build orchestrator than a
      simple compiler. Running tsc --build (tsc -b for short) will do the
      following: Find all referenced projects Detect if they are up-to-date
      Build out-of-date projects in the correct order You can provide tsc -b
      with multiple config file paths (e.g. tsc -b src test). Just like tsc -p,
      specifying the config file name itself is unnecessary if it’s named
      tsconfig.json.
      <br />
      <br />
      <Navigator name='list'>前往列表页</Navigator>
    </div>
  )
}

export default HomePage
