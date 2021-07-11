const {resolve} = require('path');

module.exports = {
  preset: 'react-native',
  transform: {
    '\\.(js|ts|tsx)$': require.resolve('react-native/jest/preprocessor.js'),
  },
  // this is specific to the Jest repo, not generally needed (the files we ignore will be in node_modules which is ignored by default)
  transformIgnorePatterns: ['node_modules/@ui-kitten'],
  setupFiles: ["./jestSetupFile.js"],
  snapshotResolver: "./snapshotResolver.js"
};