$(document).ready(function () {
  $('#submit-btn').on('click', function (e) {
    e.preventDefault()
    const email = $('#email-input').val()
    const password = $('#password-input').val()
    $.ajax({
      url: '/login',
      type: 'POST',
      data: { "email": email, "password": password },
      success: function (result) {
        localStorage.setItem("uid", result);
      }
    });
    return false
  })
})
