$(document).ready(function () {
    initialize()
})

function initialize() {
    let sessionId = sessionStorage.getItem("uid")
    $.ajax({
        url: '/authenticateRoute',
        type: 'POST',
        data: { "uid": sessionId },
        statusCode: {
            200: function (result) {
                if (result) {
                    readUsersBeats()
                }
            },
            203: function (result) {
                window.location.href = '/index.html'
            }
        }
    });
}

function readUsersBeats() {
    console.log("got Here")
    $.ajax({
        url: '/readUserInfo',
        type: 'GET',
        statusCode: {
            200: function (userID) {
                console.log(userID)
            },
            203: function (result) {
                console.log(result)
            }
        }
    });
}