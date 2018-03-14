# react-native-drawer-layout-polyfill [![CircleCI](https://circleci.com/gh/react-native-community/react-native-drawer-layout-polyfill/tree/master.svg?style=svg)](https://circleci.com/gh/react-native-community/react-native-drawer-layout-polyfill/tree/master)

This is a polyfill for [React Natives `DrawerLayoutAndroid`](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html), please refer to this documentation for the usage.

## Add it to your project

1. Run `npm install react-native-drawer-layout-polyfill --save`
2. Import the component by using one of these:
  - `var DrawerLayout = require('react-native-drawer-layout-polyfill');`
  - `import DrawerLayout from 'react-native-drawer-layout-polyfill';`
3. Follow the [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#content) docs -- the API is the same.

## Demo

![](https://raw.githubusercontent.com/react-native-community/react-native-drawer-layout-polyfill/master/example.gif)

## Examples

- [Normal usage](https://github.com/DanielMSchmidt/DrawerLayoutPolyfillExample)


## Restrictions

- Currently, there is no support for setting the status bar color in iOS. If you know any workaround, we would be glad to see an idea or a PR.

If you experience any further restrictions with other versions, please let us know.

## Release Notes

### 1.0

- Moved from [`react-native-drawer-layout`](https://github.com/react-native-community/react-native-drawer-layout)
