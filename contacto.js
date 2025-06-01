// SCRIPT LOGIN //
const userInfo = document.getElementById("user-info");
const usernameButton = document.getElementById("username-button");
const loginButton = document.getElementById('loginButton');
const loginPopup = document.getElementById('loginPopup');
const closePopup = document.getElementById('loginClose');
const ojito = document.getElementById('ojito');
const password = document.getElementById('password');

loginButton.addEventListener('click', () => {
    loginPopup.style.display = 'block';
});

closePopup.addEventListener("click", () => {
  loginPopup.style.display = "none";
});


document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); 

      const username = document.getElementById("username").value;
      const passwordValue = document.getElementById("password").value;
 
      const userData = {
        username: username,
        password: passwordValue,
      };
    // Comprobamos si el usuario es el administrador
      if (username === "nahia" && passwordValue === "ahia") {
          userData.isAdmin = true; 
      }
    //guardamos el userData dentro del localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
    //si el login es admin redirigir a la pagina respectiva
      if (userData.isAdmin) {
        window.location.href = "administrador.html";  
      }
      else {
        // Si no es admin, redirigir a la página de usuario
        window.location.href = "usuario.html"; 
      }
    });
  }

  //icono y el boton del usuario
  // Verificar el estado del usuario para mostrar login o nombre de usuario
  const usernameButton = document.getElementById("usernameButton");
  const userInfo = document.getElementById("userInfo");

  //Obtiene los datos guardados como una cadena JSON y los guarda en una variable
  const userData = JSON.parse(localStorage.getItem("userData"));

 //Se comprueba si existe el objeto userData y si tiene una propiedad username. Esto indica que el usuario está logeado y tiene un nombre de usuario registrado.
  if (userData && userData.username) {
    // Si el usuario está logueado, muestra el nombre de usuario y quita el icon de login.
    //verificamos que las tres cosas existen en el DOM y despues se cambia al boton de usuario con la info de localStorage.
    if (loginButton && userInfo && usernameButton) {
      loginButton.style.display = "none";
      userInfo.style.display = "block";
      usernameButton.textContent = userData.username;

      // Agregar evento para redirigir a usuario.html
      usernameButton.addEventListener("click", () => {
        window.location.href = "contacto.html";
      });
    }
  } else {
    // Si no está logeado, mostrar el icono del login
    if (loginButton && userInfo && usernameButton) {
      loginButton.style.display = "block";
      userInfo.style.display = "none";
    }
  }

  // Manejar la carga de datos en usuario.html y cambia los valores a los guardados en el localstorage
  if (window.location.pathname.includes("usuario.html")) {
    const usernameDisplay = document.getElementById("username-display");
    const passwordDisplay = document.getElementById("current-password");

    if (usernameDisplay && userData) {
      // Mostrar el nombre de usuario
      usernameDisplay.textContent =
        userData.username || "Usuario no registrado";
      passwordDisplay.value = userData.password || "";
    }
  }
});