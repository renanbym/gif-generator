const Hapi = require('hapi');
const server = new Hapi.Server();


const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const glob = require("glob");

function gera(){

    let encoder = new GIFEncoder(320, 240);

    pngFileStream('../public/img/*.png')
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream('../web/public/final.gif'));

}

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
    port: (process.env.PORT || 3000)
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
