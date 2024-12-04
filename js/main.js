import { Product } from './model.js';
import { Cart } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();

    // Lista de productos
    const products = [
        new Product(1, 'Producto 1', 50, 'assets/images/product.jfif'),
        new Product(2, 'Producto 2', 60, 'assets/images/product.jfif'),
        new Product(3, 'Producto 3', 70, 'assets/images/product.jfif'),
        new Product(4, 'Producto 4', 70, 'assets/images/product.jfif'),
        new Product(5, 'Producto 5', 70, 'assets/images/product.jfif'),
        new Product(6, 'Producto 51', 70, 'assets/images/product.jfif'),
        new Product(7, 'Producto 52', 70, 'assets/images/product.jfif'),
        new Product(8, 'Producto 53', 70, 'assets/images/product.jfif'),
        new Product(9, 'Producto 54', 70, 'assets/images/product.jfif'),
        new Product(10, 'Producto 45', 70, 'assets/images/product.jfif'),
        new Product(11, 'Producto 85', 70, 'assets/images/product.jfif'),
        new Product(12, 'Producto 95', 70, 'assets/images/product.jfif'),
        new Product(13, 'Producto 58', 70, 'assets/images/product.jfif'),
       

        // Agrega más productos aquí...
    ];

 // Renderizar productos en la vista
const productList = document.querySelector('.producto-lista');
products.forEach(product => {
    const productCard = document.createElement('div');

    // Cambié 'prodcuto' por 'producto'
    productCard.classList.add('producto'); 
    productCard.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}">
        <p>Precio: $${product.price}</p>
        <label for="quantity-${product.id}">Cantidad:</label>
        <input id="quantity-${product.id}" type="number" value="1" min="1">
        <button class="add-to-cart">Agregar</button>
    `;
    
    // Evento para agregar al carrito
    productCard.querySelector('.add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(
            document.getElementById(`quantity-${product.id}`).value
        );
        if (quantity > 0) {
            cart.addProduct(product, quantity);
            updateCartView();
        } else {
            alert('Por favor, ingrese una cantidad válida.');
        }
    });

    // Agregar la tarjeta al contenedor
    productList.appendChild(productCard);
});

    // Actualizar la vista del carrito
    function updateCartView() {
        const cartDetails = document.querySelector('.carrito-detalles');
        cartDetails.innerHTML = cart.items
            .map(
                (item, index) => `
            <div>
                <p>${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}</p>
                <button class="remove-from-cart" data-index="${index}">Eliminar</button>
            </div>
        `
            )
            .join('');
        cartDetails.innerHTML += `
            <p><strong>Total: $${cart.getTotal()}</strong></p>
        `;

        // Manejar eliminación de productos
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', e => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.removeProduct(index);
                updateCartView();
            });
        });
    }

    // Manejar el envío del pedido
    document.getElementById('finalizar-compra').addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('El carrito está vacío. Agregue productos antes de finalizar la compra.');
            return;
        }

        const clienteNombre = document.getElementById('cliente-nombre').value.trim();
        const clienteDireccion = document.getElementById('cliente-direccion').value.trim();
        const clienteTelefono = document.getElementById('cliente-telefono').value.trim();
        const clienteIndicaciones = document.getElementById('cliente-indicaciones').value.trim();
        const clienteCambio = document.getElementById('cliente-cambio').value.trim();

        if (!clienteNombre || !clienteDireccion || !clienteTelefono) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        let message = `Pedido:\n`;
        cart.items.forEach(item => {
            message += `${item.name} - Cantidad: ${item.quantity}, Precio: $${item.price} x ${item.quantity} = $${item.price * item.quantity}\n`;
        });
        message += `\nTotal: $${cart.getTotal()}\n`;
        message += `\nDatos del Cliente:\n`;
        message += `Nombre: ${clienteNombre}\n`;
        message += `Dirección: ${clienteDireccion}\n`;
        message += `Teléfono: ${clienteTelefono}\n`;
        message += `Indicaciones: ${clienteIndicaciones || 'Ninguna'}\n`;
        if (clienteCambio) {
            message += `Cambio requerido para: $${clienteCambio}\n`;
        }

        // Geolocalización
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                message += `Ubicación: https://www.google.com/maps?q=${latitude},${longitude}\n`;
                sendOrderToWhatsApp(message);
            }, () => {
                alert('No se pudo obtener la ubicación. Enviando sin ubicación.');
                sendOrderToWhatsApp(message);
            });
        } else {
            alert('Geolocalización no soportada. Enviando sin ubicación.');
            sendOrderToWhatsApp(message);
        }
    });

    // Función para enviar mensaje por WhatsApp
    function sendOrderToWhatsApp(message) {
        const phoneNumber = '3043108888';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
});
