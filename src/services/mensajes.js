import fs from 'fs'
import path from 'path'
import { normalize, schema } from 'normalizr';
import util from 'util'
const author = new schema.Entity('author',
 {}, 
 { idAttribute: 'email' });

const msge = new schema.Entity(
  'message',
  {
    author: author,
  },
  { idAttribute: 'time' }
);

const msgesSchema = new schema.Array(msge);

class MensajesService {
    constructor(){
        this.mensajes=[];
        this.filePath=path.resolve(__dirname, '../../public/mensajes.json');
    }
    async leer(){
        this.mensajes=JSON.parse(await fs.promises.readFile(this.filePath, 'utf-8'));
        let messages = this.mensajes.map((aMsg) => ({
            author: aMsg.author,
            text: aMsg.text,
            time:aMsg.time
          }));
        //let normalizedMessages = normalize(messages, msgesSchema);
       // console.log(util.inspect(normalizedMessages,true,5,true));
        
        return messages;
       // return this.mensajes;
    }
    async guardar(){
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(this.mensajes, null, '\t')
        );
      }
    async agregar(unMensaje){

        this.mensajes.push(unMensaje);
        await this.guardar();
        return unMensaje;
    }
 
}

export const mensajesService = new MensajesService();