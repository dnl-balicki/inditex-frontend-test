# MobileShop — Prueba Técnica Frontend de Inditex

Aplicación de catálogo de smartphones con carrito de compra, construida con **React 18**, **React Router v6** y **Vanilla JavaScript (ES6)**. El proyecto ha sido sometido a una refactorización orientada a la separación de responsabilidades, la robustez frente a errores y la mejora de la experiencia de usuario.

---

## Arquitectura: Separación en Capas

El objetivo principal de la refactorización fue desacoplar completamente la lógica de negocio de los componentes de presentación, organizando el código en capas con responsabilidades bien definidas.

### Capa de Servicios — `src/services/`

Única responsable de toda comunicación con la API y con el almacenamiento local.

**`api.js`** centraliza todas las peticiones HTTP a través de una función auxiliar privada `request()`. Esta función verifica `response.ok` antes de parsear la respuesta y lanza un error descriptivo con el código de estado HTTP en caso de fallo, evitando que la aplicación procese silenciosamente cuerpos de error HTML como si fueran JSON válido. Las funciones `getProducts` y `getProduct` aceptan un parámetro `signal` para soportar la cancelación de peticiones.

**`cache.js`** implementa un sistema de caché sobre `localStorage` con un TTL de 1 hora. La lectura del caché envuelve `JSON.parse` en un bloque `try/catch`: si los datos almacenados están malformados —por corrupción, cambio de esquema o manipulación manual— la entrada se elimina automáticamente y se devuelve `null`, evitando que un error de parseo rompa la aplicación.

### Capa de Custom Hooks — `src/hooks/`

La refactorización central del proyecto. Toda la orquestación asíncrona —estado de carga, manejo de errores, cancelación de peticiones— fue extraída de los componentes de vista a hooks reutilizables. Los componentes quedan con una única responsabilidad: renderizar los datos que reciben.

| Hook | Responsabilidad |
|---|---|
| `useProducts` | Obtiene el listado completo de productos y expone `{ data, isLoading, error }` |
| `useProductDetail` | Obtiene un producto concreto por `id`; reinicia el estado en cada cambio de `id` |
| `useCart` | Lee `cartCount` del contexto global y expone `addToCart`, que llama a la API y reemplaza el total con el valor exacto devuelto por la respuesta |

### Capa de Estado Global — `src/context/`

`CartContext.jsx` es ahora un **proveedor fino** (*thin provider*): únicamente mantiene el estado `cartCount` con su setter sincronizado con `localStorage`. Toda la lógica de negocio del carrito reside exclusivamente en el hook `useCart`.

### Capa de Presentación — `src/pages/` y `src/components/`

Los componentes de vista reciben sus datos a través de los hooks y se limitan a renderizar. No contienen lógica de fetching ni conocen la estructura interna de la API.

---

## Robustez y Manejo de Errores

### Validación de respuestas HTTP

`api.js` comprueba `response.ok` antes de invocar `.json()`. Si el servidor responde con un código de error (4xx, 5xx), se lanza un `Error` con el código de estado, impidiendo que la aplicación procese silenciosamente una respuesta de fallo del servidor.

### Cancelación de peticiones con AbortController

Los hooks `useProducts` y `useProductDetail` crean un `AbortController` por efecto. La función de limpieza del `useEffect` llama a `controller.abort()` y activa un flag `cancelled` que bloquea cualquier actualización de estado si el componente se desmonta mientras hay una petición en vuelo. Esto elimina las condiciones de carrera y previene actualizaciones de estado sobre componentes desmontados.

### localStorage seguro

`cache.js` protege la lectura con `try/catch`. `CartContext` hace lo mismo en el inicializador del estado, por lo que un valor corrupto en `localStorage` no impide que la aplicación arranque: simplemente se recupera el estado inicial (`0` para el contador del carrito, `null` para el caché).

### Corrección del recuento del carrito

El endpoint `POST /api/cart` devuelve el **total exacto** de artículos en el carrito, no un delta incremental. La implementación anterior sumaba el valor recibido al estado previo, inflando el contador en cada llamada. `useCart` ahora ejecuta `setCartCount(result.count)`, reemplazando el valor en lugar de acumularlo.

---

## Mejoras de UI/UX

### Skeleton Loading

Un componente `<Skeleton>` reutilizable, animado con un efecto *shimmer*, reemplaza el texto genérico "Loading..." en ambas vistas principales. En `ProductList` se renderizan 8 tarjetas fantasma que replican la estructura de la cuadrícula; en `ProductDetail` se muestra un esqueleto que refleja el layout de la columna de información.

### Toast de confirmación del carrito

