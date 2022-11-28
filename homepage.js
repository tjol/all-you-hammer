import './style.css'

window.onload = () => {
  const gameFrame = document.createElement('iframe')
  gameFrame.id = 'gameFrame'
  gameFrame.setAttribute('frameborder', '0')
  gameFrame.setAttribute('scrolling', 'no')
  gameFrame.setAttribute('src', 'game.html')

  document.getElementById('app').appendChild(gameFrame)

  console.log(`Loading version ${__GAME_VERSION__}`)
  document.getElementById('version-nr').innerText = __GAME_VERSION__
}
