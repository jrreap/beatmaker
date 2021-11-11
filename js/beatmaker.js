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
  bindToControlButtons()
}

/**
 * Generates the track rows and columns dynamically instead of duplicating the HTML statically
 */
function generateWorkspace () {
  const workspace = $('#workspace')
  const icons = ['fa-plus', 'fa-guitar', 'fa-plus', 'fa-plus', 'fa-drum', 'fa-guitar']

  // On initial load generate a nice amount of columns for the screen size
  const colLimit = Math.round(screen.width / 64)

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
function bindToControlButtons () {
  $('#sample-prev').on('click', () => changeSample(-1))
  $('#sample-next').on('click', () => changeSample(1))
  $('#play').on('click', playBeat)
  $('#eraser').on('click', () => changeInstrument(''))
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
  const audioFiles = prepareAudioFiles(mappedMatrix)

  for (let i = 0; i < 4; i++) {
    const promises = []
    for (const row of mappedMatrix) {
      if (row[i] !== '') {
        promises.push(audioFiles[row[i]].play)
      }
    }

    console.log(promises)

    Promise.all(promises)
    await sleep(1000)
  }
}

/**
 * Reads in the beat matrix and loads all required audio files. To save memory each file is loaded only once
 * @param {} mappedMatrix The key value pairs of each audio file, mapped to the actual loaded file
 * @returns {{name: HTMLMediaElement}} The mapped audio files
 */
function prepareAudioFiles (mappedMatrix) {
  const audioList = {}

  for (const row of mappedMatrix) {
    for (const col of row) {
      if (col !== '' && !(col in audioList)) {
        audioList[col] = new Audio(`../assets/audio/${col}.wav`)
      }
    }
  }

  return audioList
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
  element.append(instrument)

  if (instrument !== '') {
    beatMatrix[row][col] = instrument + sampleIndex
  } else {
    beatMatrix[row][col] = instrument // Eraser mode
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
