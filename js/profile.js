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
                    readUsersInfo()
                }
            },
            203: function (result) {
                window.location.href = '/index.html'
            }
        }
    });
}

function readUsersInfo() {
    $.ajax({
        url: '/readUserInfo',
        type: 'GET',
        statusCode: {
            200: function (userInfo) {
                console.log(userInfo) // Donte here is the object that has the user info
            },
            203: function (result) {
                console.log(result)
            }
        }
    });
}