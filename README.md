# Inditex Frontend Test — Tienda de Dispositivos Móviles

Mini-aplicación SPA de compra de dispositivos móviles desarrollada como prueba técnica para Inditex.

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación

```bash
npm install
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia el servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Genera el bundle de producción en la carpeta `dist/` |
| `npm test` | Ejecuta la suite de tests con Vitest |
| `npm run lint` | Analiza el código fuente con ESLint |

---

## Vistas de la aplicación

- **`/`** — Listado de productos (PLP): muestra todos los dispositivos disponibles con búsqueda en tiempo real por marca y modelo.
- **`/product/:id`** — Detalle del producto (PDP): imagen, especificaciones técnicas completas y selector de opciones (almacenamiento y color) para añadir al carrito.

---

## Decisiones arquitectónicas

### SPA con Vanilla JavaScript, sin SSR
La aplicación es una Single Page Application construida con React y `react-router-dom` v6 para el enrutado en cliente. Se ha evitado deliberadamente cualquier solución de Server-Side Rendering (Next.js, Remix) para cumplir con los requisitos de la prueba. Todo el enrutado ocurre en el navegador.

### Estado global del carrito con React Context y localStorage
El contador del carrito se gestiona a través de un `CartContext` (React Context API + `useState`). El valor se persiste en `localStorage` bajo la clave `cartCount`, por lo que sobrevive a recargas de página. El dato se inicializa desde `localStorage` en el primer render y se actualiza de forma síncrona en cada llamada a la API del carrito.

### Sistema de caché en cliente con expiración de 1 hora
Todas las llamadas a la API (`GET /api/product` y `GET /api/product/:id`) pasan por `src/services/cache.js` antes de realizar la petición de red. La caché almacena los datos en `localStorage` junto con un `timestamp`. La expiración es de exactamente **3 600 000 ms (1 hora)**. Si los datos existen y no han expirado, se devuelven directamente; en caso contrario se invalida la entrada y se vuelve a consultar el API.

---

## Integración con la API

Base URL: `https://itx-frontend-test.onrender.com`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/product` | Obtiene el listado completo de productos |
| `GET` | `/api/product/:id` | Obtiene el detalle de un producto |
| `POST` | `/api/cart` | Añade un producto al carrito |

El body del `POST /api/cart` tiene la siguiente estructura:

```json
{
  "id": "string",
  "colorCode": 1,
  "storageCode": 2
}
```

La respuesta devuelve `{ "count": N }` con el número total de productos en el carrito.

---

## Tecnologías utilizadas

- **React 18** con Hooks
- **react-router-dom v6** — enrutado en cliente
- **Vite 5** — bundler y servidor de desarrollo
- **Vitest + Testing Library** — tests unitarios
- **ESLint** — análisis estático de código
