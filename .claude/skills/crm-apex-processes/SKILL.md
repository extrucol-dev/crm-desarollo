---
name: crm-apex-processes
description: >-
  CRM Extrucol APEX On-Demand Application Processes. SIEMPRE USA cuando: crear proceso APEX,
  escribir PL/SQL para el CRM, agregar Application Process en APEX Builder, conectar React a Oracle,
  escribir APEX_JSON, leer parámetros G_X01 G_X02, crear package PL/SQL CRM_{FEATURE}_API,
  implementar endpoint APEX, verificar sesión APEX, depurar callProcess. Trigger on: "proceso APEX",
  "application process", "APEX_JSON", "PL/SQL proceso", "callProcess", "G_X01", "proceso on-demand",
  cualquier nombre de proceso en mayúsculas (LEADS_LIST, CLIENTES_CREATE, DASHBOARD_EJECUTIVO, etc.).
---

# CRM Extrucol — APEX On-Demand Processes

Crea Application Processes en Oracle APEX consumidos por `callProcess()` del frontend React.

---

## Cómo crear un proceso en APEX Builder

```
App Builder → Tu Aplicación → Shared Components → Application Processes → Create
```

| Campo | Valor |
|-------|-------|
| **Name** | `FEATURE_ACCION` en MAYÚSCULAS (ej: `LEADS_LIST`) |
| **Sequence** | 10, 20, 30... |
| **Point** | **On Demand — Run this application process when requested by a page** |
| **Type** | PL/SQL Anonymous Block |
| **Source** | El PL/SQL del proceso |
| **Error Handling** | Display Inline with Field and in Notification |

---

## Cómo el frontend llama el proceso

```js
// En src/shared/apex/apexClient.js
callProcess('LEADS_LIST')
callProcess('LEADS_GET', { x01: 42 })
callProcess('LEADS_CREATE', { x01: 'Empresa ABC', x02: 'abc@empresa.com', x03: '300' })
```

Los extras `{ x01, x02, ... }` llegan al proceso como:

| JS extra | Variable PL/SQL | Conversión típica |
|----------|----------------|-------------------|
| `x01: 'texto'` | `APEX_APPLICATION.G_X01` | VARCHAR2 directo |
| `x01: 42` | `TO_NUMBER(APEX_APPLICATION.G_X01)` | Convertir a NUMBER |
| `x01: '2026-04-30'` | `TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD')` | Convertir a DATE |
| `x01: true/false` | `APEX_APPLICATION.G_X01 = 'true'` | Comparar string |

Con NVL para opcionales:
```sql
l_limit NUMBER := NVL(TO_NUMBER(APEX_APPLICATION.G_X01), 10);
```

---

## Plantillas PL/SQL

### LIST — Devuelve array de registros

```sql
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT id, nombre, email, activo
      FROM crm_{entidad}
     WHERE activo = 1
     ORDER BY nombre;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
```

### GET — Devuelve un registro por ID

```sql
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  OPEN l_cur FOR
    SELECT id, nombre, email, sector, activo
      FROM crm_{entidad}
     WHERE id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
```

### CREATE — Inserta y devuelve ID nuevo

```sql
DECLARE
  l_id NUMBER;
BEGIN
  INSERT INTO crm_{entidad} (nombre, email, campo3)
  VALUES (
    APEX_APPLICATION.G_X01,   -- nombre
    APEX_APPLICATION.G_X02,   -- email
    APEX_APPLICATION.G_X03    -- campo3
  )
  RETURNING id INTO l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('id',      l_id);
  APEX_JSON.WRITE('success', TRUE);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
```

### UPDATE — Actualiza y confirma

```sql
DECLARE
  l_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
  UPDATE crm_{entidad}
     SET nombre  = APEX_APPLICATION.G_X02,
         email   = APEX_APPLICATION.G_X03,
         campo3  = APEX_APPLICATION.G_X04
   WHERE id = l_id;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('success', SQL%ROWCOUNT > 0);
  APEX_JSON.CLOSE_OBJECT;

EXCEPTION
  WHEN OTHERS THEN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('success', FALSE);
    APEX_JSON.WRITE('error',   SQLERRM);
    APEX_JSON.CLOSE_OBJECT;
END;
```

### USUARIO_ACTUAL — Proceso de autenticación (especial)

