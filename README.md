# Aurasys

Aurasys ayuda a personas, estudiantes, emprendedores, profesionales y equipos pequeños a ordenar ideas, tareas, información, proyectos y procesos mediante soluciones digitales simples, claras y funcionales.

## Qué es Aurasys

Aurasys es una marca enfocada en ayudar a convertir ideas, tareas e información en soluciones digitales claras, funcionales y útiles.

## Cómo está organizado el proyecto

- `index.html`: página de inicio.
- `servicios.html`: servicios y público objetivo.
- `proceso.html`: proceso y pagos.
- `diagnostico.html`: formulario de diagnóstico.
- `contacto.html`: contacto y FAQ.
- `styles.css`: estilos globales, dark mode y responsive.
- `script.js`: interfaz, navegación, dark mode, animaciones, FAQ y envío del formulario.
- `config.js`: enlaces editables del proyecto.
- `assets/`: placeholders de logo, hero, servicios y iconos.

## Cómo editar enlaces en `config.js`

Abre `config.js` y cambia estos valores:

```js
const AURASYS_CONFIG = {
  whatsappUrl: "https://wa.me/502XXXXXXXX",
  email: "tucorreo@ejemplo.com",
  tiktokUrl: "https://www.tiktok.com/@tuusuario",
  googleScriptUrl: "PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT",
  logoPath: "assets/logo/logo-placeholder.svg"
};
```

## Cómo cambiar logo e imágenes

- Logo: `assets/logo/logo-placeholder.svg`
- Hero: `assets/images/hero-placeholder.svg`
- Servicios: `assets/images/service-placeholder.svg`
- Proceso: `assets/images/process-placeholder.svg`
- Icono: `assets/icons/icon-placeholder.svg`

## Cómo abrir localmente

Puedes abrir cada archivo directamente en el navegador, o servir el sitio localmente con un servidor simple:

```bash
python -m http.server 8000
```

Luego visita:

```text
http://localhost:8000
```

## Cómo publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a la configuración del repositorio.
3. Abre la sección de GitHub Pages.
4. Selecciona la rama principal o la carpeta que contenga el sitio.
5. Guarda la configuración.
6. GitHub Pages te entregará una URL pública.

## Cómo conectar Google Sheets con Google Apps Script

1. Crea un Google Apps Script que reciba los datos del formulario.
2. Publica el script como Web App.
3. Pega la URL generada en `config.js` en `googleScriptUrl`.
4. En la hoja de Google Sheets usa columnas como:

- Fecha
- Nombre completo
- Correo electrónico
- WhatsApp
- TikTok
- Medio preferido
- Tipo de cliente
- Necesidad principal
- Descripción
- Nivel de claridad
- Resultado esperado
- Urgencia
- Presupuesto
- Comentarios
- Fuente
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- Estado
- Notas internas

## Notas finales

- El formulario valida campos obligatorios, correo y medio preferido.
- Si no hay URL real de Apps Script, el envío se simula localmente para pruebas.
- El sitio usa HTML, CSS y JavaScript puro, ideal para GitHub Pages.
