import { test, expect } from '@playwright/test';
import productosInfo from '../productos.json';

// Carga de la web
test ('La página carga con el título correcto', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page).toHaveTitle('Rous Meri y su baul');
});

test ('El sitio carga correctamente', async ({ page }) => {
    await page.goto('http://127.0.1:3000/');
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