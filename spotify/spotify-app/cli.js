//entry point into our Command Line Application
const yargs = require('yargs');
const app = require('./app.js');
yargs
    .usage('$0: Usage <cmd> <q> <type> [options]')
    .command({
      command: 'search',
      desc: 'Search for an item in the Spotify catalog',
      builder:(yargs) =>{
           //builder allows a option to the search command
          return yargs
          .option('q', {
              type:'string',
              describe:'(REQUIRED) Search query keywords and optional field filters and operators',
          })
          .option('type', {
            alias:'t',
            type:'string',
            describe:'(REQUIRED) Valid types are: album, artist, playlist, track, show, and people',
          })
        },
       handler: (argv) =>{
            //calling our application logic 
            // console.log(argv.q,argv.type,argv.market,argv.limit,argv.offset);
            app.startProcess(argv.q,argv.type);
          }
    })
    .help('help').argv;