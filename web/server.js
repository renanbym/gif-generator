const Hapi = require('hapi');
const Path = require('path');
const server = new Hapi.Server();

server.connection({
    host:  '0.0.0.0',
    port: (process.env.PORT || 3000)
});


const routes = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index');
        }
    }
    ,{
        method: 'GET',
        path: '/public/{path*}',
        handler: {
            directory:{
                path: Path.join(__dirname, 'public')
                ,listing: false
                ,index: false
            }
        }
    }
]

server.register( [require('vision'), require('inert')], (err) => {
    if( err ) throw err;

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views'
    });

    server.route( routes );
})



server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});
