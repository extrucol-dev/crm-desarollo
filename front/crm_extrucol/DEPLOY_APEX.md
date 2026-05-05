# Deploy — CRM Extrucol React en Oracle APEX

## Estructura del build (`dist/`)

```
dist/
  index.html          ← página principal SPA
  assets/
    index.js          ← bundle React (~832 KB)
    index.css         ← estilos (~51 KB)
```

**Importante:** los archivos usan nombres fijos sin hash (`index.js` no `index.a3b2c1.js`) para que APEX pueda referenciarlos por nombre exacto.

---

## Paso 1 — Subir archivos a APEX Static Files

### Opción A: Static Application Files (recomendado)

1. En APEX Builder: `App Builder → capacitacion → Shared Components → Static Application Files`
2. Subir cada archivo con su mime type:

| Archivo | Mime Type |
|---------|-----------|
| `index.html` | `text/html` |
| `assets/index.js` | `text/javascript` |
| `assets/index.css` | `text/css` |

3. Copiar las rutas de referencia de cada archivo (aparecen como `#APP_FILES#...`)

### Opción B: Workspace Files (si los archivos son grandes)

`App Builder → Shared Components → Workspace Files → Upload`

---

## Paso 2 — Modificar la página `maito`

La página actual parece estar sirviendo algo que no es el React SPA. Reemplazar el contenido de la página `maito` para servir el `index.html`.

### Crear región PL/SQL en la página `maito`:

```sql
BEGIN
  -- Servir index.html como contenido de la página
  -- Asegúrate de que los assets estén en #APP_FILES#assets/
  HTP.PRINT('<!doctype html><html lang="es"><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>CRM Extrucol</title>
    <script type="module" src="#APP_FILES#assets/index.js"></script>
    <link rel="stylesheet" href="#APP_FILES#assets/index.css"/>
  </head><body><div id="root"></div></body></html>');
END;
```

**O más simple:** usa una región de tipo `Static Content` (HTML) simple y pega el contenido de `index.html` adjusted.

### Mejor approach — page attribute:

En la página `maito`:
1. Ir a **Page > HTML > Header** y agregar:
   ```html
   <script type="module" src="#APP_FILES#assets/index.js"></script>
   <link rel="stylesheet" href="#APP_FILES#assets/index.css">
   ```
2. Ir a **Page > Body** y agregar:
   ```html
   <div id="root"></div>
   ```
3. Quitar todo lo demás (regiones PL/SQL, reportes, etc.)

---

## Paso 3 — Configurar `base` del build

El build actual ya tiene `base: './'` en `vite.config.js`, así que los assets se cargan con paths relativos `./assets/...`. Esto funciona tanto en el proxy dev como en APEX static files.

Si los assets no cargan, verificar que `#APP_FILES#assets/index.js` sea la ruta correcta que APEX generó al subir los archivos.

---

## Paso 4 — Verificar que funciona

1. Ir a `http://192.168.103.3/apex/capacitacion/r/seguiemiento-demo-react/maito`
2. Ver en DevTools → Network que `index.html` carga (200), `index.js` carga (200), `index.css` carga (200)
3. Si el navegador pide descargar archivos en vez de ejecutar JS → mime type incorrecto al subir
4. Si 404 en assets → ruta `#APP_FILES#` incorrecta

---

## Problemas comunes

### Error MIME type (se descarga el JS)
→ Subiste `index.js` como `text/plain` en vez de `text/javascript`. Re-subir con mime type correcto.

### 404 en `app-icon.css`
→ Es un archivo de tema de APEX, no del React. Ignorar este error — no afecta la funcionalidad.

### Error `Cannot read properties of undefined (reading 'split')`
→ La página `maito` tiene regions de APEX (reports, etc.) que intenta inicializar y fallan porque están vacías. Limpiar la página dejando SOLO el root div y los assets.

### `index.js` returned text/html
→ El archivo se está sirviendo como HTML. Esto pasa cuando `#APP_FILES#` ruta no existe y APEX devuelve la página 404 por defecto. Verificar que los archivos static se subieron correctamente.

---

## Builds futuros

Después de cualquier cambio en el React:

```bash
npm run build:apex
```

Luego en APEX: reemplazar los 3 archivos en Static Application Files con las nuevas versiones (mismo nombre, mismo mime type).

---

## Configuración actual

```
.env.apex:
  VITE_APEX_MODE=true
  VITE_APEX_FLOW_ID=4550
  VITE_APEX_TARGET=https://192.168.103.3

vite.config.js:
  base: './'
  build output: assets/[name].js (sin hash)
```

La app React arrancará en `/maito` y sus rutas (React Router) funcionarán dentro de esa página porque es una SPA que toma control total del DOM.