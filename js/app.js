async function cargarJuegos() {
	try {
	  const respuesta = await fetch('juegos.json');
	  const juegos = await respuesta.json();
	  const listaJuegos = document.getElementById('lista-juegos');
	  juegos.forEach(juego => {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.href = juego.url;
		link.textContent = `${juego.titulo} (${juego.plataforma}) - $${juego.precio}`;
  
		const boton = document.createElement('button');
		boton.textContent = 'Agregar al carrito';
		boton.addEventListener('click', () => {
		  agregarAlCarrito(juego);
		  actualizarCarrito();
		  renderizarCarrito(carrito);
		});
  
		item.appendChild(link);
		item.appendChild(boton);
		listaJuegos.appendChild(item);
	  });
	} catch (error) {
	  console.error(error);
	}
  }
  
  function agregarAlCarrito(juego) {
	let carrito = obtenerCarrito().carrito;
	const juegoEnCarrito = carrito instanceof Array && carrito.find(item => item.id === juego.id);
	if (juegoEnCarrito) {
	  juegoEnCarrito.cantidad++;
	} else {
	  carrito.push({
		id: juego.id,
		titulo: juego.titulo,
		plataforma: juego.plataforma,
		precio: juego.precio,
		cantidad: 1
	  });
	}
	localStorage.setItem('carrito', JSON.stringify(carrito));
	renderizarCarrito(carrito);
  }

  function renderizarCarrito(carrito) {
	const carritoElement = document.getElementById("carrito");
	carritoElement.innerHTML = "";
  
	carrito.forEach((item) => {
	  const itemElement = document.createElement("li");
	  itemElement.innerText = `${item.titulo} - $${item.precio}`;
	  carritoElement.appendChild(itemElement);
	});
  }
  

  function obtenerCarrito() {
	let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	let resumenCarrito = 0; // inicializa la variable en 0
  
	if (carrito && carrito.length > 0) {
	  const resumen = carrito.reduce((acc, juego) => acc + juego.precio, 0);
	  resumenCarrito = resumen !== null ? resumen : 0;
	}
  
	return { carrito, resumenCarrito };
  }
  
//   function obtenerCarrito() {
// 	let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

//   if (carrito && carrito.length > 0) {
//     let resumenCarrito = carrito.reduce((acc, juego) => acc + juego.precio, 0);
//     return { carrito, resumenCarrito };
//   } else {
//     return { carrito: [], resumenCarrito: 0 };
//   }
// 	// let carrito = localStorage.getItem('carrito');
// 	// if (carrito) {
// 	//   return JSON.parse(carrito);
// 	// }
// 	// return [];
//   }
  
  function actualizarCarrito() {
	const carrito = obtenerCarrito();
	const listaCarrito = document.getElementById('lista-juegos');
	listaCarrito.innerHTML = '';
  
	if (!Array.isArray(carrito) || carrito.length === 0) {
	  listaCarrito.innerHTML = '<li>El carrito está vacío</li>';
	} else {
	  carrito.forEach(item => {
		const li = document.createElement('li');
		li.innerHTML = `${item.titulo} (${item.plataforma}) - $${item.precio} x ${item.cantidad}`;
		listaCarrito.appendChild(li);
	  });
	}
  
	const subtotal = Array.isArray(carrito) ? carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0) : 0;
	const total = subtotal * 1.16;
	const resumenCarrito = document.getElementById('total-carrito');
	resumenCarrito.innerHTML = `Subtotal: $${subtotal.toFixed(2)} <br> Total (con IVA): $${total.toFixed(2)}`;

	renderizarCarrito(carrito);
  }
  
  cargarJuegos();
  actualizarCarrito();
  renderizarCarrito(obtenerCarrito().carrito);

  