$(document).ready(function () {
  $('#submit-btn').on('click', async function (e) {
    e.preventDefault()
    const email = $('#email-input').val()
    const password = $('#password-input').val()
    $('#liveAlertPlaceholder').empty()
    try {
      const res = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        display_alert(result.replace('Firebase: ', ''), 'danger')
        return
      }

      console.log(res)

      const { uid } = await res.json()

      console.log(uid)

      sessionStorage.setItem('uid', uid)
      window.location.href = '/beatmaker.html'
    } catch (err) {
      console.error(err)
      display_alert('Unknown error occurred', 'danger')
    }
  })
})

function display_alert(message, type) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = '<div id="alertDiv" class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '</div>'
  $('#liveAlertPlaceholder').append(wrapper)
}
