export default {
  build: {
    assetsInlineLimit: 0
  },
  define: {
    GAME_VERSION: JSON.stringify(process.env.npm_package_version)
  }
}
