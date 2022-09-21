
function render(data){
  const html = data.map(elem => `<div>
  <span style="font-weight: bold;">${elem.email}</span>
  <p>${elem.msj}</p>
  </div>`).join(' ');
  document.getElementById('mensajes-chat').innerHTML = html;
  
}
const socket = io.connect();

socket.on("new-message",(data) => {
  render(data)
})

function enviarMensaje(event) {
  const nombre = document.getElementById("email").value;
  const msj = document.getElementById("chat_mensaje").value;
  document.getElementById("chat_mensaje").value = "";
  socket.emit("new-message", {
    email: nombre,
    msj: msj
  });
  return false;
  
}



socket.on("mensajes", (data) => {
  console.log(data);
  render(data);
});