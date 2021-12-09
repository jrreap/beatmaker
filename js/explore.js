//$(document).ready(initialize)
$( window ).on( "load", initialize())


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
          //for each
          for (const beat in result)  {displayBeats(beat)}
//          result.forEach(displayBeats);
        }
      },
      203: function (result) {
        console.log(result)
      }
    }
  })
}


function displayBeats(beatJSON) {
  const beat = JSON.parse(beatJSON)
  console.log(beat)
  $('.all-beats').append("<article class=\"beat\"><h2>" + beat.title + "</h2><h3>" + beat.author + "</h3></article>")
}