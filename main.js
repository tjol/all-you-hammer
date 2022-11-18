import nailSprites from './sprites/png/nails.png'
import screwSprites from './sprites/png/screws.png'
import nailHeadImg from './sprites/png/nail-head.png'
import dropHammerImg from './sprites/png/drop-hammer.png'
import dropHammerShape from './sprites/drop-hammer.shape.json'
import Phaser from 'phaser'

const origNailCircPos = [24.576712, 21.896908]
const origNailCircRadius = 1.0 // 1.7096132
const nailWidth = 150
const nailScale = nailWidth / 48.761269
const nailCircPos = origNailCircPos.map(x => x * nailScale)
const nailCircRadius = origNailCircRadius * nailScale

const sceneConfig = {
  preload,
  create,
  update
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
      x: nailCircPos[0],
      y: nailCircPos[1],
      radius: nailCircRadius
    }
  }).scale = 0.5

  this.matter.add.sprite(200, 300, 'nails', 2, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nailCircPos[0],
      y: nailCircPos[1],
      radius: nailCircRadius
    }
  }).scale = 0.5

  const nailHead0 = this.add.image(300, 200, 'nail-head')
  nailHead0.scale = 0.5
  nailHead0.setDepth(-1)

  this.matter.add.sprite(400, 300, 'nails', 9, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nailCircPos[0],
      y: nailCircPos[1],
      radius: nailCircRadius
    }
  }).scale = 0.5

  this.matter.add.sprite(600, 250, 'nails', 7, {
    isStatic: true,
    shape: {
      type: 'circle',
      x: nailCircPos[0],
      y: nailCircPos[1],
      radius: nailCircRadius
    }
  }).scale = 0.5

  const dropHammer = this.matter.add.image(400, 100, 'drop-hammer', null, {
    shape: dropHammerShape
  })
  dropHammer.setDepth(-1)
}

function update () {}

// eslint-disable-next-line
const game = new Phaser.Game(config)
