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
let  userObj = {};

function readUsersInfo() {
    $.ajax({
        url: '/readUserInfo',
        type: 'GET',
        statusCode: {
            200: function (userInfo) {
                console.log(userInfo) // Donte here is the object that has the user info
                document.getElementById("user-name").innerHTML = userInfo.name;
                document.getElementById("user-email").innerHTML = userInfo.email;
                let bc = document.getElementById("beat-card");
                if(userInfo.beats.length == 0)
                {
                    bc.style.display = "none";
                    const para = document.createElement("h2");
                    const node = document.createTextNode("You have no beats!");
                    para.appendChildnode(node);
                    const element = document.getElementById("your-beats");
                    element.appendChild(para);
                    console.log("You have no beats!");
                }

                //let userObj = userfInfo;
            },
            203: function (result) {
                console.log(result)
            }
        }
    });
}
