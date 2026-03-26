# CRM Extrucol — Arquitectura Feature-Based

## Estructura del proyecto

```
src/
├── features/                        # Un directorio por funcionalidad
│   │
│   ├── auth/                        # Todo lo relacionado a autenticación
│   │   ├── components/
│   │   │   └── LoginForm.jsx        # Formulario de login (UI pura)
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Lógica: submit, loading, error
│   │   ├── services/
│   │   │   └── authService.js       # Login, logout, token, rol
│   │   ├── types/
│   │   │   └── authTypes.js         # JSDoc types
│   │   └── pages/
│   │       └── LoginPage.jsx        # Página: layout + LoginForm
│   │
│   ├── clientes/                    # Todo lo relacionado a clientes
│   │   ├── components/
│   │   │   ├── ClientesTable.jsx    # Tabla visual (UI pura)
│   │   │   └── ClienteForm.jsx      # Formulario de registro (UI pura)
│   │   ├── hooks/
│   │   │   ├── useClientes.js       # Lógica: listado, filtros, búsqueda
│   │   │   └── useClienteForm.js    # Lógica: validaciones, submit
│   │   ├── services/
│   │   │   └── clientesAPI.js       # Llamadas a /api/clientes
│   │   └── pages/
│   │       ├── ClientesListaPage.jsx    # CE-13: listado de clientes
│   │       └── ClienteRegistroPage.jsx  # CE-12: registrar cliente
│   │
│   ├── oportunidades/               # (próximo sprint)
│   │   └── services/
│   │       └── oportunidadesAPI.js
│   │
│   ├── actividades/                 # (próximo sprint)
│   │   └── services/
│   │       └── actividadesAPI.js
│   │
│   └── proyectos/                   # v1.3
│       └── services/
│           └── proyectosAPI.js
│
├── shared/                          # Código reutilizable entre features
│   ├── components/
│   │   ├── AppLayout.jsx            # Sidebar + main wrapper
│   │   ├── Topbar.jsx               # Barra superior
│   │   └── ProtectedRoute.jsx       # Guard de rutas por auth y rol
│   └── services/
│       └── api.js                   # Axios base + interceptores JWT
│
├── App.jsx                          # Rutas de la aplicación
└── main.jsx                         # Entrada + BrowserRouter
```

## Reglas de la arquitectura

1. **Cada feature es independiente** — no importa de otras features.
2. **shared/** contiene solo lo verdaderamente transversal.
3. **Cada archivo tiene una sola responsabilidad:**
   - `*API.js` → solo llamadas HTTP
   - `use*.js` → solo estado y lógica
   - `*Form.jsx` / `*Table.jsx` → solo UI, recibe props
   - `*Page.jsx` → solo composición de hooks + componentes
4. **Las páginas son delgadas** — máximo 50-60 líneas.

## Para agregar un nuevo módulo

Copiar la estructura de `clientes/` y adaptar:

```
features/nuevo-modulo/
├── components/   → UI pura
├── hooks/        → lógica y estado
├── services/     → llamadas a la API
└── pages/        → composición
```

## Dependencias necesarias

```bash
npm install axios react-router-dom
```

## Fuente DM Sans (en index.html)

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
