const INSTRUMENTS = {
  SYNTH: 'synth',
  PIANO: 'piano',
  ORGAN: 'organ',
  HORN: 'horn',
  GUITAR: 'guitar',
  FLUTE: 'flute',
  BASS: 'bass'
}

let currentInstrument = INSTRUMENTS.SYNTH
let sampleIndex = 1
const beatMatrix = {}

$(document).ready(initialize)

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize () {
  generateWorkspace()
  bindToInstrumentButtons()
  bindToSampleButtons()

  // Legacy
  setUpButtons()
}

/**
 * Generates the track rows and columns dynamically instead of duplicating the HTML statically
 */
function generateWorkspace () {
  const workspace = $('#workspace')

  // On initial load generate a nice amount of columns for the screen size
  const colLimit = Math.round(screen.width / 64)

  for (let i = 0; i < 6; i++) {
    const row = $('<div class="row track"></div>')
    workspace.append(row)
    beatMatrix[i] = []

    for (let j = 0; j < colLimit; j++) {
      const col = $(`<div id='track${i}-cell${j}' class="col track selector d-flex justify-content-center align-items-center"></div>`)
      row.append(col)

      beatMatrix[i][j] = ''

      col.on('click', () => { setSpaceInstrument(i, j, col, currentInstrument) })
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
function bindToSampleButtons () {
  $('#sample-prev').on('click', () => changeSample(-1))
  $('#sample-next').on('click', () => changeSample(1))
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

function setUpButtons () {
  const playedAudioArray = []
  $('.instruments').on('click', function (e) {
    try {
      const audioString = e.currentTarget.id
      console.log(e.currentTarget.id)
      playedAudioArray.push(audioString)
      var audio = new Audio(`../assets/audio/${audioString}.wav`)
      audio.play()
    } catch (error) {
      console.log(error)
    }
  })
}

/* LISTENERS and UTILITIES */
/**
 * Changes the currently selected instrument to the passed param
 * @param {number} instrument The instrument code to select
 */
function changeInstrument (instrument) {
  console.log('Instrument changed to ' + instrument)
  currentInstrument = instrument
  loopIndex = 1
}

/**
 * Sets the clicked track space to play the specified instrument
 * @param {JQuery<HTMLElement>} element The HTMLElement of the track cell selected
 * @param {number} instrument The instrument code
 */
function setSpaceInstrument (row, col, element, instrument) {
  console.log('Set instrument space to ' + instrument)
  element.text('')
  element.append(instrument)

  beatMatrix[row][col] = instrument + loopIndex

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
