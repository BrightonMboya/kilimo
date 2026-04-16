const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Create the default Metro config
const config = getDefaultConfig(projectRoot);

// Add import aliases
config.resolver.alias = {
  "~": path.resolve(projectRoot, "src"),
};

// Add the additional `cjs` extension to the resolver
config.resolver.sourceExts.push("cjs");

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Ensure a single copy of React is used across the app and all workspace packages.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react" || moduleName === "react-dom" || moduleName === "react-native") {
    return {
      filePath: require.resolve(moduleName, { paths: [projectRoot] }),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
