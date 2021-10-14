$(document).ready(initialize)

function initialize () {
  generateWorkspace()
  setUpButtons()
}
/**
 * Generates the track rows and columns dynamically instead of duplicated the HTML statically
 */

function generateWorkspace () {
  const workspace = $('#workspace')
  for (let i = 0; i < 6; i++) {
    const row = $('<div class="row track"></div>')
    workspace.append(row)

    for (let j = 0; j < 12; j++) {
      row.append(`
      <div class="col track selector d-flex justify-content-center align-items-center">
          <div>
              <p></p>
          </div>
      </div>
      `)
    }
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
