const request = require('request');
const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('../config.json');


const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const glob = require("glob");
const Path = require('path');

function gera(){

    let encoder = new GIFEncoder(320, 240);

    pngFileStream('../public/img/*.png')
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream('../web/public/final.gif'));

}


function shareGiphyAPI(){

    request({
        uri: 'http://upload.giphy.com/v1/gifs',
        method: 'POST',
        qs: {
            username: config.user,
            api_key: config.giphy,
            file: Path.join(__dirname, '../', 'web/public/final.gif'),
            source_image_url: 'http://gif-generator-f2f.herokuapp.com/public/final.gif',
            tags: 'f2f,f2f-gifgenerator,gifgenerator'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.error(response.body);
        } else {
            console.error(response.body);
        }
    });
}

shareGiphyAPI();


apaga();
function apaga(){
    glob("../public/img/*.png",function(err,files){
        if (err) throw err;

        files.forEach(function(item,index,array){
            fs.unlink(item, function(err){
                if (err) throw err;
            });
        });
    });
}

server.connection({
    host:  '0.0.0.0',
    port: 3001
});

function gravaImgBase64Data( data ){

    let img = Date.now();
    let base64Data = data.replace(/^data:image\/png;base64,/, "");
    fs.writeFile("../public/img/"+img+".png", base64Data, 'base64', (err) => {
        if( err ) console.log(err);
    });

}

server.route({
    method: 'POST',
    path:'/gif',
    handler:  (request, reply) =>  {
        gera();
        return reply('foi').code(200);
    }
});

server.route({
    method: 'POST',
    path:'/img',
    handler:  (request, reply) =>  {
        gravaImgBase64Data( request.payload.data )
        return reply('foi').code(200);
    }
});

server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});
