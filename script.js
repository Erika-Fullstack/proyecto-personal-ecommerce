
    // FILTRADO 
    function filterProducts(searchText, categories, priceRange) {
        const productDiamonds = document.querySelectorAll('.diamond');

        productDiamonds.forEach(diamond => {
            const productCategory = diamond.dataset.category;
            const productPriceRange = diamond.dataset.priceRange;
            const productName = diamond.dataset.name ? diamond.dataset.name.toLowerCase() : '';

            let matchesCategory = true;
            if (categories.length > 0) {
                matchesCategory = categories.includes(productCategory);
            }

            let matchesPriceRange = true;
            if (priceRange) {
                matchesPriceRange = (productPriceRange === priceRange);
            }

            let matchesSearchText = true;
            if (searchText) {
                matchesSearchText = productName.includes(searchText);
            }

            if (matchesCategory && matchesPriceRange && matchesSearchText) {
                diamond.style.display = '';
            } else {
                diamond.style.display = 'none';
            }
        });
    }


    // Lógica para el popup de productos
    const productDiamonds = document.querySelectorAll('.diamond');
    const productModal = document.getElementById('productModal');
    const modalCloseButton = productModal ? productModal.querySelector('.close-button') : null;

    if (productDiamonds.length > 0 && productModal && modalCloseButton) {
        productDiamonds.forEach(diamond => {
            diamond.addEventListener('click', () => {
                const img = diamond.querySelector('img');
                const name = diamond.dataset.name;
                const description = "Descripción del producto..."; 
                const price = "Precio: " + diamond.dataset.priceRange + " €"; 

                document.getElementById('modalProductImage').src = img.src;
                document.getElementById('modalProductName').textContent = name;
                document.getElementById('modalProductDescription').textContent = description;
                document.getElementById('modalProductPrice').textContent = price;

                // Lógica para colores
                const productColorsContainer = document.getElementById('productColorsContainer');
                const productColorsSelect = document.getElementById('productColors');
                const colorsData = diamond.dataset.colors;
                if (colorsData) {
                    const colorsArray = colorsData.split(',');
                    productColorsSelect.innerHTML = ''; 
                    colorsArray.forEach(color => {
                        const option = document.createElement('option');
                        option.value = color.trim();
                        option.textContent = color.trim();
                        productColorsSelect.appendChild(option);
                    });
                    productColorsContainer.style.display = 'block';
                } else {
                    productColorsContainer.style.display = 'none';
                }

                productModal.style.display = 'block'; 
            });
        });

        modalCloseButton.addEventListener('click', () => {
            productModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.style.display = 'none'; 
            }
        });
    }

// Slide
  let currentIndex = 0;

  function moveSlide(direction) {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
      currentIndex = 0;
    }

    const offset = -currentIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;
  }

//Abrir y cerrar popups
    const cartIcon = document.querySelector('.icons .fa-shopping-cart');
    const userIcon = document.querySelector('.icons .fa-user');
    const cartPopup = document.getElementById('cart-popup');
    const userPopup = document.getElementById('user-popup');
    const registerPopup = document.getElementById('register-popup');

    const closeButtons = document.querySelectorAll('.popup .close-button');

    function openPopup(popupElement) {
      if (popupElement) popupElement.style.display = 'flex';
    }

    function closePopup(popupElement) {
      if (popupElement) popupElement.style.display = 'none';
    }

    if (cartIcon) {
      cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(userPopup);
        closePopup(registerPopup);
        openPopup(cartPopup);
      });
    }

    if (userIcon) {
      userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(cartPopup);
        openPopup(userPopup);
      });
    }

    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const popupToClose = e.target.closest('.popup');
        closePopup(popupToClose);
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup')) {
        closePopup(e.target);
      }
    });

    document.getElementById('open-register').addEventListener('click', (e) => {
      e.preventDefault();
      closePopup(userPopup);
      openPopup(registerPopup);
    });

    document.getElementById('open-login').addEventListener('click', (e) => {
      e.preventDefault();
      closePopup(registerPopup);
      openPopup(userPopup);
    });

//Logueo de usuarios
function verificar(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Usuario fijo para validar
    const usuarioFijo = {
        usuario: "erikanm@example.com", 
        contrasena: "1234"
    }

    if (email === usuarioFijo.usuario && password === usuarioFijo.contrasena) {
        alert("¡Login exitoso! Bienvenid@");
    } else {
        alert("Oh oh! Revisa tus datos...");
    }
}

// Añadimos el listener al formulario para capturar el submit
document.getElementById("login-form").addEventListener("submit", verificar);


// Registro de usuarios
function registrar(event) {
    event.preventDefault();

    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const mensaje = document.getElementById("register-message");

    // Validaciones simples
    if (email === "" || password === "") {
        mensaje.textContent = "Por favor completa todos los campos.";
        return;
    }

    if (!email.includes("@")) {
        mensaje.textContent = "Ingresa un correo electrónico válido.";
        return;
    }

    if (password.length < 4) {
        mensaje.textContent = "La contraseña debe tener al menos 4 caracteres.";
        return;
    }

    // Simulamos registro exitoso
    mensaje.style.color = "green";
    mensaje.textContent = "¡Registro exitoso! Ya puedes iniciar sesión.";

}

// Asociamos el evento submit al formulario de registro
document.getElementById("register-form").addEventListener("submit", registrar);


