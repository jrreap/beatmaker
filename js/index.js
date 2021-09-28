$(document).ready(function () {
    $( "#submit-btn" ).on('click', function (e) {
        e.preventDefault()
        let username = $("#username-input").val()
        let password = $("#password-input").val()
       
        console.log("Username: "+ username)
        console.log("Password: "+ password)
        window.location.href = '../pages/beatmaker.html'
        return false
    });  
});
