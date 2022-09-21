const socket = io.connect();

function render(data){
  const html = data.map(elem => `<div>
  <span style="font-weight: bold;color:blue;font-size: 25px;">${elem.email}</span>
  <span style="font-size: 15px;color:brown">${elem.date}</span>
  <p style="color: green;font-size:20px"> ${elem.msj}</p>
  </div>`).join(' ');
  document.getElementById('mensajes-chat').innerHTML = html;
  
}

function enviarMensaje(event) {
  const email = document.getElementById("email").value;
  const msj = document.getElementById("chat_mensaje").value;
  document.getElementById("chat_mensaje").value = "";
  const fecha = new Date().toLocaleDateString()+ ' ' +new Date().toTimeString()
  const fyh = fecha.split(' ');

  socket.emit("new_msj", {
    email: email,
    msj: msj,
    date: fyh[0]+" "+fyh[1]
  });
  return false;
}

//productos
function renderProducto(prod){
  const html = prod.map(elem => `
  <tr>
  <th >${elem.id}</th>
  <td>${elem.title}</td>
  <td>$${elem.precio}</td>
  <td><img rel="icon" src="${elem.thumbnail}" style="width: 30px; height: 30px;" /></td>
  </tr>`).join(' ');
  document.getElementById('lista-productos').innerHTML = html;
}

function enviarProducto(prod){
  const title= document.getElementById("title").value
  const precio= document.getElementById("precio").value
  const thumbnail= document.getElementById("thumbnail").value

  socket.emit("new_producto",{
    title: title,
    precio: precio,
    thumbnail: thumbnail
  })
  return false



}


socket.on("mensajes", (data) => {
  console.log(data);
  render(data);
});
socket.on("productos", (prod) => {
  renderProducto(prod);
})