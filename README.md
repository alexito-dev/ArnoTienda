# ArnoTienda

Plataforma de comercio electronico para software y licencias digitales con arquitectura multi-proveedor, panel administrativo y conversion a moneda nacional (PEN / Soles peruanos).

## Caracteristicas Principales

- **Catalogo Dinamico de Productos**: Navegacion fluida por categorias (IA, herramientas, desarrollo, licencias de software).
- **Multi-Proveedor API**: Conector para sincronizar catalogos y despachos con BunaiStore, G2A, Kinguin o endpoints REST mayoristas personalizados.
- **Gestion Integral de Ordenes**: Registro de clientes, metodos de pago, seguimiento de entregas y visor/editor de claves de activacion.
- **Economia en Soles Peruanos**: Precios de venta configurables en PEN con referencia USD y calculo automatico de margenes comerciales.
- **Monedero y Cupones**: Soporte para saldo de usuario, descuentos y ofertas temporales.
- **Despliegue Contenedorizado**: Soporte listo para Docker y Docker Compose con proxy inverso Nginx.

## Arquitectura Tecnica

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Base de Datos**: SQLite (almacenamiento persistente en volumen Docker).
- **Infraestructura**: Nginx (reverse proxy y servicio de estaticos), Docker Compose.

## Estructura del Proyecto

```
ArnoTienda/
├── src/                      # Codigo fuente del frontend
│   ├── components/           # Componentes UI y modales
│   │   └── admin/            # Vistas del panel de administracion
│   ├── data/                 # Datos iniciales y configuraciones
│   ├── services/             # Clientes de API, monedero y pedidos
│   └── types/                # Definiciones TypeScript
├── server/                   # Backend API Express
│   ├── server.js             # Servidor principal y rutas SQLite
│   ├── multiProviderService.js # Gestor y conectores multi-API
│   └── bunaiStoreService.js  # Integracion legacy BunaiStore
├── Dockerfile                # Build del frontend con Nginx
├── Dockerfile.backend        # Build del servicio Node.js
├── docker-compose.yml        # Orquestacion de contenedores
└── nginx.conf                # Configuracion de proxy Nginx
```

## Ejecucion Local

### Requisitos
- Node.js 20+
- npm

### Pasos

1. Instalar dependencias del frontend:
   ```bash
   npm install
   ```

2. Instalar dependencias del backend:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. Iniciar el servidor backend:
   ```bash
   node server/server.js
   ```

4. Iniciar el frontend en modo desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue con Docker

```bash
docker compose up -d --build
```
