const packageJson = require('./package.json');

const hgDependencies = (() => {
  if (packageJson.hgDependencies) {
    return packageJson.hgDependencies;
  }

  if (packageJson.devDependencies) {
    return Object.keys(packageJson.devDependencies)
      .filter(dependency => dependency.indexOf('higlass') === 0)
      .reduce((dependencies, dependency) => {
        dependencies[dependency] = packageJson.devDependencies[dependency];
        return dependencies;
      }, {});
  }

  if (packageJson.dependencies) {
    return Object.keys(packageJson.dependencies)
      .filter(dependency => dependency.indexOf('higlass') === 0)
      .reduce((dependencies, dependency) => {
        dependencies[dependency] = packageJson.dependencies[dependency];
        return dependencies;
      }, {});
  }

  return {};
})();

const VERSION = JSON.stringify(packageJson.version);
const DEPENDENCIES = JSON.stringify(hgDependencies);

module.exports = { VERSION, DEPENDENCIES };
