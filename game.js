import logoImg from './sprites/png/logo2x.png'

import nailSprites from './sprites/png/nails.png'
import screwSprites from './sprites/png/screws.png'
import nailHeadImg from './sprites/png/nail-head.png'
import dropHammerImg from './sprites/png/drop-hammer.png'
import dropHammerShape from './sprites/drop-hammer.shape.json'
import startBtnImg from './sprites/png/start-btn.png'
import restartBtnImg from './sprites/png/restart-btn.png'
import tiltBtnImg from './sprites/png/tilt-btn.png'
import nextLevelImg from './sprites/png/next-level.png'

import nail1SoundMp3 from './audio/nail1.mp3'
import nail1SoundOgg from './audio/nail1.ogg'
import nail2SoundMp3 from './audio/nail2.mp3'
import nail2SoundOgg from './audio/nail2.ogg'
import nail3SoundMp3 from './audio/nail3.mp3'
import nail3SoundOgg from './audio/nail3.ogg'
import screwSoundMp3 from './audio/screw.mp3'
import screwSoundOgg from './audio/screw.ogg'

import './bare.css'

import Phaser from 'phaser'
import seedrandom from 'seedrandom'

const origNailCircPos = [24.576712, 21.896908]
const origNailCircRadius = 1.0 // 1.7096132
const nailWidth = 150
const nailScale = nailWidth / 48.761269
const nailCircPos = origNailCircPos.map(x => x * nailScale)
const nailCircRadius = origNailCircRadius * nailScale

const nailDist = 150
const positionVariance = 70
const nailProbabilities = {
  missing: 0.3,
  nail: 0.5,
  secretScrew: 0.15,
  inWall: 0.05
}

const hammerTargetPos = 400
const hudPos = [10, 10]
const redAlertPos = [500, 300]

const seeds = [
  'all you have is two hammers, one visible and one invisible',
  'Thor, God of Hammers, would have been very confused indeed',
  'level the third, the third level'
]
const level1Height = 4500
const levelHeightIncrement = 1000

let level = {
  number: 1,
  seed: seeds[0],
  height: level1Height
}

let tiltCount = 0

function seedForLevel (number) {
  if (number <= seeds.length) {
    return seeds[number - 1]
  } else {
    return `level #${number}`
  }
}

class AllYouHaveIsAHammer extends Phaser.Scene {
  preload () {
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
    this.load.image('restart-btn', restartBtnImg)
    this.load.image('tilt-btn', tiltBtnImg)
    this.load.image('next-level', nextLevelImg)

    this.load.audio('nail1', [nail1SoundOgg, nail1SoundMp3])
    this.load.audio('nail2', [nail2SoundOgg, nail2SoundMp3])
    this.load.audio('nail3', [nail3SoundOgg, nail3SoundMp3])
    this.load.audio('screw', [screwSoundOgg, screwSoundMp3])

    this._yPos = 0
    // this._tiltCount = 0
    this._nails = {}
    this._levelNumber = level.number
    this._seed = level.seed
    this._maxNailY = level.height
    this._maxCameraY = level.height + 100
    this._width = this.sys.game.canvas.width
    this._height = this.sys.game.canvas.height
  }

