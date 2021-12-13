$(document).ready(initialize)

/**
 * Called once on page load. This is where all of the initialization logic goes
 */
function initialize() {
  const sessionId = sessionStorage.getItem('uid')
  $.ajax({
    url: '/authenticateRoute',
    type: 'POST',
    headers: {
      uid: sessionId
    },
    statusCode: {
      200: function (result) {
        if (result) {
          GetBeatsArray()
          logoutBtn()
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

/**
 * Logout function to trigger on button click
 */
 function logoutBtn () {
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