```sql
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  OPEN l_cur FOR
    SELECT u.id,
           u.nombre,
           UPPER(u.rol) AS rol
      FROM crm_usuarios u
     WHERE UPPER(u.email) = UPPER(v('APP_USER'))
       AND u.activo = 1;

  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);   -- unwrapSingle() extrae el primer objeto
  APEX_JSON.CLOSE_OBJECT;
END;
```

---

## Convención de respuesta JSON

| Tipo | Estructura | Cómo lo consume el frontend |
|------|-----------|----------------------------|
| Lista | `{ "data": [{...}, {...}] }` | `unwrapList(resp)` → array |
| Objeto | `{ "data": [{...}] }` | `unwrapSingle(resp)` → objeto |
| Mutación OK | `{ "id": N, "success": true }` | `resp.id`, `resp.success` |
| Error | `{ "success": false, "error": "ORA-..." }` | Mensaje de error |

Las claves Oracle llegan en MAYÚSCULAS → `toLower()` las normaliza automáticamente en `utils.js`.

---

## Paquetes PL/SQL del proyecto

Nomenclatura: `CRM_{FEATURE}_API`. Todos los procedimientos tienen `p_result OUT SYS_REFCURSOR` como primer parámetro — incluso las mutaciones devuelven un cursor con `{id, success}`.

Ver skill `/crm-db-oracle` para los templates completos de SPEC y BODY.

Paquetes del proyecto:
```
CRM_LEADS_API        → procesos LEADS_*
CRM_CLIENTES_API     → procesos CLIENTES_*
CRM_OPOR_API         → procesos OPORTUNIDADES_*
CRM_ACTIV_API        → procesos ACTIVIDADES_*
CRM_PROY_API         → procesos PROYECTOS_*
CRM_USUARIOS_API     → procesos USUARIOS_*
CRM_DASHBOARD_API    → procesos DASHBOARD_*
```

---

## Catálogo completo de procesos (49 procesos)

### Autenticación (1)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `USUARIO_ACTUAL` | — | `{id, nombre, rol}` |

### Clientes (4)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `CLIENTES_LIST` | — | array clientes |
| `CLIENTES_GET` | x01=id | objeto cliente |
| `CLIENTES_CREATE` | x01=nombre, x02=empresa, x03=sector, x04=ciudad_id, x05=email, x06=telefono | `{id, success}` |
| `CLIENTES_UPDATE` | x01=id, x02=nombre, x03=empresa, x04=sector, x05=ciudad_id, x06=email, x07=telefono | `{success}` |

### Leads (6)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `LEADS_LIST` | — | array leads del ejecutivo |
| `LEADS_GET` | x01=id | objeto lead |
| `LEADS_CREATE` | x01=nombre, x02=empresa, x03=email, x04=telefono, x05=origen, x06=sector, x07=ciudad_id, x08=descripcion | `{id, success}` |
| `LEADS_UPDATE` | x01=id + mismos campos | `{success}` |
| `LEADS_ESTADO` | x01=id, x02=estado | `{success}` |
| `LEADS_CONVERTIR` | x01=id, x02=nombre_oportunidad, x03=valor_estimado, x04=fecha_cierre | `{id_oportunidad, success}` |

### Oportunidades (9)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `OPORTUNIDADES_LIST` | — | array oportunidades del ejecutivo |
| `OPORTUNIDADES_LIST_TODAS` | — | array todas (director) |
| `OPORTUNIDADES_GET` | x01=id | objeto oportunidad |
| `OPORTUNIDADES_ACTIVIDADES` | x01=id | array actividades de la oportunidad |
| `OPORTUNIDADES_CREATE` | x01=nombre, x02=descripcion, x03=tipo, x04=valor_estimado, x05=fecha_cierre, x06=cliente_id | `{id, success}` |
| `OPORTUNIDADES_UPDATE` | x01=id, x02=nombre, x03=descripcion, x04=tipo, x05=estado, x06=valor_estimado, x07=fecha_cierre, x08=cliente_id | `{success}` |
| `OPORTUNIDADES_AVANZAR` | x01=id, x02=estado | `{success}` |
| `OPORTUNIDADES_CERRAR` | x01=id, x02=estado, x03=fecha_cierre, x04=motivo_cierre | `{success}` |
| `OPORTUNIDADES_ESTANCADAS` | x01=dias_sin_actividad | array oportunidades |

