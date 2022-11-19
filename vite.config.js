export default {
  build: {
    assetsInlineLimit: 0
  },
  define: {
    __GAME_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  base: ''
}
