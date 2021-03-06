const request = require('request');
const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('../config.json');


const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const glob = require("glob");
const Path = require('path');


const Public = Path.join(__dirname, '../public/');

function gera(){

    let encoder = new GIFEncoder(320, 240);

    glob( Public+"img/*.png", (err,files) => {
        if (err) throw err;

        console.log(files);
        let i = 1;
        files.reverse().map( (c) => {
            console.log(c);
            fs.createReadStream(c).pipe(fs.createWriteStream( Public+'reverse/'+i+'.png'));
            i++;
        })
    });

    pngFileStream( Public+'img/*.png')
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream( Public+'final-1.gif') );

    pngFileStream( Public+'reverse/*.png')
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream( Public+'final-2.gif') );

    pngFileStream( Public+'img/*.png')
    pngFileStream( Public+'reverse/*.png')
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream( Public+'final.gif') );



}

gera();

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
    },  (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.error(response.body);
        } else {
            console.error(response.body);
        }
    });
}



// apaga();
function apaga(){
    glob("../public/img/*.png", (err,files) => {
        if (err) throw err;

        files.forEach( (item,index,array) => {
            fs.unlink(item, (err) => {
                if (err) throw err;
            });
        });
    });
    glob("../public/reverse/*.png", (err,files) => {
        if (err) throw err;

        files.forEach( (item,index,array) => {
            fs.unlink(item, (err) => {
                if (err) throw err;
            });
        });
    });
}

server.connection({
    host:  '0.0.0.0',
    port: 3003
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
