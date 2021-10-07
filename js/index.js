$(document).ready(function () {
  $('#submit-btn').on('click', function (e) {
    e.preventDefault()
    const username = $('#username-input').val()
    const password = $('#password-input').val()

    console.log('Username: ' + username)
    console.log('Password: ' + password)
    window.location.href = 'beatmaker.html'
    return false
  })
})
