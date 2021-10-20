export const numeroAleatorio = (numero) => {
    let numerosAleatorios=[];
    for (let i = 0; i < numero; i++) {
      let numeroAleatorio = Math.round(Math.random() * (1001 - 1) + 1001);
      numerosAleatorios.push(numeroAleatorio)
    }
    console.log(numerosAleatorios);
    return numerosAleatorios;
  };
  
  process.on('message', (num) => {
    
      console.log('Empezando a generar numeros');
      const rta = numeroAleatorio(num);     
      process.send(rta);
      
    
  });