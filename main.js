import nailSprites from './sprites/png/nails.png'
import screwSprites from './sprites/png/screws.png'
import nailHeadImg from './sprites/png/nail-head.png'
import dropHammerImg from './sprites/png/drop-hammer.png'
import dropHammerShape from './sprites/drop-hammer.shape.json'
import Phaser from 'phaser'

const orig_nail_circ_pos = [24.576712, 21.896908]
const orig_nail_circ_radius = 1.0 // 1.7096132
const nail_width = 150
const nail_scale = nail_width / 48.761269
const nail_circ_pos = orig_nail_circ_pos.map(x => x * nail_scale)
const nail_circ_radius = orig_nail_circ_radius * nail_scale

const sceneConfig = {
  preload: preload,
  create: create,
  update: update
}

const config = {
  parent: 'app',
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
  scene: sceneConfig,
  backgroundColor: '#eeccaa',
  physics: {
    default: 'matter'
    // matter: {
    //     debug: true
    // }
  }
}

const game = new Phaser.Game(config)

function preload () {
  this.load.spritesheet('nails', nailSprites, {
    frameWidth: 150,
    frameHeight: 178
  })
  this.load.spritesheet('screws', screwSprites, {
    frameWidth: 150,
    frameHeight: 178
  })
  this.load.image('drop-hammer', dropHammerImg)
  this.load.image('nail-head', nailHeadImg)
}

function create () {
  this.matter.add.sprite(100, 300, 'nails', 5, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nail_circ_pos[0],
      y: nail_circ_pos[1],
      radius: nail_circ_radius
    }
  }).scale = 0.5

  this.matter.add.sprite(200, 300, 'nails', 2, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nail_circ_pos[0],
      y: nail_circ_pos[1],
      radius: nail_circ_radius
    }
  }).scale = 0.5

  let nailHead0 = this.add.image(300, 200, 'nail-head')
  nailHead0.scale = 0.5
  nailHead0.setDepth(-1)

  this.matter.add.sprite(400, 300, 'nails', 9, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nail_circ_pos[0],
      y: nail_circ_pos[1],
      radius: nail_circ_radius
    }
  }).scale = 0.5

  this.matter.add.sprite(600, 250, 'nails', 7, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nail_circ_pos[0],
      y: nail_circ_pos[1],
      radius: nail_circ_radius
    }
  }).scale = 0.5

  let drop_hammer = this.matter.add.image(400, 100, 'drop-hammer', null, {
    shape: dropHammerShape
  })
  drop_hammer.setDepth(-1)
}

function update () {}

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
