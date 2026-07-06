# Demo app — multi-layer-radial-chart-native

An [Expo](https://expo.dev) app that showcases the library: activity rings with a
count-up center, live controls, gradients, overflow laps, goal markers, a gauge,
and dashed patterns. It imports the library **directly from `../src`**, so any
edit to the library hot-reloads here without a rebuild.

## Run it

```sh
cd example
npm install
npm run start      # then press "a" (Android), "i" (iOS), or "w" (web)
# or: npm run android | npm run ios | npm run web
```

Open it on your phone with the **Expo Go** app by scanning the QR code, or in an
emulator/simulator.

## How the linking works

- `metro.config.js` watches the repo root and forces `react`, `react-native`, and
  `react-native-svg` to resolve to a **single copy** (the example's), avoiding the
  "two copies of React" / invalid-hook-call error.
- `babel.config.js` aliases the package name to the library's TypeScript source
  (`../src`) via `babel-plugin-module-resolver`.

If you'd rather test the **published/built** package instead of the source,
remove the alias in `babel.config.js` and add
`"multi-layer-radial-chart-native": "file:.."` to this app's dependencies.
