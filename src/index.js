import config from './config';
import server from './services/server'
import { connectDb } from './services/db';
import { numeroAleatorio } from './utils/random';


const puerto=config.PORT;
connectDb().then(() => {
    console.log('DB CONECTADA');
    server.listen(puerto, () => console.log("Server up "+puerto))
  
    server.on('error', (error) => console.log(`Error en servidor: ${error}`));
  });



