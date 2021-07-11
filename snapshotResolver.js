module.exports = {
    // resolves from test to snapshot path
    resolveSnapshotPath: (testPath, snapshotExtension) =>
      testPath.replace('src', '__snapshots__') + snapshotExtension,
  
    // resolves from snapshot to test path
    resolveTestPath: (snapshotFilePath, snapshotExtension) =>
      snapshotFilePath
        .replace('__snapshots__', 'src')
        .slice(0, -snapshotExtension.length),
  
    // Example test path, used for preflight consistency check of the implementation above
    testPathForConsistencyCheck: 'src/components/settings/settings-navigator.spec.tsx',
  };