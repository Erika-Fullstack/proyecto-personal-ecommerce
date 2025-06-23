import { test, expect } from '@playwright/test';
import productosInfo from '../productos.json';

// Carga de la web
test ('La página carga con el título correcto', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page).toHaveTitle('Rous Meri y su baul');
});

test ('El sitio carga correctamente', async ({ page }) => {
    await page. goto('http://127.0.1:3000/');
    await expect(page).toHaveURL('http://127.0.0.1:3000/');
});

test ('El logo se ve correctamente', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page.locator('img.logo-img')).toBeVisible();
});

test ('El menú de navegación aparece', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page.locator('nav')).toBeVisible();
});

test ('Icono user aparece en el menú', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page.locator('.icons .fa-user')).toBeVisible();
});


test ('Icono carrito aparece en el menú', async ({ page }) => {
    await page.goto('http://127.0.1:3000/');
    await expect(page.locator('.icons .fa-shopping-cart')).toBeVisible();
});


//Listado de productos
test ('Se muestran los productos al cargar la página', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');

    const galeria = page.locator('.gallery');
    await expect(galeria).toBeVisible();

    const productos = page.locator('.gallery .diamond');
    const count = await productos.count();
    expect(count).toBeGreaterThan(0);
});

test ('Cada producto tiene una imagen', async ({ page }) => {   
    await page.goto('http://127.0.0.1:3000/productos.html');
    await expect(page.locator('.gallery .diamond img')).toHaveCount(18);
});

test ('Cada producto tiene un nombre', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');
const productos = page.locator('.gallery .diamond');
const count = await productos.count();

for (let i = 0; i < count; i++) {
    const producto = productos.nth(i); //selecciona el producto uno por uno.
    const dataName = await producto.getAttribute('data-name'); // obtiene el atributo data-name del producto
    expect(dataName).not.toBeNull(); //verifica que el atributo no sea nulo, osea que existe
    expect(dataName).not.toBe(''); //verifica que el atributo no esté vacío
}
});

test ('Cada producto tiene un precio', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');
const productos = page.locator('.gallery .diamond');
const count = await productos.count();

for (let i = 0; i < count; i++) {
    const producto = productos.nth(i); //selecciona el producto uno por uno.
    const dataName = await producto.getAttribute('data-price-range'); // obtiene el atributo data-name del producto
    expect(dataName).not.toBeNull(); //verifica que el atributo no sea nulo, osea que existe
    expect(dataName).not.toBe(''); //verifica que el atributo no esté vacío
}
});


test ('Cada producto tiene descripción', async ({ page }) => {
      test.setTimeout(60000);

    await page.goto('http://127.0.0.1:3000/productos.html');

    for (const producto of productosInfo) {
        const selector = `[data-product-id="${producto.id}"]`;
        const elemento = page.locator(selector);

        await elemento.click();

        const popup = page.locator('#productModal');
        await expect(popup).toBeVisible();

        const descripcion = popup.locator('#modalProductDescription');

        await page.waitForFunction(
        (expected) => {
            const el = document.querySelector('#modalProductDescription');
            return el && el.textContent?.includes(expected);
        },
        producto.description,
        { timeout: 5000 }
        );

        await expect(descripcion).toContainText(producto.description);

        await page.click('#productModal .close-button')
        await expect(popup).toBeHidden(); // Verifica que el popup se cierre después de la interacción
    }
});

test ('Aparece el popup de cada producto al hacer clic', async ({ page }) => {
      test.setTimeout(60000);

    await page.goto('http://127.0.0.1:3000/productos.html');

    const productos = page.locator('.gallery .diamond');
    const count = await productos.count();  

    for (let i = 0; i < count; i++) {
        const producto = productos.nth(i);
        
        await expect(producto).toBeVisible();
        await producto.click();

        const popup = page.locator('#productModal');
        await expect(popup).toBeVisible();

        const closeButton = popup.locator('.close-button');
        await expect(closeButton).toBeVisible({timeout: 15000});
        await page.click('#productModal .close-button', {timeout: 15000});
        await expect(popup).toBeHidden();
    }
});

// Filtrado
test ('El filtro por categoría funciona correctamente', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');    
    const filtro = page.locator('.filter-box');
    await expect(filtro).toBeVisible({timeout: 10000});
});


test('El desplegable de búsqueda muestra resultados relacionados', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/productos.html');

  const filtro = page.locator('.filter-box');
  await expect(filtro).toBeVisible();

  const select = page.locator('#category-select');
  await expect(select).toBeVisible();

  const opciones = select.locator('option');

  // Espera hasta que haya al menos 5 opciones (esperamos el DOM final)
  await expect(opciones).toHaveCount(5, { timeout: 5000 });

  // Verifica los textos
  const textosEsperados = ['Todas', 'Pendientes', 'Llaveros', 'Collar', 'Pulseras'];
  for (let i = 0; i < textosEsperados.length; i++) {
    await expect(opciones.nth(i)).toHaveText(textosEsperados[i]);
  }
});

test('Al seleccionar cada categoría, se muestran solo los productos correspondientes', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://127.0.0.1:3000/productos.html');

  const select = page.locator('#category-select');
  const categorias = ['pendientes', 'llavero', 'collar', 'pulsera'];

  for (const categoria of categorias) {
    // Seleccionar la categoría actual en el <select>
    await select.selectOption(categoria);

    // Esperar a que los productos se actualicen en la galería
    const productosVisibles = page.locator('.gallery .diamond:visible');

    // Esperamos al menos un producto visible
    await expect(productosVisibles.first()).toBeVisible({ timeout: 5000 });

    const count = await productosVisibles.count();
    expect(count).toBeGreaterThan(0);

    // Validamos que todos los productos visibles correspondan a la categoría seleccionada
    for (let i = 0; i < count; i++) {
      const producto = productosVisibles.nth(i);
      const categoriaProducto = await producto.getAttribute('data-category');
      expect(categoriaProducto?.toLowerCase()).toBe(categoria);
    }
  }
});

