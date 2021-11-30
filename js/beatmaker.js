const INSTRUMENTS = {
  SYNTH: 'synth',
  GUITAR: 'guitar',
  PIANO: 'piano',
  HORN: 'horn',
  DRUM: 'drum',
  BASS: 'bass'
}

let sampleIndex = 1
const beatMatrix = {}
let erasing = false
const beatLength = Math.round(screen.width / 64) - 1

$(document).ready(initialize)

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize () {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    data: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          generateWorkspace()
          bindToInstrumentButtons()
          bindToControlButtons()
          logoutBtn()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
}

function tempWrite () {
  $.ajax({
    url: '/writeBeat',
    type: 'PUT',
    statusCode: {
      200: function (userID) {
        sessionStorage.removeItem('uid')
        window.location.href = '/beatmaker.html'
      },
      500: function (result) {
        console.log(result)
        // display_alert(result.replace("Firebase: ", ''), 'danger')
      }
    }
  })
}

function logoutBtn () {
  $('#logout-btn').on('click', function (e) {
    $.ajax({
      url: '/signOut',
      type: 'POST',
      statusCode: {
        200: function (userID) {
          sessionStorage.removeItem('uid')
          window.location.href = '/beatmaker.html'
        },
        500: function (result) {
          console.log(result)
          // display_alert(result.replace("Firebase: ", ''), 'danger')
        }
      }
    })
  })
}

/**
 * Generates the track rows and columns dynamically instead of duplicating the HTML statically
 */
function generateWorkspace () {
  const workspace = $('#workspace')
  const icons = ['fa-wave-square', 'fa-guitar', 'fa-ruler-horizontal', 'fa-plus', 'fa-drum', 'fa-guitar']
  const instrumentsByIndex = Object.values(INSTRUMENTS)

  // On initial load generate a nice amount of columns for the screen size
  const colLimit = beatLength + 1

  for (let i = 0; i < 6; i++) {
    const row = $('<div class="row track"></div>')
    workspace.append(row)
    beatMatrix[i] = []

    // Add the column marker
    const marker = $(`<div class="col track marker d-flex justify-content-center align-items-center"><i class="fas ${icons[i]} fa-2x"></i></div>`)
    row.append(marker)

    for (let j = 0; j < colLimit; j++) {
      const col = $(`<div id='track${i}-cell${j}' class="col track selector d-flex justify-content-center align-items-center"></div>`)
      row.append(col)

      beatMatrix[i][j] = ''

      col.on('click', () => { setSpaceInstrument(i, j, col, instrumentsByIndex[i]) })
    }
  }

  console.log(beatMatrix)
}

/**
 * Adds handlers to each of the instrument selection buttons dynamically
 */
function bindToInstrumentButtons () {
  $('.instrument').on('click', function (e) {
    changeInstrument(e.currentTarget.id)
  })
}

/**
 * Adds handlers to each of the sample change buttons (next and previous)
 */
function bindToControlButtons () {
  $('#sample-prev').on('click', () => changeSample(-1))
  $('#sample-next').on('click', () => changeSample(1))
  $('#play').on('click', playBeat)
  $('#eraser').on('click', () => {
    erasing = !erasing
  })
}

/**
 * Changes the sample based off the passed changed value. Does accept negative values to go backwards
 * @param {number} change The number of samples to "loop" through. Can be negative to go reverse.
 */
function changeSample (change) {
  if (sampleIndex + change >= 1 && sampleIndex + change <= 6) {
    sampleIndex += change

    updateSampleDisplay()
  }
}

/**
 * Reads in the beat matrix and plays back the audio
 */
async function playBeat () {
  const mappedMatrix = Object.values(beatMatrix)

  const soundBoard = new SoundBoard(mappedMatrix)
  soundBoard.play(500)
}

/* LISTENERS and UTILITIES */
/**
 * Changes the currently selected instrument to the passed param
 * @param {number} instrument The instrument code to select
 */
function changeInstrument (instrument) {
  console.log('Instrument changed to ' + instrument)
  currentInstrument = instrument
  sampleIndex = 1

  updateSampleDisplay()
}

/**
 * Sets the clicked track space to play the specified instrument
 * @param {JQuery<HTMLElement>} element The HTMLElement of the track cell selected
 * @param {number} instrument The instrument code
 */
function setSpaceInstrument (row, col, element, instrument) {
  console.log('Set instrument space to ' + instrument)
  element.text('')

  if (!erasing) {
    element.append(instrument)
    beatMatrix[row][col] = instrument + sampleIndex
  } else {
    beatMatrix[row][col] = '' // Eraser mode
  }

  console.log(beatMatrix)
}

/**
 * Updates the sample display to match the current selected sampleIndex
 */
function updateSampleDisplay () {
  const sample = $('#sample-index')
  sample.text('')
  sample.append(sampleIndex)
}

/**
 * Utility function that pauses the runtime to sync up beats
 * @param {number} delay The time to wait in miliseconds
 * @returns {Promise}
 */
function sleep (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

function SoundBoard (mappedMatrix) {
  const instrumentsByIndex = Object.values(INSTRUMENTS)

  this.board = []

  for (let i = 0; i < beatLength; i++) {
    this.board.push(new Mix())
    for (let j = 0; j < mappedMatrix.length; j++) {
      if (mappedMatrix[j][i] !== '') {
        this.board[i].add(`../assets/audio/${instrumentsByIndex[j]}1.wav`)
      }
    }
  }
}

SoundBoard.prototype.play = async function (delay) {
  for (let i = 0; i < 4; i++) {
    this.board[i].play()
    await sleep(delay)
  }
}

function Mix () {
  this.channels = []
}

Mix.prototype.add = function (audioSrc) {
  this.channels.push(new Channel(audioSrc))
}

Mix.prototype.play = async function () {
  for (const channel of this.channels) {
    channel.play()
  }
}

function Channel (src) {
  this.audio = new Audio(src)
}

Channel.prototype.play = function () {
  this.audio.play()
}