  create () {
    this.cameras.main.setBackgroundColor('#eeccaa')

    this._hud = this.add.text(...hudPos, '', {
      font: 'bold 32px Courier',
      fill: '#c90'
    })
    this._hud.setDepth(100)

    this._redAlert = this.add.text(...redAlertPos, 'SCREWED', {
      font: 'bold 96px sans-serif',
      fill: '#a00'
    })
    this._redAlert.setDepth(100)
    this._redAlert.setVisible(false)

    // create the outer walls
    this.matter.add.rectangle(-5, 100000, 10, 200000, { isStatic: true })
    this.matter.add.rectangle(this._width + 5, 100000, 10, 200000, { isStatic: true })
    this.matter.add.rectangle(this._width / 2, this._maxCameraY + this._height, this._width, 10, { isStatic: true })

    // create the nails
    this._createNails()

    // create the falling hammer
    this._dropHammer = this.matter.add.image(
      this._width / 2,
      100,
      'drop-hammer',
      null,
      {
        shape: dropHammerShape
      }
    )
    this._dropHammer.setDepth(0)

    // allow nails to be clicked
    this.input.on('gameobjectup', (_pointer, gameObject) => {
      gameObject.emit('clicked', gameObject)
    })

    // Prepare the audio files
    this._nailSounds = [
      this.sound.add('nail1'),
      this.sound.add('nail2'),
      this.sound.add('nail3')
    ]
    this._screwSound = this.sound.add('screw')

    // Create the buttons
    this._restartBtn = this.add.image(90, this._height - 50, 'restart-btn')
    this._restartBtn.scale = 0.5
    this._restartBtn.setDepth(100)
    this._restartBtn.setInteractive()
    this._restartBtn.on('clicked', this._restart, this)
    this._tiltBtn = this.add.image(
      this._width - 90,
      this._height - 50,
      'tilt-btn'
    )
    this._tiltBtn.scale = 0.5
    this._tiltBtn.setDepth(100)
    this._tiltBtn.setInteractive()
    this._tiltBtn.on('clicked', this._tilt, this)

    this._fixedObjects = [
      [this._hud, this._hud.y],
      [this._redAlert, this._redAlert.y],
      [this._restartBtn, this._restartBtn.y],
      [this._tiltBtn, this._tiltBtn.y]
    ]

    this._nextLevelButton = null
  }

  update () {
    const yPos = this._dropHammer.y - hammerTargetPos
    if (yPos > this._yPos) {
      this._yPos = Math.min(yPos, this._maxCameraY)
      this.cameras.main.scrollY = this._yPos
      this._collectGarbage()
      this._createNails()
    }
    if (this._yPos === this._maxCameraY && this._nextLevelButton === null) {
      // Level over
      const levelNumber = this._levelNumber
      window.setTimeout(() => this._createNextLevelButton(levelNumber), 3000)
    }

    for (const [obj, fixedY] of this._fixedObjects) {
      obj.y = this._yPos + fixedY
    }

    let hudText = `LEVEL ${this._levelNumber} - ${Math.round(this._yPos / nailDist * 10)}`
    if (tiltCount !== 0) {
      hudText += ` - ${tiltCount} TILT`
    }
    this._hud.setText(hudText)
  }

  _createNextLevelButton (levelNumber) {
    if (this._nextLevelButton === null && levelNumber === this._levelNumber) {
      this._nextLevelButton = this.add.image(750, 500 + this._yPos, 'next-level')
      this._nextLevelButton.setScale(0.5)
      this._nextLevelButton.setDepth(100)
      this._nextLevelButton.setInteractive()
      this._nextLevelButton.on('clicked', this._goToNextLevel, this)
    }
  }

  _goToNextLevel () {
    const levelNumber = level.number + 1
    level = {
      number: levelNumber,
      seed: seedForLevel(levelNumber),
      height: level1Height + (levelNumber - 1) * levelHeightIncrement
    }
    this._restart()
  }

  _createNails () {
    let y0 = Math.max(this._yPos, 300)
    const yEnd = Math.min(this._height + this._yPos + 2 * nailDist, this._maxNailY)
    // place nails at odd multiples of nailDist/2
    y0 = Math.ceil(y0 / nailDist / 2) * nailDist * 2
    const x0 = nailDist / 2
    const xEnd = this._width - nailDist / 2

    for (let y = y0; y < yEnd; y += nailDist) {
      for (let x = x0; x < xEnd; x += nailDist) {
        this._createNail(x, y)
      }
    }
  }

  _createNail (x, y) {
    if ([x, y] in this._nails) {
      return
    }

    const rng = seedrandom(`${this._seed} @ ${x}, ${y}`)

    const dx = positionVariance * rng()
    const dy = positionVariance * rng()

    const typeDecisiion = rng()
    let nailKind
    let cumProb = 0
    for (const kind in nailProbabilities) {
      cumProb += nailProbabilities[kind]
      if (typeDecisiion <= cumProb) {
        nailKind = kind
        break
      }
    }

    const orientation = Math.ceil(12 * rng())

    this._nails[[x, y]] = this._manifestNail(
      [x, y].toString(),
      x + dx,
      y + dy,
      nailKind,
      orientation
    )
  }

