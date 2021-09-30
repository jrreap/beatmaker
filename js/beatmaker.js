$(document).ready(function () {

    $("#drums").on('click', function () {
        // song_array.push()
        var audio = new Audio('../assets/audio/drum1.wav');
        audio.play();
    })

    $("#guitar").on('click', function () {
        var audio = new Audio('../assets/audio/guitar1.wav');
        audio.play();
    })
})

