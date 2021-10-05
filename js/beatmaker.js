$(document).ready(function () {
    let playedAudioArray = []
    $(".instruments").on('click', function (e) {
        try {
            let audioString = e.currentTarget.id
            console.log(e.currentTarget.id)
            playedAudioArray.push(audioString)
            var audio = new Audio(`../assets/audio/${audioString}.wav`);
            audio.play();
        } catch (error) {
            console.log(error)
        }
    })
})