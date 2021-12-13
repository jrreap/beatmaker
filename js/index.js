$(document).ready(function () {
  $('#submit-btn').on('click', async function (e) {
    e.preventDefault()
    const email = $('#email-input').val()
    const password = $('#password-input').val()
    $('#liveAlertPlaceholder').empty()
    try {

      if (!validateInputs(email, password)) {
        display_alert('Please fill in all fields', 'warning')
        return
      }

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

      const { uid } = await res.json()

      sessionStorage.setItem('uid', uid)
      window.location.href = '/profile.html'
    } catch (err) {
      console.error(err)
      display_alert('Unknown error occurred', 'danger')
    }
  })
})

/**
 * Validates if the passed inputs are empty
 * @param {string} email User email to login with
 * @param {string} password User password to login with
 * @returns {boolean} True if the inputs are valid, false otherwise
 */
function validateInputs (email, password) {
  if (email === '' || password === '') {
    return false
  }

  return true
}

function display_alert(message, type) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = '<div id="alertDiv" class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '</div>'
  $('#liveAlertPlaceholder').append(wrapper)
}