  _manifestNail (key, x, y, kind, orientation) {
    const nail = { key, x, y, kind, orientation }

    if (kind === 'nail' || kind === 'secretScrew') {
      const body = this.matter.add.sprite(x, y, 'nails', orientation, {
        isStatic: true,
        shape: {
          type: 'circle',
          x: nailCircPos[0],
          y: nailCircPos[1],
          radius: nailCircRadius
        }
      })
      body.scale = 0.5
      body.setDepth(1)
      body.setInteractive()
      body.on('clicked', () => this._onNailClicked(key))
      nail.body = body
    } else if (kind === 'screw') {
      const body = this.matter.add.sprite(x, y, 'screws', orientation, {
        isStatic: true,
        shape: {
          type: 'circle',
          x: nailCircPos[0],
          y: nailCircPos[1],
          radius: nailCircRadius
        }
      })
      body.scale = 0.5
      body.setDepth(1)
      body.setInteractive()
      body.on('clicked', () => this._onNailClicked(key))
      nail.body = body
    } else if (kind === 'inWall') {
      const body = this.add.image(x, y, 'nail-head')
      body.scale = 0.5
      body.setDepth(-1)
      nail.body = body
    }

    return nail
  }

  _replaceNail (key, newKind) {
    const nail = this._nails[key]
    const { x, y, orientation, body } = nail
    if (body !== undefined) {
      body.destroy()
    }
    this._nails[key] = this._manifestNail(key, x, y, newKind, orientation)
  }

  _onNailClicked (key) {
    const nail = this._nails[key]
    if (nail.kind === 'nail') {
      window.setTimeout(() => this._replaceNail(key, 'inWall'), 150)
      this._playNailSound()
    } else if (nail.kind === 'secretScrew') {
      window.setTimeout(() => {
        this._replaceNail(key, 'screw')
        this._redAlert.setVisible(true)
        window.setTimeout(() => this._redAlert.setVisible(false), 500)
      }, 150)
      this._playScrewSound()
    } else if (nail.kind === 'screw') {
      this._playScrewSound()
    }
  }

  _playNailSound () {
    const choice = Math.floor(Math.random() * 3)
    this._nailSounds[choice].play()
  }

  _playScrewSound () {
    this._screwSound.play()
  }

  _collectGarbage () {
    const toReap = []

    for (const key in this._nails) {
      const y = key.split(',')[1]
      if (y < this._yPos - nailDist) {
        toReap.push(key)
      }
    }

    for (const key of toReap) {
      const body = this._nails[key].body
      if (body !== undefined) {
        body.destroy()
      }
      delete this._nails[key]
    }
  }

  _restart () {
    this.scene.restart()
  }

  _tilt () {
    this._dropHammer.x += (Math.random() - 0.5) * nailDist
    this._dropHammer.y += (Math.random() - 0.5) * nailDist
    tiltCount += 1
  }
}

class Splash extends Phaser.Scene {
  preload () {
    this.load.image('logo', logoImg)
    this.load.image('start-btn', startBtnImg)
  }

  create () {
    this.add.rectangle(512, 512, 896, 896, 0x401010)
    const logoImg = this.add.image(512, 512, 'logo')
    logoImg.scale = 0.5
    const startBtnImg = this.add.image(512, 768, 'start-btn')
    startBtnImg.scale = 0.5
    startBtnImg.setInteractive()
    startBtnImg.on('clicked', this._startGame, this)
    this.input.on('gameobjectup', (_pointer, gameObject) => {
      gameObject.emit('clicked', gameObject)
    })
  }

  update () {
  }

  _startGame () {
    this.scene.add('game', AllYouHaveIsAHammer, true)
  }
}

const config = {
  type: Phaser.AUTO,
  scene: [Splash],
  backgroundColor: '#eeccaa',
  physics: {
    default: 'matter'
  },
  scale: {
    parent: 'app',
    mode: Phaser.Scale.FIT,
    width: 1024,
    height: 1024
  }
}

// eslint-disable-next-line
const game = new Phaser.Game(config)
