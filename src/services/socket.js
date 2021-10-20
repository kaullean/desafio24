import socketIo, { Socket } from 'socket.io'
import { mensajesService } from './mensajes'

class SocketService {

    initWSService(server){
        
        
        if(!this.myWSServer){
            this.myWSServer = socketIo(server);
            this.myWSServer.on('connection', (socket) =>{
                console.log("Nueva conexion");  
               
                /* responde con los mensajes y los productos del historial */
                socket.on('askData',async (data) =>{
                    socket.emit('nuevo-mensaje',await mensajesService.leer())                   
                })
                
                /*Escucha nuevos mensajes*/
                socket.on('nuevo-mensaje', (data) => {
                    console.log(data);
                    if(data.length>0){
                        console.log("soy un array");
                        data.entities.message.forEach(mensaje => {
                            this.myWSServer.emit('nuevoMensaje',mensaje)
                        });
                    }
                    console.log("soy un mensaje");
                    mensajesService.agregar(data);
                    this.myWSServer.emit('nuevoMensaje',data)
                })

            });

        }
        return this.myWSServer;
    }

    getServer(){
        return this.myWSServer;
    }
}

export const socketService = new SocketService();