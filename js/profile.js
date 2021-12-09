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

    for (let i = 0; i < data.length; i += 3) {
      const group = data.slice(i, i + 3)
      const row = createCardRow()
      for (const beat of group) {
        generateCard(row, beat)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

function addCreateButton () {

}

function createCardRow () {
  const row = $('<div class="row mt-4"></div>')
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
      <a class="btn btn-outline-danger">Delete Beat</a>
    </div>
  </div>
</div>`)

  row.append(card)
}
