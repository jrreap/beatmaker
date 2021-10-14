const INSTRUMENTS = {
  SYNTH: 1,
  PIANO: 2,
  ORGAN: 3,
  HORN: 4,
  GUITAR: 5,
  FLUTE: 6,
  BASE: 7
}

let currentInstrument = INSTRUMENTS.SYNTH

$(document).ready(initialize)

function initialize () {
  generateWorkspace()
  bindToInstrumentButtons()

  // Legacy
  setUpButtons()
}

/**
 * Generates the track rows and columns dynamically instead of duplicating the HTML statically
 */
function generateWorkspace () {
  const workspace = $('#workspace')
  for (let i = 0; i < 6; i++) {
    const row = $('<div class="row track"></div>')
    workspace.append(row)

    for (let j = 0; j < 14; j++) {
      const col = $(`<div id='track${i}-cell${j}' class="col track selector d-flex justify-content-center align-items-center"></div>`)
      row.append(col)

      col.on('click', () => { setSpaceInstrument(col, currentInstrument) })
    }
  }
}

function bindToInstrumentButtons () {
  $('.instrument').on('click', function (e) {
    changeInstrument(e.currentTarget.id)
  })
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
function changeInstrument (instrument) {
  console.log('Instrument changed to ' + instrument)
  currentInstrument = instrument
}

function setSpaceInstrument (element, instrument) {
  console.log('Set instrument space to ' + instrument)
  element.text('')
  element.append(instrument)
}
