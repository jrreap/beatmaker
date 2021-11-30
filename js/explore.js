$(document).ready(initialize)

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize() {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    data: { uid: sessionId },
    statusCode: {
      200: function (result) {
        if (result) {
          GetBeatsArray()
        }
      },
      203: function (result) {
        window.location.href = '/index.html'
      }
    }
  })
}

function GetBeatsArray() {
  $.ajax({
    url: '/getAllBeats',
    type: 'GET',
    statusCode: {
      200: function (result) {
        if (result) {
          console.log(result) // Emily here is the array of beats 
        }
      },
      203: function (result) {
        console.log(result)
      }
    }
  })
}