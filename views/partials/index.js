const socket = io.connect();



function render(data){
  const html = data.map(elem => `<div>
  <span style="font-weight: bold;color:blue;font-size: 25px;">${elem.author.id}</span>

  <p style="color: green;font-size:20px"> ${elem.msj.msj}</p>
  </div>`).join(' ');
  document.getElementById('mensajes-chat').innerHTML = html; 
}

function enviarMensaje(event) {
  const email = document.getElementById("email").value;
  const msj = document.getElementById("chat_mensaje").value;
  const fecha = new Date().toLocaleDateString()+ ' ' +new Date().toTimeString()
  const fyh = fecha.split(' ');
  socket.emit("new_msj", {
    email: email,
    date: fyh[0]+" "+fyh[1],
    msj: msj,
    
  });
  document.getElementById("chat_mensaje").value = "";
  return false;
}

socket.on("new_producto", (prod) => {
  
  renderProducto(prod);
})
//productos
function renderProducto(prod){
  const html = prod.map(elem => `
  <tr>
  <th >${elem.id}</th>
  <td>${elem.title}</td>
  <td>$${elem.price}</td>
  <td><img rel="icon" src="${elem.thumbnail}" style="width: 30px; height: 30px;" /></td>
  </tr>`).join(' ');
  document.getElementById('lista-productos').innerHTML = html;
}

function enviarProducto(prod){
  const title= document.getElementById("title").value
  const price= document.getElementById("precio").value
  const thumbnail= document.getElementById("thumbnail").value

  socket.emit("new_producto",{
    title: title,
    price: price,
    thumbnail: thumbnail
  })
  return false

}