Tras añadir un artículo al carrito con éxito, aparece una notificación flotante en la parte inferior de la pantalla durante 3 segundos. El temporizador se gestiona con `useRef` para evitar condiciones de carrera si el usuario pulsa el botón varias veces antes de que expire la notificación anterior.

### Paginación en el cliente

`ProductList` muestra un máximo de **10 productos por página**. Los controles Anterior / Siguiente aparecen únicamente cuando hay más de una página. Al modificar el término de búsqueda, el número de página se reinicia automáticamente a 1.

### Estado vacío explícito

Cuando el filtro de búsqueda no produce resultados, se muestra un estado vacío con título y subtítulo descriptivos en lugar de un espacio en blanco.

### HTML Semántico y Accesibilidad

`ProductCard` utiliza el componente `<Link>` de React Router en lugar de `<div role="button">`. El navegador gestiona de forma nativa el comportamiento del teclado, el foco visible y los atributos ARIA, eliminando el handler `onKeyDown` manual y el `tabIndex` explícito.

### Carga diferida de imágenes

Todas las imágenes de producto incluyen el atributo `loading="lazy"`, difiriendo su descarga hasta que entran en el viewport y reduciendo el coste de carga inicial de la página.

### Especificaciones técnicas dinámicas

`ProductDetail` mapea las filas de especificaciones a partir de una tabla de definiciones (`SPEC_ROWS`) en lugar de codificarlas manualmente. Si la API añade o elimina campos, la tabla de especificaciones se actualiza de forma automática sin necesidad de modificar el componente.

---

## Integración con la API

**Base URL:** `https://itx-frontend-test.onrender.com/api`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/product` | Listado completo de productos |
| `GET` | `/product/:id` | Detalle de un producto |
| `POST` | `/cart` | Añade un producto al carrito; devuelve `{ count: N }` con el total exacto |

El cuerpo del `POST /cart`:

```json
{
  "id": "string",
  "colorCode": 1,
  "storageCode": 2
}
```

> El servidor se aloja en el plan gratuito de Render y puede tardar unos segundos en responder tras un período de inactividad.

---

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header/
│   ├── ProductCard/         # usa <Link> semántico
│   ├── SearchBar/
│   └── Skeleton/            # componente nuevo
├── context/
│   └── CartContext.jsx      # thin provider
├── hooks/                   # capa nueva
│   ├── useCart.js
│   ├── useProductDetail.js
│   └── useProducts.js
├── pages/
│   ├── ProductDetail/       # specs dinámicas, lazy image, toast
│   └── ProductList/         # skeleton, paginación, estado vacío
├── services/
│   ├── api.js               # validación HTTP, soporte de señal
│   └── cache.js             # try/catch en JSON.parse
├── App.jsx
├── index.css                # animación skeleton-pulse global
└── index.jsx
```

---

## Instalación y Ejecución

### Requisitos previos

- Node.js ≥ 18
- npm ≥ 9

### Comandos

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo (http://localhost:5173)
npm start

# Compilar para producción
npm run build

# Ejecutar todos los tests una única vez
npm test

# Ejecutar los tests en modo observación continua
npx vitest

# Ejecutar el linter
npm run lint
```

---

## Tests

El proyecto usa **Vitest** con **@testing-library/react** y la convención BDD de nombrado con el prefijo `should` en camelCase.

### Cobertura

| Fichero de test | Casos cubiertos |
|---|---|
| `services/cache.test.js` | Clave inexistente, escritura y lectura, expiración, datos previos a la expiración |
| `components/ProductCard/ProductCard.test.jsx` | Renderizado de datos, enlace semántico con `href` correcto, precio ausente |
| `hooks/useProducts.test.jsx` | Estado inicial, carga exitosa, error de red, silencio ante `AbortError`, paso de señal |
| `hooks/useCart.test.jsx` | Recuento inicial, inicialización desde `localStorage`, reemplazo del recuento, sin acumulación entre llamadas, persistencia, propagación de errores |
| `pages/ProductList/ProductList.test.jsx` | Skeleton durante carga, renderizado de productos, estado vacío de búsqueda, controles de paginación, navegación entre páginas, reinicio de página al buscar |

### Ejecutar los tests

```bash
npm test
```

---

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React | 18.2 | Librería de UI declarativa |
| React Router DOM | 6.22 | Enrutado SPA en cliente |
| Vite | 5 | Bundler y servidor de desarrollo |
| Vitest | 1.4 | Framework de tests unitarios |
| @testing-library/react | 14 | Utilidades de test orientadas al usuario |
| jsdom | 24 | Entorno de navegador simulado para tests |
| ESLint | 8 | Análisis estático de código |
