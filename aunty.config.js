const path = require('path');
const fs = require('fs');

const includedDependencies = [/carbon-/, /jtfell-/];
const getLoaderDefinition = (config, testSourceMatch, loaderMatch) =>
  config.module.rules
    .find(({ test }) => test.source.indexOf(testSourceMatch) > -1)
    .use.find(({ loader }) => loader.indexOf(loaderMatch || testSourceMatch) > -1);

module.exports = {
  type: 'svelte',
  build: {
    // extractCSS: true,
    includedDependencies,
    entry: [
      "index",
      "embed",
      "odyssey",
      "googledoc"
    ],
  },
  webpack: config => {
    // De-dupe svelte
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      svelte: path.resolve('node_modules', 'svelte')
    };

    // Disable dart-sass warnings
    getLoaderDefinition(config, 'scss', 'sass').options = { sassOptions: { quietDeps: true } };

    // Disable svelte warnings when compiling dependencies
    getLoaderDefinition(config, 'svelte').options.onwarn = (warning, handler) => {
      for (const pattern of includedDependencies) {
        if (pattern.test(warning.filename)) {
          return;
        }
      }

      handler(warning);
    };

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    },
    config => {
      fs.writeFileSync(
        path.join(__dirname, 'redirect', 'index.js'),
        `window.location = String(window.location).replace('/latest/', '/${config.id}/')`
      );

      return {
        ...config,
        from: 'redirect',
        to: '/www/res/sites/news-projects/<name>/latest'
      };
    }
  ]
};
