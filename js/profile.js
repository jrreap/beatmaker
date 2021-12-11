let userBeatData = []

$(document).ready(function () {
  initialize()
})

function initialize () {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    headers: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          readUsersInfo()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
}

async function deleteBeat (beatId) {
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
  } catch (err) {
    console.error(err)
  }
}

async function readUsersInfo () {
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

    generateBeatCards(userBeatData)
  } catch (err) {
    console.error(err)
  }
}

function generateBeatCards(data) {
  $('#cardrow').remove()

  for (let i = 0; i < data.length; i += 3) {
    const group = data.slice(i, i + 3)
    const row = createCardRow()
    for (const beat of group) {
      generateCard(row, beat)
    }
  }
}

function createCardRow () {
  const row = $('<div id="cardrow" class="row mt-4"></div>')
  $('#displayArea').append(row)

  return row
}

function generateCard (row, beatObject) {
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
  card.first('#delete').on('click', () => {
    deleteBeat(beatObject.beatId)
  }) 
}
