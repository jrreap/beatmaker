const INSTRUMENTS = {
  SYNTH: 'synth',
  GUITAR: 'guitar',
  PIANO: 'piano',
  HORN: 'horn',
  DRUM: 'drum',
  BASS: 'bass'
}

const sampleIndex = 1

let beatObject = {
  Author: 'Jaydon Reap',
  Title: 'Taco Tuesday',
  Genre: 'HipHop',
  Description: '',
  Beat: {}
}

// State
let currentBeatID = ''
let editing = false
let catalog = false

const beatLength = 24

$(document).ready(async () => {
  try {
    const res = await fetch('/authenticateRoute', {
      method: 'POST',
      headers: {
        uid: sessionStorage.getItem('uid'),
        'Content-Type': 'application/json'
      }
    })

    if (res.status === 203) {
      throw new Error('Failed to authenticate, token likely expired')
    }

    initialize()
  } catch (err) {
    console.error(err)
    window.location.href = '/index.html'
  }
})

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize () {
  generateWorkspace()
  bindToControlButtons()
  logoutBtn()

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  const loadFromCatalog = params.get('catalog')

  const name = sessionStorage.getItem('username')

  if (name && name !== 'null') {
    beatObject.Author = name
    updateMetaDisplay('Untitled Beat', 'Unknown Genre', beatObject.Author)
  }

  if (id) {
    loadBeat(id, loadFromCatalog)
  }
}

/**
 * Logout function to trigger on button click
 */
