document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const productModal = document.getElementById('productModal');
    const closeButton = document.querySelector('.close-button');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductImage = document.getElementById('modalProductImage');

    // Nuevas referencias para los elementos de color
    const productColorsContainer = document.getElementById('productColorsContainer');
    const productColorsSelect = document.getElementById('productColors');

    let productsData = []; // Almacenaje los datos de los productos cargados del JSON

    // Función para cargar los datos de los productos desde el JSON
    async function loadProducts() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) {
                // Si la respuesta no es OK (ej. 404 Not Found), lanza un error
                throw new Error(`HTTP error! status: ${response.status} - Archivo products.json no encontrado o con error.`);
            }
            const data = await response.json();
            
            if (data.productos) {
                productsData = data.productos;
            } else {
                productsData = data;
            }

            console.log('Productos cargados:', productsData); 
            if (productsData.length === 0) {
                console.warn('El archivo products.json se cargó pero no contiene productos.');
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            alert('Hubo un problema al cargar la información de los productos. Revisa la consola para más detalles.');
        }
    }

    // Función para mostrar el popup con la información del producto
    function showProductModal(product) {
        if (!product) {
            console.error('Producto no encontrado.');
            return;
        }
        modalProductName.textContent = product.name; 
        modalProductDescription.textContent = product.description; 
        modalProductPrice.textContent = product.price; 
        modalProductImage.src = product.imageUrl; 
        modalProductImage.alt = product.name;

        // Limpiar opciones de color anteriores
        productColorsSelect.innerHTML = '';
        productColorsContainer.style.display = 'none'; 

        if (product.colors && product.colors.length > 0) {
            product.colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.toLowerCase().replace(/\s/g, '-');
                option.textContent = color;
                productColorsSelect.appendChild(option);
            });
            productColorsContainer.style.display = 'flex';
        }

        productModal.style.display = 'flex';
    }

    // Función para cerrar el popup
    function closeProductModal() {
        productModal.style.display = 'none';
    }

    // Event Listener para los clics en la galería
    galleryGrid.addEventListener('click', (event) => {
        const clickedDiamond = event.target.closest('.diamond');
        
        if (clickedDiamond) {
            const productId = clickedDiamond.dataset.productId;
            
            if (productId && productsData.length > 0) {
                const product = productsData.find(p => p.id === productId);
                if (product) {
                    showProductModal(product);
                } else {
                    console.warn(`No se encontró el producto con ID: ${productId} en los datos cargados.`);
                }
            } else if (!productId) {
                console.warn('El elemento clicado no tiene un data-product-id.');
            }
        }
    });

    // Event Listener para cerrar el popup al hacer clic en el botón de cerrar
    closeButton.addEventListener('click', closeProductModal);

    // Event Listener para cerrar el popup al hacer clic fuera del contenido del popup
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeProductModal();
        }
    });

    // Cargar los productos cuando el DOM esté completamente cargado
    loadProducts();
});

//carrito
// Array para almacenar productos en el carrito
const carrito = [];

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const cartItemsContainer = document.querySelector("#cart-popup .cart-items");
    const cartTotalSpan = document.getElementById("cart-total");
    
    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888;">Tu carrito está vacío.</p>';
        cartTotalSpan.textContent = "0.00 €";
        return;
    }
    
    // Si hay productos, mostrar cada uno
    cartItemsContainer.innerHTML = ""; // limpiar antes
    
    let total = 0;
    
    carrito.forEach((producto, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.style.display = "flex";
        itemDiv.style.justifyContent = "space-between";
        itemDiv.style.marginBottom = "10px";
        
        itemDiv.innerHTML = `
            <div>
                <strong>${producto.nombre}</strong><br>
                ${producto.color ? `Color: ${producto.color}<br>` : ""}
                Precio: ${producto.precio.toFixed(2)} €
            </div>
            <button data-index="${index}" style="background: none; border: none; color: red; cursor: pointer;">✖</button>
        `;
        
        // Botón para eliminar producto del carrito
        itemDiv.querySelector("button").addEventListener("click", (e) => {
            const idx = e.target.getAttribute("data-index");
            carrito.splice(idx, 1);
            actualizarCarrito();
        });
        
        cartItemsContainer.appendChild(itemDiv);
        
        total += producto.precio;
    });
    
    cartTotalSpan.textContent = total.toFixed(2) + " €";
}

//añadir al carrito
document.getElementById("add-to-cart-button").addEventListener("click", () => {
    // Obtener datos del popup
    const nombre = document.getElementById("modalProductName").textContent;
    const precioTexto = document.getElementById("modalProductPrice").textContent; // ej: "15.99 €"
    const precio = parseFloat(precioTexto.replace("€", "").trim());
    const colorSelect = document.getElementById("productColors");
    let color = null;
    if (colorSelect && colorSelect.style.display !== "none") {
        color = colorSelect.value;
    }

    // Crear producto
    const producto = {
        nombre,
        precio,
        color
    };

    // Añadir al carrito
    carrito.push(producto);

    // Actualizar carrito
    actualizarCarrito();

    // Mostrar popup del carrito
    document.getElementById("cart-popup").style.display = "block";
});


// resumen de compra
const confirmPopup = document.getElementById("confirm-popup");
const confirmItems = document.getElementById("confirm-items");
const confirmTotal = document.getElementById("confirm-total");

document.querySelector("#cart-popup .checkout-button").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Limpiar contenido anterior
    confirmItems.innerHTML = "";

    // Mostrar cada producto
    carrito.forEach(prod => {
        const div = document.createElement("div");
        div.style.marginBottom = "10px";
        div.textContent = `${prod.nombre}${prod.color ? " - " + prod.color : ""}: ${prod.precio.toFixed(2)} €`;
        confirmItems.appendChild(div);
    });

    // Mostrar total
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    confirmTotal.textContent = total.toFixed(2);

    // Mostrar popup
    confirmPopup.style.display = "flex";
});

// Botones del popup confirmación
confirmPopup.querySelector(".close-button").addEventListener("click", () => {
    confirmPopup.style.display = "none";
});

document.getElementById("confirm-cancel").addEventListener("click", () => {
    confirmPopup.style.display = "none";
});

document.getElementById("confirm-ok").addEventListener("click", () => {
    alert("¡Compra confirmada! Gracias por tu pedido.");
    carrito.length = 0; // vaciar carrito
    actualizarCarrito();
    confirmPopup.style.display = "none";
    document.getElementById("cart-popup").style.display = "none"; // cerrar carrito
});


//filtros
document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filter-button");
  const categorySelect = document.getElementById("category-select");
  const products = document.querySelectorAll(".diamond");

  filterButton.addEventListener("click", function () {
    const selectedCategory = categorySelect.value;

    products.forEach(product => {
      const productCategory = product.getAttribute("data-category");

      const categoryMatch = selectedCategory === "all" || productCategory === selectedCategory;

      if (categoryMatch) {
        product.style.display = "inline-block"; 
      } else {
        product.style.display = "none";
      }
    });
  });
});