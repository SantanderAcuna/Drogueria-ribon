import { Product } from './model.js';
import { Cart } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();

    // Lista de productos
    const products = [
        new Product(1, 'Atencion Medica Domiciliaria Santa Marta',
            'Experimente la comodidad y la tranquilidad de acceder a atención médica profesional en la privacidad de su hogar. Nuestro servicio está disponible dentro del perímetro urbano, y también atendemos fuera de este área con precios ajustados. Consulte para más detalles y descubra cómo cuidarse nunca ha sido tan práctico y accesible.',
            100000,
            'assets/images/medicoDomi.jpg'
        ),
        new Product(2, 'Venta de medicamentos',
            'Ofrecemos un servicio confiable de venta de medicamentos con entrega directa a tu domicilio. Simplifica tu vida y asegura el acceso a los tratamientos que necesitas, sin salir de casa. Disponible dentro del perímetro urbano, con opciones de envío fuera del área urbana bajo consulta. Solicita más información y cuida de tu salud de manera rápida, cómoda y segura.',
            10000,
            'assets/images/logo.jpg'

        ),
        new Product(3, 'ElectroCardiograma',
            'Servicio de Electrocardiograma con Interpretación Experta:Acceda a un diagnóstico preciso y profesional con nuestro servicio de electrocardiograma, que incluye una interpretación detallada realizada por especialistas. Ideal para monitorear su salud cardíaca con comodidad y confianza, asegurando resultados confiables para el cuidado de su bienestar',
            50000,
            'assets/images/electro.jpg'
        ),





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
        <img src="${product.image}" width="50px"  alt="${product.name}">
        <p>Precio: $${product.descripcion}</p>
        <p>${product.price}</p>
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
                <p>${item.name} - $${item.descripcion} x ${item.quantity} = $${item.descripcion * item.quantity}</p>
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
            message += `${item.name} - Cantidad: ${item.quantity}, Precio: $${item.descripcion} x ${item.quantity} = $${item.descripcion * item.quantity}\n`;
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
        const phoneNumber = '573003519447';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
});