//Detalle de producto
test('El botón "Añadir al Carrito" existe y es visible al abrir el modal', async ({ page }) => {
  // 1. Ir a la página correcta
  await page.goto('http://127.0.0.1:3000/productos.html', { waitUntil: 'domcontentloaded' });

  // 2. Hacer clic en el primer producto que abre el modal (ajusta el selector si hace falta)
  await page.click('.diamond');

  // 3. Esperar que el modal esté visible
  const modal = page.locator('#productModal');
  await expect(modal).toBeVisible();

  // 4. Verificar que el botón de añadir al carrito esté visible
  const boton = page.locator('#add-to-cart-button');
  await expect(boton).toBeVisible();
});

//Carrito de compras
test ('El carrito de compras se abre al hacer clic en el icono del carrito', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');
    const carritoIcono = page.locator('.icons .fa-shopping-cart');
    await expect(carritoIcono).toBeVisible();
    await carritoIcono.click();
    const carrito = page.locator('#cart-popup');
    await expect(carrito).toBeVisible();
});

test('Cada producto muestra el botón "Añadir al Carrito" al abrirse', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://127.0.0.1:3000/productos.html', { waitUntil: 'domcontentloaded' });

  const productos = page.locator('.gallery .diamond');
  const count = await productos.count();

  for (let i = 0; i < count; i++) {
    const producto = productos.nth(i);
    await producto.click(); // Simula clic en el producto para abrir el modal

    // Espera a que se muestre el modal
    const modal = page.locator('#productModal');
    await expect(modal).toBeVisible();

    // Verifica que el botón está visible
    const botonAgregar = page.locator('#add-to-cart-button');
    await expect(botonAgregar).toBeVisible();

    // Cierra el modal si es necesario antes de pasar al siguiente
    const botonCerrar = page.locator('#productModal .close-button');
    await botonCerrar.click();
  }
});

test ('Puedes agregar un producto al carrito', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/productos.html');
    const producto = page.locator('.gallery .diamond').first();
    await producto.click();
    const modal = page.locator('#productModal');
    await expect(modal).toBeVisible();
    const botonAgregar = page.locator('#add-to-cart-button');
    await expect(botonAgregar).toBeVisible();
    await botonAgregar.click();
    const carrito = page.locator('#cart-popup');
    await expect(carrito).toBeVisible();
    const productosEnCarrito = carrito.locator('.cart-item');
    const count = await productosEnCarrito.count();
    expect(count).toBeGreaterThan(0);
});

test ('Puedes eliminar un producto del carrito', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/productos.html');
    const producto = page.locator('.gallery .diamond').first();
    await producto.click();
    const modal = page.locator('#productModal');
    await expect(modal).toBeVisible(); 
    const botonAgregar = page.locator('#add-to-cart-button');
    await expect(botonAgregar).toBeVisible();
    await botonAgregar.click(); 
    const carrito = page.locator('#cart-popup');
    await expect(carrito).toBeVisible();
    const productosEnCarrito = carrito.locator('.cart-item');
    const count = await productosEnCarrito.count();
    expect(count).toBeGreaterThan(0);
    const botonEliminar = productosEnCarrito.first().locator('.remove-button');
    await expect(botonEliminar).toBeVisible();
    await botonEliminar.click();
    const countDespues = await productosEnCarrito.count();
    expect(countDespues).toBe(0); // Verifica que el carrito esté vacío
});

test('Se actualiza el total automáticamente', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://127.0.0.1:3000/productos.html');

  const producto = page.locator('.gallery .diamond').first();
  await producto.click();

  const modal = page.locator('#productModal');
  await expect(modal).toBeVisible();

  const botonAgregar = page.locator('#add-to-cart-button');
  await expect(botonAgregar).toBeVisible();
  await botonAgregar.click();

  const carrito = page.locator('#cart-popup');
  await expect(carrito).toBeVisible({ timeout: 5000 });

  const total = carrito.locator('.cart-summary');
  await expect(total).toBeVisible({ timeout: 5000 });

  // 🧠 Obtener el precio del producto desde el atributo personalizado
  const precioProducto = await producto.getAttribute('data-price-range');

  if (!precioProducto) throw new Error('El producto no tiene data-price-range');

  // 🧹 Extraer el primer número (en caso de rangos tipo "10-12 €")
  const match = precioProducto.match(/\d+([.,]\d+)?/);
  if (!match) throw new Error(`No se pudo extraer precio numérico de "${precioProducto}"`);
  const precioNumerico = parseFloat(match[0].replace(',', '.'));

  // 💰 Obtener texto del total y extraer el número
  const totalTexto = await total.textContent();
  if (!totalTexto) throw new Error('No se pudo leer el total del carrito');

  const matchTotal = totalTexto.match(/\d+([.,]\d+)?/);
  if (!matchTotal) throw new Error(`No se pudo extraer total de "${totalTexto}"`);
  const totalNumerico = parseFloat(matchTotal[0].replace(',', '.'));

  // ✅ Comprobación final
  expect(totalNumerico).toBe(precioNumerico);
});
