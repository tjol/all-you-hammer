import './style.css'

window.onload = () => {
  const width = Math.min(window.innerWidth, 1024)
  const height = width
  const gameFrame = document.createElement('iframe')
  gameFrame.setAttribute('width', width)
  gameFrame.setAttribute('height', height)
  gameFrame.setAttribute('frameborder', '0')
  gameFrame.setAttribute('scrolling', 'no')
  gameFrame.setAttribute('src', 'game.html')

  document.getElementById('app').appendChild(gameFrame)

  console.log(`Loading version ${__GAME_VERSION__}`)
  document.getElementById('version-nr').innerText = __GAME_VERSION__
}
