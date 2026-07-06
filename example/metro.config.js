const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");
const escape = require("escape-string-regexp");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const pkg = require("../package.json");

const root = path.resolve(__dirname, "..");

const config = getDefaultConfig(__dirname);

// Watch the library source so changes hot-reload in the example.
config.watchFolders = [root];

// The library's peer deps must resolve to a single copy (the example's), or
// React Native throws "Invalid hook call" / "two copies of React".
// `react-native-web` is added too: on web, babel-plugin-react-native-web
// rewrites the library's `react-native` imports (in ../src) to deep
// `react-native-web/...` paths, which must resolve to the example's copy.
const modules = [...Object.keys({ ...pkg.peerDependencies }), "react-native-web"];

config.resolver.blockList = exclusionList(
	modules.map(
		(name) => new RegExp(`^${escape(path.join(root, "node_modules", name))}\\/.*$`),
	),
);

config.resolver.extraNodeModules = modules.reduce((acc, name) => {
	acc[name] = path.join(__dirname, "node_modules", name);
	return acc;
}, {});

module.exports = config;
