const Hapi = require('hapi');
const server = new Hapi.Server();


const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');

server.connection({
    host:  '0.0.0.0',
    port: (process.env.PORT || 3000)
});

server.route({
    method: 'GET',
    path:'/teste',
    handler:  (request, reply) =>  {
        return reply('sdasdasds').code(200);
    }
});

server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});


server.route({
    method: 'POST',
    path:'/gif',
    handler:  (request, reply) =>  {

        datas.forEach(   (data, index) =>{

            let base64Data = data.replace(/^data:image\/png;base64,/, "");

            fs.writeFile("/public/test/out"+index+".png", base64Data, 'base64', (err) => {
                console.log(err);

                return reply().code(200);
            });

        })

    }
});

server.route({
    method: 'POST',
    path:'/img',
    handler:  (request, reply) =>  {

        let img = Date.now();
        let base64Data = request.payload.data.replace(/^data:image\/png;base64,/, "");
        fs.writeFile("../public/test/out-"+img+".png", base64Data, 'base64', (err) => {
            if( err ) console.log(err);
            return reply(img).code(200);
        });

    }
});
