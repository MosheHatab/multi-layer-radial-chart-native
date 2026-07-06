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
const modules = Object.keys({ ...pkg.peerDependencies });

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
