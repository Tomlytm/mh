// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver for react-native-vector-icons
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-vector-icons': 'react-native-vector-icons',
};

module.exports = config;
