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

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize() {
  let sessionId = sessionStorage.getItem("uid")
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    data: { "uid": sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          generateWorkspace()
          bindToInstrumentButtons()
          logoutBtn()
          // Legacy
          setUpButtons()

        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  });
}

function logoutBtn() {
  $('#logout-btn').on('click', function (e) {
    $.ajax({
      url: '/signOut',
      type: 'POST',
      statusCode: {
        200: function (userID) {
          sessionStorage.removeItem("uid");
          window.location.href = '/beatmaker.html'
        },
        500: function (result) {
          console.log(result)
          // display_alert(result.replace("Firebase: ", ''), 'danger')
        }
      }
    });
  })
}


/**
 * Generates the track rows and columns dynamically instead of duplicating the HTML statically
 */
function generateWorkspace() {
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

/**
 * Adds handlers to each of the instrument selection buttons dynamically
 */
function bindToInstrumentButtons() {
  $('.instrument').on('click', function (e) {
    changeInstrument(e.currentTarget.id)
  })
}

function setUpButtons() {
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
function changeInstrument(instrument) {
  console.log('Instrument changed to ' + instrument)
  currentInstrument = instrument
}

/**
 * Sets the clicked track space to play the specified instrument
 * @param {JQuery<HTMLElement>} element The HTMLElement of the track cell selected
 * @param {number} instrument The instrument code
 */
function setSpaceInstrument(element, instrument) {
  console.log('Set instrument space to ' + instrument)
  element.text('')
  element.append(instrument)
}
