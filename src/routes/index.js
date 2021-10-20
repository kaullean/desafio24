import { Router } from 'express'
import { mensajesService } from '../services/mensajes';
import { denormalize } from 'normalizr';
import { schema } from 'normalizr';
import passport from '../middlewares/auth';
import path from 'path'
import { fork } from 'child_process';
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
const scriptPath = path.resolve(__dirname,'../utils/random.js')

const miRouter = Router();

miRouter.get('/', async (req, res) =>{
    let normalizedMsj=await mensajesService.leer();
    let denormalizedMsj= denormalize(normalizedMsj.result,msgesSchema,normalizedMsj.entities)
    let data = {
        usuario:req.session.usuario,
        layout: 'index',
        mensajes:denormalizedMsj
    }

    res.render('main',data)
})

miRouter.get('/login',(req,res) => {

     
      res.render('login')
  
})

miRouter.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

miRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/loginOK',
    failureRedirect: '/loginError',
  })
);
miRouter.get('/loginOK', (req, res) => {
  let foto = 'noPhoto';
  let email = 'noEmail';

  if (req.isAuthenticated()) {
    const userData = req.user;

    if (userData.photos) foto = userData.photos[0].value;

    if (userData.emails) email = userData.emails[0].value;

    res.render('loginOk', {
      layout:'main',
      nombre: userData.displayName,
      contador: userData.contador,
      foto,
      email,
    });
  } else {
    res.redirect('/login');
  }
});
miRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/api/login');
});
miRouter.get('/randoms',(req,res)=>{

    const { cant } = req.query; 
    const comp = fork(scriptPath)
    if(!cant){
      //entonces calculo 
      const cant = 100000000
      comp.send(cant)
      comp.on('message',(num)=>{
        res.json({
          res:num,
        })
      })
    }
    else{
      //le paso el query a la funcion y devuelvo otra cantidad 
      comp.send(cant)
      comp.on('message',(num)=>{
        res.json({
          res:num,
        })
      })
    }

})

miRouter.get('/info', (req, res) => {
  /*
    argumento entrada
    nombre de plataforma
    version node
    uso de memoria
    path
    processid
    carpeta corriente
  */
  let data={
    argumentoEntrada:process.argv0,
    nombrePlataforma:process.platform,
    versionNode:process.version,
    memoria:JSON.stringify(process.memoryUsage()),
    path:process.execPath,
    processID:process.pid,
    carpeta:process.cwd()
  }
  res.render('info',data)
});
export default miRouter;