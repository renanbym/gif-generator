// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true})
    .then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    })
    .catch(function(err){
        console.log(err);
    })
}


// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');



document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 320, 320/ (video.videoWidth/video.videoHeight));
});


function appendImage( ){
    var image = document.createElement('img');
    image.src = getPicture();
    document.getElementById("img-gif").appendChild(image);
}

var data_gif = [];
function getPicture() {
    var canvas = document.createElement('canvas');
    var aspectRatio = video.videoWidth/video.videoHeight;
    canvas.width = 320;
    canvas.height = canvas.width / aspectRatio;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var toData = canvas.toDataURL();
    saveImg( toData );
    data_gif.push( toData );
    return toData
}

var i = 0;
var interval;
function foto(){
    if(i < 50) {
        appendImage();
        i++;
    }else{
            geraGif( );
        window.clearInterval(interval);
    }
}

function geraGif( ){

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/gif"
    })

    $('#final-gif img').show().each(function() {
        this.offsetHeight;
    }).prop('src', 'final.gif');

}

$("#final-gif").click(function() {
  $("#final-gif").find('img').attr("src", "final.gif?v="+Date.now());
});

function saveImg( data_gif ){

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/img",
        data: { data: data_gif }
    })
    .done(function( msg ) {
        alert( "Data Saved: " + msg );
    });

}

document.getElementById("gif").addEventListener("click", function() {
    interval = setInterval( foto, 100);
});
