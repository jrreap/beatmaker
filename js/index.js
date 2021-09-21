$( document ).ready(function() {
    $( "#submit-btn" ).on( "click", function( event ) {
        let username = $("#username-input").val()
        let password = $("#password-input").val()
       
        console.log("Username: "+ username)
        console.log("Password: "+ password)
        return false
    });  
});
