let allbeats = []

$(document).ready(function () {
  initialize()
})

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize() {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    headers: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          logoutBtn()
          GetBeatsArray()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
}

async function GetBeatsArray() {
  try {
    const res = await fetch('/getAllBeats', {
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
    allbeats = data
    generateBeatCards(data)
  } catch (err) {
    console.error(err)
    handleLogout() // Likely the token expired
  }

}

function generateBeatCards(data) {
  const allBeatCards = $('#allBeatCards')
  for (beat of data) {
    let title = beat.Title
    let author = beat.Author
    let beatMatrix = beat.beat
    let description = beat.description
    let genre = beat.genre
    let beatId = beat.beatId

    let imageNumber = Math.floor(Math.random() * 20) % 7
    let imagePath = `./Assets/${imageNumber}.jpg`
    if (description == undefined) {
      description = ""
    }

    const colDiv = $(`<div class="col" style="margin:2%">`)
    allBeatCards.append(colDiv)

    const card = $(`<div class="card bg-dark" style="width: 12rem;">`)
    colDiv.append(card)

    const image = $(`<img class="card-img-top" src="${imagePath}" alt="Card image cap">`)
    card.append(image)

    const cardBody = $(`<div class="card-body">`)
    card.append(cardBody)

    const cardTitle = $(`<h5 class="card-title">${title}</h5>`)
    cardBody.append(cardTitle)

    const cardAuthor = $(` <p class="card-text">${author}</p>`)
    cardBody.append(cardAuthor)

    const cardGoToBeat = $(`<a href="/beatmaker.html?id=${beatId}&catalog=true" class="btn btn-primary">View Beat</a>`)
    cardBody.append(cardGoToBeat)
  }
}

/**
 * Logout function to trigger on button click
 */
function logoutBtn() {
  $('#logout-btn').on('click', handleLogout)
}

function handleLogout() {
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
}
