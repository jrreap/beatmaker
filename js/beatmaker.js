const INSTRUMENTS = {
  SYNTH: 'synth',
  GUITAR: 'guitar',
  PIANO: 'piano',
  HORN: 'horn',
  DRUM: 'drum',
  BASS: 'bass'
}

const sampleIndex = 1
const beatMatrix = {}
const beatLength = Math.round(screen.width / 64) - 1

$(document).ready(() => {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    data: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          initialize()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
})

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize () {
  generateWorkspace()
  bindToControlButtons()
  logoutBtn()
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
    const formattedTooltip = instrumentsByIndex[i].charAt(0).toUpperCase() + instrumentsByIndex[i].slice(1)
    const marker = $(`<div class="col track marker d-flex justify-content-center align-items-center"><a class="channel-label" href="#" data-toggle="tooltip" data-placement="right" title="${formattedTooltip}"><i class="fas ${icons[i]} fa-2x"></i></a></div>`)
    row.append(marker)

    for (let j = 0; j < colLimit; j++) {
      const col = $(`<div id='track${i}-cell${j}' class="col track selector d-flex justify-content-center align-items-center"></div>`)
      row.append(col)

      beatMatrix[i][j] = ''

      col.on('click', () => { setSpaceInstrument(i, j, col, instrumentsByIndex[i]) })
    }
  }

  enableTooltips()
  console.log(beatMatrix)
}

/**
 * Adds handlers to each of the sample change buttons (next and previous)
 */
function bindToControlButtons () {
  $('#play').on('click', playBeat)
  $('#save').on('click', saveBeat)
}

/**
 * Saves the current beat in the workspace
 */
async function saveBeat () {
  try {
    // Validate input first
    if (!validateSave()) {
      sendToastMessage('Please fill out required fields!')
      return
    }

    const res = await fetch('/writeNewBeat', {
      body: JSON.stringify({
        uid: sessionStorage.removeItem('uid'),
        Author: 'Jaydon Reap',
        Title: 'Taco Tuesday',
        Genre: 'HipHop',
        Description: '',
        Beat: beatMatrix
      }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error('Request returned a non 200 response code')
    }

    // Toggle the bootstrap modal
    const saveModal = bootstrap.Modal.getInstance(document.getElementById('saveModal'))
    saveModal.toggle()

    sendToastMessage('Beat successfully saved!', true)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Reads in the beat matrix and plays back the audio
 */
async function playBeat () {
  const mappedMatrix = Object.values(beatMatrix)

  const soundBoard = new SoundBoard(mappedMatrix)
  await soundBoard.play(700)
}

/* LISTENERS and UTILITIES */
/**
 * Sets the clicked track space to play the specified instrument
 * @param {JQuery<HTMLElement>} element The HTMLElement of the track cell selected
 * @param {number} instrument The instrument code
 */
function setSpaceInstrument (row, col, element, instrument) {
  console.log('Set instrument space to ' + instrument)
  console.log(element)
  element.text('')

  if (beatMatrix[row][col] === '') {
    element.append(instrument)
    beatMatrix[row][col] = instrument + sampleIndex
  } else {
    beatMatrix[row][col] = '' // Eraser mode
  }

  console.log(beatMatrix)
}

/**
 * Sends a toast message and triggers it accordingly
 * @param {string} message The message to be sent in the toast
 * @param {boolean} success Whether this is a success message and should be styled as such
 */
function sendToastMessage (message, success = false) {
  const toastElement = $('#toast')
  $('.toast-body').text(message)

  if (success) {
    toastElement.addClass('bg-success')
    toastElement.removeClass('bg-info')
  } else {
    toastElement.removeClass('bg-success')
    toastElement.addClass('bg-info')
  }

  bootstrap.Toast.getOrCreateInstance(toastElement).show()
}

/**
 * Validates the current value of the save modal to make sure it's not empty
 * @returns {boolean} Whether the fields have been filled out properly, false if not
 */
function validateSave () {
  const titleField = $('#titleInput1').val()
  console.log(titleField)
  if (titleField === '') {
    return false
  }

  return true
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

/**
 * Utility function that enables all the bootstrap tooltips on the page
 */
function enableTooltips () {
  $('[data-toggle="tooltip"]').tooltip()
}

/**
 * A wrapper function that provides sound control and syncing functionality to the BeatMaker
 * @param {{}} mappedMatrix
 */
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

/**
 * Plays the currently configured beat with the passed delay
 * @param {number} delay
 * @async
 */
SoundBoard.prototype.play = async function (delay = 500) {
  for (let i = 0; i < 10; i++) {
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
