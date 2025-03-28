const path = require('path');
const fs = require('fs');

const includedDependencies = ['carbon-components-svelte', /@abcnews\/svelte-scrollyteller/];
const getLoaderDefinition = (config, testSourceMatch, loaderMatch) =>
  config.module.rules
    .find(({ test }) => test?.source.indexOf(testSourceMatch) > -1)
    .use.find(({ loader }) => loader.indexOf(loaderMatch || testSourceMatch) > -1);

module.exports = {
  type: 'svelte',
  build: {
    includedDependencies,
    entry: ['index', 'builder']
  },
  webpack: config => {
    // Disable dart-sass warnings
    getLoaderDefinition(config, 'scss', 'sass').options = { sassOptions: { quietDeps: true } };

    // config.compilerOptions = {
    //   ...config.compilerOptions,
    //    // disable all warnings coming from node_modules and all accessibility warnings
    // };
    // <!-- svelte-ignore a11y_interactive_supports_focus -->
    // getLoaderDefinition(config, 'svelte').compilerWarnings = {
    //   'a11y_interactive_supports_focus': 'ignore',
    // };

    // Disable svelte warnings when compiling dependencies
    getLoaderDefinition(config, 'svelte').options.compilerOptions = {
      warningFilter: (warning) => {
        console.log(warning);
        for (const pattern of includedDependencies) {
          if (pattern.test(warning.filename)) {
            return false;
          }
        }
        if (!warning.filename?.includes('node_modules') && !warning.code.startsWith('a11y')) {
          return false;
        }

        return true;
      }
    };

    // getLoaderDefinition(config, 'svelte').options.compilerOptions = {
    //   warningFilter: (warning) => !warning.filename?.includes('node_modules') && !warning.code.startsWith('a11y')
    // };
    // console.log(getLoaderDefinition(config, 'svelte'));

    // Fix for carbon components import paths
    config.module.rules[0].resolve = { fullySpecified: false };

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    }
  ]
};
