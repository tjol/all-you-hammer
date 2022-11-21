import { resolve } from 'path'

export default {
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'game.html')
      }
    }
  },
  define: {
    __GAME_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  base: ''
}
