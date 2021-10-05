$(document).ready(function () {
    $(".instruments").on('click', function (e) {
        try {
            let audioString = e.currentTarget.id
            console.log(e.currentTarget.id)
            var audio = new Audio(`../assets/audio/${audioString}.wav`);
            audio.play();
        } catch (error) {
            console.log(error)
        }
    })
})