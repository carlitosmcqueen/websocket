const socket = io.connect();

function render(data){
  const html = data.map(elem => `<div>
  <span style="font-weight: bold;">${elem.email}</span>
  <p>${elem.msj}</p>
  </div>`).join(' ');
  document.getElementById('mensajes-chat').innerHTML = html;
  
}



function enviarMensaje(event) {
  const email = document.getElementById("email").value;
  const msj = document.getElementById("chat_mensaje").value;
  document.getElementById("chat_mensaje").value = "";

  socket.emit("new_msj", {
    email: email,
    msj: msj
  });
  return false;
}


socket.on("mensajes", (data) => {
  console.log(data);
  render(data);
});