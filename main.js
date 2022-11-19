import nailSprites from './sprites/png/nails.png'
import screwSprites from './sprites/png/screws.png'
import nailHeadImg from './sprites/png/nail-head.png'
import dropHammerImg from './sprites/png/drop-hammer.png'
import dropHammerShape from './sprites/drop-hammer.shape.json'
import restartBtnImg from './sprites/png/restart-btn.png'
import tiltBtnImg from './sprites/png/tilt-btn.png'

import nail1SoundMp3 from './audio/nail1.mp3'
import nail1SoundOgg from './audio/nail1.ogg'
import nail2SoundMp3 from './audio/nail2.mp3'
import nail2SoundOgg from './audio/nail2.ogg'
import nail3SoundMp3 from './audio/nail3.mp3'
import nail3SoundOgg from './audio/nail3.ogg'
import screwSoundMp3 from './audio/screw.mp3'
import screwSoundOgg from './audio/screw.ogg'

import './style.css'

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

    this.load.audio('nail1', [nail1SoundOgg, nail1SoundMp3])
    this.load.audio('nail2', [nail2SoundOgg, nail2SoundMp3])
    this.load.audio('nail3', [nail3SoundOgg, nail3SoundMp3])
    this.load.audio('screw', [screwSoundOgg, screwSoundMp3])

    this._yPos = 0
    this._tiltCount = 0
    this._nails = {}
    this._seed = 'all you have is two hammers, one visible and one invisible'
    this._width = this.sys.game.canvas.width
    this._height = this.sys.game.canvas.height
  }

  create () {
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
    this.matter.add.rectangle(this._width + 5, 100000, 10, 200000, {
      isStatic: true
    })

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
  }

  update () {
    const yPos = this._dropHammer.y - hammerTargetPos
    if (yPos > this._yPos) {
      this._yPos = yPos
      this.cameras.main.scrollY = yPos
      this._collectGarbage()
      this._createNails()
    }

    for (const [obj, fixedY] of this._fixedObjects) {
      obj.y = this._yPos + fixedY
    }

    let hudText = `${Math.round(this._dropHammer.y / nailDist * 10)}`
    if (this._tiltCount !== 0) {
      hudText += ` - ${this._tiltCount} TILT`
    }
    this._hud.setText(hudText)
  }

  _createNails () {
    let y0 = Math.max(this._yPos, 300)
    const yEnd = this._height + this._yPos + 2 * nailDist
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
    this._tiltCount += 1
  }
}

const config = {
  parent: 'app',
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: [AllYouHaveIsAHammer],
  backgroundColor: '#eeccaa',
  physics: {
    default: 'matter'
  }
}

// eslint-disable-next-line
const game = new Phaser.Game(config)

window.addEventListener('load', () => {
  console.log(`Loading version ${__GAME_VERSION__}`)
  document.getElementById('version-nr').innerText = __GAME_VERSION__
})