### Actividades (6)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `ACTIVIDADES_CREATE` | x01=tipo, x02=descripcion, x03=virtual(1/0), x04=fecha_actividad, x05=oportunidad_id | `{id, success}` |
| `ACTIVIDADES_GET` | x01=id | objeto actividad |
| `ACTIVIDADES_UPDATE` | x01=id, x02=tipo, x03=descripcion, x04=virtual(1/0), x05=fecha_actividad, x06=oportunidad_id | `{success}` |
| `ACTIVIDADES_CERRAR` | x01=id, x02=resultado, x03=latitud, x04=longitud | `{success}` |
| `ACTIVIDADES_LIST_TODAS` | x01=inicio(YYYY-MM-DD)?, x02=fin? | array todas (director) |
| `ACTIVIDADES_LIST_MIS` | x01=inicio?, x02=fin? | array del ejecutivo |

### Proyectos (6)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `PROYECTOS_LIST` | — | array del ejecutivo |
| `PROYECTOS_LIST_TODOS` | — | array todos (director) |
| `PROYECTOS_GET` | x01=id | objeto proyecto |
| `PROYECTOS_CREATE` | x01=nombre, x02=descripcion, x03=oportunidad_id | `{id, success}` |
| `PROYECTOS_UPDATE` | x01=id, x02=nombre, x03=descripcion, x04=estado, x05=oportunidad_id | `{success}` |
| `PROYECTOS_ESTADO` | x01=id, x02=estado | `{success}` |

### Usuarios (5)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `USUARIOS_LIST` | — | array usuarios |
| `USUARIOS_GET` | x01=id | objeto usuario |
| `USUARIOS_CREATE` | x01=nombre, x02=email, x03=rol, x04=ciudad_id | `{id, success}` |
| `USUARIOS_UPDATE` | x01=id, x02=nombre, x03=email, x04=rol, x05=ciudad_id | `{success}` |
| `USUARIOS_ESTADO` | x01=id, x02=activo(1/0) | `{success}` |

### Ciudades (1)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `CIUDADES_LIST` | — | array ciudades |

### Dashboard (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `DASHBOARD_EJECUTIVO` | — | KPIs del ejecutivo logueado |
| `DASHBOARD_COORDINADOR` | — | KPIs de supervisión del equipo |

### Metas (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `METAS_MIS_METAS` | — | metas del ejecutivo de sesión |
| `METAS_CUMPLIMIENTO` | x01=periodo (YYYY-MM) | cumplimiento del equipo |

### Alertas (3)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `ALERTAS_LIST` | — | array alertas activas |
| `ALERTAS_LOG` | x01=inicio, x02=fin | log de notificaciones |
| `ALERTAS_MARCAR_LEIDA` | x01=id | `{success}` |

### Equipo (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `EQUIPO_LIST` | — | array ejecutivos del equipo |
| `EQUIPO_GET_EJECUTIVO` | x01=id | perfil + métricas del ejecutivo |

### Monitoreo (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `MONITOREO_EJECUTIVOS_GPS` | — | posiciones GPS recientes |
| `MONITOREO_ACTIVIDADES_MAPA` | x01=fecha (YYYY-MM-DD) | actividades georeferenciadas del día |

### Análisis (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `ANALISIS_SECTORES` | x01=periodo (YYYY-MM) | ingresos por sector |
| `ANALISIS_FORECAST` | x01=meses | proyección de ventas a N meses |

### Reportes (2)
| Proceso | Params | Devuelve |
|---------|--------|---------|
| `REPORTES_LIST` | — | reportes disponibles |
| `REPORTES_GENERAR` | x01=tipo, x02=inicio, x03=fin | datos del reporte |

---

## Verificar desde el navegador (dentro de APEX)

```js
// Ver sesión activa
console.log(window.apex?.env)
// → { APP_ID: "100", APP_PAGE_ID: "1", APP_SESSION: "..." }

// Llamar proceso manualmente desde DevTools
fetch('/apex/wwv_flow.ajax', {
  method: 'POST',
  body: new URLSearchParams({
    p_request:      'APPLICATION_PROCESS=LEADS_LIST',
    p_flow_id:      apex.env.APP_ID,
    p_flow_step_id: apex.env.APP_PAGE_ID,
    p_instance:     apex.env.APP_SESSION,
  }),
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  credentials: 'include',
}).then(r => r.json()).then(console.log)

// Verificar en SQL Workshop
-- SELECT * FROM user_errors WHERE name LIKE 'CRM_%' ORDER BY name, sequence;
```
