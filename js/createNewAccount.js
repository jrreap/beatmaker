$(document).ready(function () {
    $('#submit-btn').on('click', function (e) {
        e.preventDefault()
        const email = $('#email-input').val()
        const password = $('#password-input').val()
        $("#liveAlertPlaceholder").empty();

        $.ajax({
            url: '/createNewAccount',
            type: 'POST',
            data: { "email": email, "password": password },
            statusCode: {
                200: function (result) {
                    var wrapper = document.createElement('div')
                    display_alert('Account Created!', 'success')
                    console.log(result)
                },
                203: function (result) {
                    display_alert(result.replace("Firebase: ", ''), 'danger')
                    console.log(result.replace("Firebase: ", ''))
                }
            }
        });

        return false
    })
})

function display_alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="alertDiv" class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '</div>'
    $("#liveAlertPlaceholder").append(wrapper)
}