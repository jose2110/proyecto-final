const Clickbutton = document.querySelectorAll('.button');
const comprarbutton = document.getElementById('crear-preferencia');
const tbody = document.querySelector('.tbody');
const URL_API = 'https://api.mercadopago.com/checkout/preferences';
let carrito = [];

Clickbutton.forEach((btn) => {
  btn.addEventListener('click', addToCarritoItem);
});

function addToCarritoItem(e) {
  const button = e.target;
  const item = button.closest('.card');
  const itemTitle = item.querySelector('.card-title').textContent;
  const itemPrice = item.querySelector('.precio').textContent;
  const itemImg = item.querySelector('.card-img-top').src;

  const price = itemPrice.split('$')[1].trim();

  const newItem = {
    title: itemTitle,
    precio: price,
    img: itemImg,
    cantidad: 1,
  };

  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  const alert = document.querySelector('.alert');

  setTimeout(function () {
    alert.classList.add('hide');
  }, 2000);
  alert.classList.remove('hide');

  const InputElemnto = tbody.getElementsByClassName('input__elemento');
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemnto[i];
      inputValue.value++;
      CarritoTotal();
      return null;
    }
  }

  carrito.push(newItem);

  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = '';
  carrito.map((item) => {
    const tr = document.createElement('tr');
    tr.classList.add('ItemCarrito');
    const Content = `
    
          <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `;
    tr.innerHTML = Content;

    tbody.append(tr);

    tr.querySelector('.delete').addEventListener('click', removeItemCarrito);
    tr.querySelector('.input__elemento').addEventListener(
      'change',
      sumaCantidad
    );
  });

  console.log('CARRITO', carrito);
  CarritoTotal();
}

function CarritoTotal() {
  let Total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal');
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace('$', ''));
    Total = Total + precio * item.cantidad;
  });

  itemCartTotal.innerHTML = `Total $${Total}`;
  addLocalStorage();
}

function removeItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest('.ItemCarrito');
  const title = tr.querySelector('.title').textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1);
    }
  }

  const alert = document.querySelector('.remove');

  setTimeout(function () {
    alert.classList.add('remove');
  }, 2000);
  alert.classList.remove('remove');

  tr.remove();
  CarritoTotal();
}

function sumaCantidad(e) {
  const sumaInput = e.target;
  const tr = sumaInput.closest('.ItemCarrito');
  const title = tr.querySelector('.title').textContent;
  carrito.forEach((item) => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal();
    }
  });
}

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
};

const nombre = document.getElementById('name');
const email = document.getElementById('email');
const pass = document.getElementById('password');
const form = document.getElementById('form');
const parrafo = document.getElementById('warnings');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let warnings = '';
  let entrar = false;
  let regexemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  parrafo.innerHTML = '';
  if (nombre.value.length < 6) {
    warnings += `el nombre no es valido`;
    entrar = true;
  }
  if (regexemail.test(email)) {
    warnings += `el email no es valido <br>`;
    entrar = true;
  }
  if (pass.value.length < 8) {
    warnings += `la contraseña no es valida`;
    entrar = true;
  }
  if (entrar) {
    parrafo.innerHTML = warnings;
  } else {
    parrafo.innerHTML = 'enviado';
  }
});

$('.nombre').show(2000);

comprarbutton.addEventListener('click', async () => {
  try {
    const items = carrito.map((e) => {
      console.log(e);
      return {
        title: `${e.titel}`,
        description: `${e.title}`,
        picture_url: `${e.img}`,
        quantity: e.cantidad,
        currency_id: 'ARS',
        unit_price: parseFloat(e.precio),
      };
    });

    const pref = {
      items: items,
      back_urls: {
        success: 'http://localhost:5500/index.html',
        failure: 'http://localhost:5500/index.html',
        pending: 'http://localhost:5500/index.html',
      },
      auto_return: 'approved',
    };
    const response = await fetch(URL_API, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer TEST-1320741243998699-092300-ad0dcf053c28355e987290623ae7ba25-377122424',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pref),
    });

    const jsonRes = await response.json();

    window.location = jsonRes.init_point;
  } catch (error) {
    console.log(error);
  }
});
