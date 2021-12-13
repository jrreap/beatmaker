let userBeatData = []

$(document).ready(function () {
  initialize()
})

function initialize() {
  const sessionId = sessionStorage.getItem('uid')
  console.log(sessionId)
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    headers: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          readUsersInfo()
          logoutBtn()
          readUserBeats()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
}

async function deleteBeat(beatId) {
  try {
    const res = await fetch('/deleteBeat', {
      headers: {
        'Content-Type': 'application/json',
        uid: sessionStorage.getItem('uid')
      },
      body: JSON.stringify({
        beatId
      }),
      method: 'DELETE'
    })

    if (!res.ok) {
      throw new Error('Server responded with non 200 status code')
    }

    userBeatData = userBeatData.filter((beat) => {
      return beat.beatId !== beatId
    })

    generateBeatCards(userBeatData)

    sendToastMessage('Successfully deleted beat!', true)
    toggleConfirmModal()
  } catch (err) {
    console.error(err)
  }
}

async function readUserBeats() {
  try {

    const res = await fetch('/readUserBeats', {
      headers: {
        'Content-Type': 'application/json',
        uid: sessionStorage.getItem('uid')
      },
      method: 'GET'
    })

    if (!res.ok) {
      throw new Error('Response returned with non 200 error code')
    }

    const { data } = await res.json()
    userBeatData = data
    generateBeatCards(userBeatData)
  } catch (err) {
    console.error(err)
  }
}

async function readUsersInfo() {
  try {
    const res = await fetch('/readUserInfo', {
      headers: {
        'Content-Type': 'application/json',
        uid: sessionStorage.getItem('uid')
      },
      method: 'GET'
    })

    if (!res.ok) {
      throw new Error('Response returned with non 200 error code')
    }

    const { data } = await res.json()
    userBeatData = data

    $("#user-name").append(data.name)

  } catch (err) {
    console.error(err)
  }
}

function generateBeatCards(data) {
  $('.cardrow').each((num, ele) => {
    ele.remove()
  })

  if (data.length === 0) {
    $('#warning').removeClass('d-none')
    return
  }

  for (let i = 0; i < data.length; i += 3) {
    const group = data.slice(i, i + 3)
    const row = createCardRow()
    for (const beat of group) {
      generateCard(row, beat)
    }
  }
}

function createCardRow() {
  const row = $('<div class="row cardrow mt-4"></div>')
  $('#displayArea').append(row)

  return row
}

function generateCard(row, beatObject) {
  const card = $(`<div class="col-4">
  <div class="card p-2 bg-dark">
    <div class="card-header">
      ${beatObject.Title}
    </div>
    <div class="card-body">
      ${beatObject.Description}
    </div>
    <div class="card-footer">
      <a href="/beatmaker.html?id=${beatObject.beatId}" class="btn btn-primary">Edit Beat</a>
      <a id='delete' data-beat=${beatObject.beatId} class="btn btn-outline-danger">Delete Beat</a>
    </div>
  </div>
</div>`)

  row.append(card)

  // Bind to the delete button
  card.find('.card-footer a').last().on('click', () => {
    $('#confirm').on('click', () => {
      deleteBeat(beatObject.beatId)
    })
    toggleConfirmModal()
  })
}

/* Utility Functions */
/**
 * Sends a toast message and triggers it accordingly
 * @param {string} message The message to be sent in the toast
 * @param {boolean} success Whether this is a success message and should be styled as such
 */
function sendToastMessage(message, success = false) {
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
 * Toggles the confirm modal from being opened or closed
 */
function toggleConfirmModal() {
  const confirmModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal'))
  confirmModal.toggle()
}

/**
 * Logout function to trigger on button click
 */
function logoutBtn() {
  $('#logout-btn').on('click', function (e) {
    $.ajax({
      url: '/signOut',
      type: 'POST',
      statusCode: {
        200: function () {
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
