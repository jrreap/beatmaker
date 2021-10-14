$(document).ready(function () {
  const playedAudioArray = []
  $('.instruments').on('click', function (e) {
    try {
      const audioString = e.currentTarget.id
      console.log(e.currentTarget.id)
      playedAudioArray.push(audioString)
      var audio = new Audio(`../assets/audio/${audioString}.wav`)
      audio.play()
    } catch (error) {
      console.log(error)
    }
  })
})
