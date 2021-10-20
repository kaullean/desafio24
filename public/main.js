
const socket = io.connect();
const formMensaje = document.getElementById('formMensajes');
const mensajesContainer = document.getElementById('msgContainer');
let date = new Date();
let now = date.toLocaleString();


socket.emit('askData');


function renderNuevoMensaje(nuevoMensaje){

    let msg=document.createElement('div')
    msg.className="d-flex flex-row col-12"
    
    let plantilla=`                                
                   
            <h5 class="text-info p-2">${nuevoMensaje.author.email}</h5>
            <h5 class="text-danger p-2">[${nuevoMensaje.time}]</h5>
            <i class="text-success p-2">${nuevoMensaje.text}</i>
           
        `;

    msg.innerHTML=plantilla;    
    mensajesContainer.appendChild(msg);    
}

socket.on('nuevoMensaje', (data) =>{
    renderNuevoMensaje(data);
})



formMensaje.addEventListener('submit', (event) => {
  event.preventDefault();
  if (email.value && mensaje.value) {
    let data = {
      author: {
        email: email.value,
        nombre: nombre.value,
        apellido: apellido.value,
        alias: alias.value,
        edad: edad.value,
        avatar: avatar.value,
      },
      text: mensaje.value,
      time:now,
    };
    console.log('EMITIENDO SOCKET');

    socket.emit('nuevo-mensaje', data);
    mensaje.value = '';
  }
});

