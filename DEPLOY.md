# Cómo subir cambios de ArnoTienda al servidor

Esta guía explica qué hace el deploy, cómo se usa y qué hacer si algo falla.
Es el mismo sistema que usa ArnoAI.

---

## En una frase

Editas el código en tu PC, ejecutas **un comando**, y ese comando sube los
cambios al servidor, reconstruye la tienda y comprueba que siga funcionando.

```
tu PC  ──(SSH)──►  servidor  ──►  reconstruye  ──►  comprueba  ──►  https://tienda.arno.services
```

---

## Cómo se usa

Abre una terminal (Git Bash) **dentro de la carpeta del proyecto** y elige:

| Quiero… | Comando |
|---|---|
| Subir todo (web + servidor) | `./deploy.sh` |
| Subir solo cambios de la web (diseño, textos, pantallas) | `./deploy.sh frontend` |
| Subir solo cambios del servidor (pedidos, proveedores, precios) | `./deploy.sh backend` |
| Revisar que todo está bien **sin cambiar nada** | `./deploy.sh check` |

También puedes hacer **doble clic en `deploy.bat`**: sube todo y deja la
ventana abierta para que leas el resultado.

> Usa `frontend` o `backend` cuando el cambio sea de una sola parte: es más rápido.
> Si tocaste las dos o no estás seguro, usa `./deploy.sh`.

### Antes del primer deploy

Corre `./deploy.sh check`. Si termina con `Revisión terminada`, todo está listo.
Si falla, mira la sección *Si algo falla*.

### Después de cada deploy

El script termina con `✅ Proceso finalizado`. Abre la tienda y, si no ves los
cambios, recarga con **Ctrl+F5** (el navegador guarda copias de las páginas).

---

## Qué hace, paso a paso

Cuando ejecutas `./deploy.sh`, el script hace esto en orden:

1. **Revisa antes de empezar.** Comprueba que en tu carpeta estén todos los
   archivos del proyecto y que el servidor responda. Si falta algo, **se detiene
   sin tocar nada**. Así nunca se sube una carpeta incompleta por error.
2. **Sube los archivos.** Los empaqueta y los envía al servidor por SSH a una
   carpeta temporal (`.incoming`).
3. **Reemplaza solo si todo llegó bien.** Mueve lo viejo a `.previous` (una copia
   de seguridad) y pone lo nuevo en su lugar.
4. **Reconstruye la tienda.** Docker arma de nuevo la web y/o el servidor con el
   código nuevo y los reinicia.
5. **Comprueba que funciona.** Abre `https://tienda.arno.services` y
   `https://tienda.arno.services/api/products` y espera un "200" (que significa
   *todo bien*). Si no responde, avisa y termina con error.
6. **Limpia.** Borra las imágenes viejas de Docker para no llenar el disco.

### Qué sube y qué nunca toca

| Se sube | Parte |
|---|---|
| `src/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `nginx.conf`, `Dockerfile` | Web (`frontend`) |
| `server/`, `Dockerfile.backend` | Servidor de la tienda (`backend`) |

**El deploy nunca toca:**

- **`docker-compose.yml` del servidor.** Es el que manda, y ahí viven las claves.
  Si necesitas cambiarlo, hazlo directamente en el servidor.
- **La base de datos** (pedidos, productos, proveedores). Vive en un volumen de
  Docker aparte, así que reconstruir la tienda no la borra.
- Las carpetas `node_modules/`, `dist/` y los archivos `.sqlite`, que no se
  suben nunca.

---

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Servidor (VPS) | `root@169.58.235.118` |
| Carpeta de la tienda en el servidor | `/root/arnotienda` |
| Dirección pública | https://tienda.arno.services |
| Copia de seguridad del deploy anterior | `/root/arnotienda/.previous` |
| Base de datos | Volumen Docker `arnotienda_db` |

---

## Si algo falla

### "Falta 'src' en …"
Estás ejecutando el script desde una carpeta incompleta. Ve a la carpeta real del
proyecto (donde están `src/`, `server/` y `deploy.sh`) y vuelve a intentar.

### "No pude entrar a root@… / Revisa tu clave SSH"
Tu PC no tiene permiso para entrar al servidor. Prueba que entre a mano:
```
ssh root@169.58.235.118
```
Si pide contraseña, falta autorizar tu clave en el servidor.

### "No respondió HTTP 200"
La tienda no arrancó bien. Mira qué dice:
```
ssh root@169.58.235.118 "cd /root/arnotienda && docker compose logs --tail 50"
```
Para ver el estado de los dos contenedores:
```
ssh root@169.58.235.118 "docker ps --filter name=arnotienda"
```

### La web carga pero los productos no aparecen (error 502)
La web perdió de vista al servidor. Reinicia la web:
```
ssh root@169.58.235.118 "cd /root/arnotienda && docker compose restart tienda-frontend"
```
(`./deploy.sh backend` ya hace esto solo.)

### Subí algo y quedó peor: volver a la versión anterior
El deploy anterior queda en `.previous`. Para restaurar, por ejemplo, el servidor:
```
ssh root@169.58.235.118 "cd /root/arnotienda && rm -rf server && cp -a .previous/server server && cp -a .previous/Dockerfile.backend Dockerfile.backend && docker compose up -d --build --no-deps tienda-backend && docker compose restart tienda-frontend"
```
Solo guarda **una** versión atrás: el siguiente deploy la reemplaza.

Para la web (que tiene varios archivos) y para volver más de una versión atrás,
usa git: vuelve el código al commit bueno (`git checkout <commit> -- .`) y
ejecuta `./deploy.sh`.

---

## Notas

- **Windows:** el script necesita Git Bash (viene con Git para Windows). El archivo
  `.gitattributes` evita que Windows cambie sus saltos de línea y lo rompa.
- **Este script no usa Git para subir.** Sube lo que tengas en tu carpeta aunque no
  lo hayas guardado con `git commit`. Haz commit y push igual, para que GitHub
  tenga la misma versión que producción.
- **Cambiar de servidor** sin editar el script: `DEPLOY_SERVER=root@otra-ip ./deploy.sh`.
  También existen `DEPLOY_REMOTE_DIR` y `DEPLOY_URL`.