function logoutBtn () {
  $('#logout-btn').on('click', function (e) {
    $.ajax({
      url: '/signOut',
      type: 'POST',
      statusCode: {
        200: function (userID) {
          sessionStorage.removeItem('uid')
          window.location.href = '/'
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
  const beatMatrix = beatObject.Beat

  // On initial load generate a nice amount of columns for the screen size
  const colLimit = beatLength + 1

  for (let i = 0; i < 6; i++) {
    const row = $(`<div class="row track ${instrumentsByIndex[i]}"></div>`)
    workspace.append(row)
    beatMatrix[i] = []

    // Add the column marker
    const formattedTooltip = instrumentsByIndex[i].charAt(0).toUpperCase() + instrumentsByIndex[i].slice(1)
    const marker = $(`<div class="col marker ${instrumentsByIndex[i]} d-flex justify-content-center align-items-center"><a class="channel-label" href="#" data-toggle="tooltip" data-placement="right" title="${formattedTooltip}"><i class="fas ${icons[i]} fa-2x"></i></a></div>`)
    row.append(marker)

    for (let j = 0; j < colLimit; j++) {
      const col = $(`<div id='track${i}-cell${j}' class="col selector d-flex justify-content-center align-items-center"></div>`)
      row.append(col)

      beatMatrix[i][j] = ''

      col.on('click', () => { setSpaceInstrument(i, j, col, instrumentsByIndex[i]) })
    }
  }

  enableTooltips()
}

/**
 * Adds handlers to each of the sample change buttons (next and previous)
 */
function bindToControlButtons () {
  $('#play').on('click', playBeat)
  $('#save').on('click', saveBeat)
}

/**
 * Handler function that determines how to save the beat depending on the editing state
 */
async function saveBeat () {
  if (editing && !catalog) {
    await updateBeat(currentBeatID)
  } else {
    await createBeat()
  }
}

/**
 * Saves the current beat in the workspace
 */
async function createBeat () {
  try {
    const inputData = getSaveInputs()

    // Validate input first
    if (!validateSaveInputs(inputData.title, inputData.genre)) {
      sendToastMessage('Please fill out required fields!')
      return
    }

    const name = sessionStorage.getItem('username')

    beatObject.Genre = inputData.genre
    beatObject.Author = name ? name : 'Unknown Author'
    beatObject.Title = catalog ? 'Copy of ' + inputData.title : inputData.title
    beatObject.Description = inputData.description

    const res = await fetch('/writeNewBeat', {
      body: JSON.stringify({
        ...beatObject
      }),
      method: 'POST',
      headers: {
        uid: sessionStorage.getItem('uid'),
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error('Request returned a non 200 response code')
    }

    // Since we saved a new beat we need to make sure we update this beat with the returned ID
    const json = await res.json()
    currentBeatID = json.data
    editing = true
    catalog = false

    updateMetaDisplay(beatObject.Title, beatObject.Genre, beatObject.Author)

    // Toggle the bootstrap modal
    const saveModal = bootstrap.Modal.getInstance(document.getElementById('saveModal'))
    saveModal.toggle()

    const message = catalog ? 'Beat successfully copied!' : 'Beat successfully saved!'

    sendToastMessage(message, true)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Updates the currently open beat, this is fired when we are editing an existing beat
 * @param {string} beatID The unique identifier for this beat
 */
async function updateBeat (beatID) {
  try {
    const inputData = getSaveInputs()

    // Validate input first
    if (!validateSaveInputs(inputData.title, inputData.genre)) {
      sendToastMessage('Please fill out required fields!')
      return
    }

    beatObject.Title = inputData.title
    beatObject.Genre = inputData.genre
    beatObject.Description = inputData.description

    const res = await fetch('/updateBeat', {
      body: JSON.stringify({
        BeatID: beatID,
        ...beatObject
      }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        uid: sessionStorage.removeItem('uid')
      }
    })

    if (!res.ok) {
      throw new Error('Request returned a non 200 response code')
    }

    updateMetaDisplay(beatObject.Title, beatObject.Genre, beatObject.Author)

    // Toggle the bootstrap modal
    const saveModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'))
    saveModal.toggle()

    sendToastMessage('Beat successfully updated!', true)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Loads a specified beat into the workspace
 * @param {string} id The ID of the beat to load into the workspace
 * @param {boolean} isCatalog Whether or not this beat should be loaded from the catalog
 */
async function loadBeat (id, isCatalog) {
  editing = true
  currentBeatID = id
  catalog = isCatalog

  try {
    const res = await fetch(`/readBeat?id=${id}&catalog=${isCatalog}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        uid: sessionStorage.getItem('uid')
      }
    })

    if (!res.ok) {
      throw new Error('Request returned a non 200 response code')
    }

    const { data } = await res.json()
    beatObject = data

    $('#titleInput1').val(beatObject.Title)
    $('#genreInput1').val(beatObject.Genre)
    $('#descriptionInput1').val(beatObject.Description)

    updateMetaDisplay(beatObject.Title, beatObject.Genre, beatObject.Author)

    const beatMatrix = beatObject.Beat
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < beatLength; col++) {
        if (beatMatrix[row][col] !== '') {
          $(`#track${row}-cell${col}`).addClass(getInstrumentFromMatrix(beatMatrix[row][col]))
        }
      }
    }

    sendToastMessage('Beat successfully loaded', true)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Reads in the beat matrix and plays back the audio
 */
async function playBeat () {
  const mappedMatrix = Object.values(beatObject.Beat)

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
  const beatMatrix = beatObject.Beat

  if (beatMatrix[row][col] === '') {
    element.addClass(instrument)
    beatMatrix[row][col] = instrument + sampleIndex
  } else {
    element.removeClass(getInstrumentFromMatrix(beatMatrix[row][col]))
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
 * Utility function that updates the metadata displayed for this beat
 * @param {string} title The title of this beat
 * @param {string} genre The genre of this beat (if applicable)
 * @param {string} author The author of this beat (if applicable)
 */
function updateMetaDisplay (title, genre = '', author = '') {
  $('.song-title').text(title)
  $('.song-meta').text(`${author} | ${genre}`)
}

/**
 * Parses and returns the save modal input fields
 * @returns {{ title: string, genre: string, description: string }} The parsed inputs as an object
 */
function getSaveInputs () {
  const title = $('#titleInput1').val()
  const genre = $('#genreInput1').val()
  const description = $('#descriptionInput1').val()

  return { title, genre, description }
}

/**
 * Validates the current value of the save modal to make sure it's not empty
 * @param {string} title The title for this beat
 * @param {string} genre The genre for this beat
 * @returns {boolean} Whether the fields have been filled out properly, false if not
 */
function validateSaveInputs (title, genre, description) {
  if (title === '' || genre === '' || description === '') {
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
 * Utility that strips the sample id off the item in a matrix space to get the instrument name
 * @param {string} instrument The instrument at a specified matrix space
 * @returns {string} The instrument type for that matrix space
 */
function getInstrumentFromMatrix (instrument) {
  return instrument.substring(0, instrument.length - 1)
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
  for (let i = 0; i < beatLength; i++) {
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
