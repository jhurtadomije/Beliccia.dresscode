# 👗 Beliccia Dress Code

Proyecto web completo para una firma de moda especializada en **novias, madrinas, invitadas y complementos**, desarrollado como **proyecto final** del ciclo de **Desarrollo de Aplicaciones Web (DAW)**.

La aplicación simula un entorno **real y profesional**, combinando un frontend moderno con una API propia, gestión de productos, citas y pedidos, y un despliegue en producción.

---

## 🌐 Demo en producción

- **Web**: https://beliccia.es  
- **API**: https://api.beliccia.com  

> ⚠️ Nota: Algunas funcionalidades (pagos, correos, etc.) pueden estar limitadas o en entorno de pruebas.

---

## 🎯 Objetivo del proyecto

El objetivo principal es desarrollar una **plataforma web realista y escalable** que permita:

- Mostrar un catálogo de productos de moda
- Consultar el detalle de cada producto
- Solicitar citas e información personalizada
- Gestionar un carrito y pedidos online
- Aplicar buenas prácticas de desarrollo, seguridad y rendimiento
- Simular un entorno profesional de despliegue

---

## 🧩 Funcionalidades principales

### Frontend (React + Vite)
- Página corporativa con animaciones
- Catálogo de productos por categoría
- Página de detalle de producto
- Carrusel de Instagram integrado
- Sistema de citas mediante formulario
- Carrito de compra
- Diseño responsive (móvil, tablet y escritorio)
- Optimización SEO básica (robots, sitemap, meta tags)
- Optimización de rendimiento (lazy load, CLS, imágenes)

### Backend (Node.js + Express)
- API REST propia
- Gestión de productos y variantes
- Gestión de citas
- Gestión de pedidos
- Autenticación mediante JWT
- Integración con Stripe (modo test)
- Validación de datos
- Separación por controladores, servicios y middlewares

### Base de datos
- Base de datos relacional (MySQL / MariaDB)
- Modelado orientado a un caso real de ecommerce
- Relaciones entre productos, variantes, pedidos y usuarios

---

## 🏗️ Arquitectura del proyecto



beliccia/
├── frontend/ → React + Vite
├── backend/ → Node.js + Express
│ ├── src/
│ │ ├── controllers
│ │ ├── services
│ │ ├── middlewares
│ │ ├── routes
│ │ └── server.js
│ └── ecosystem.config.cjs
└── database/ → Esquema y estructura de datos
---

## 🛠️ Tecnologías utilizadas

### Frontend
- React
- Vite
- React Router
- Bootstrap
- Axios
- Framer Motion

### Backend
- Node.js
- Express
- JWT (jsonwebtoken)
- Stripe (pagos)
- Nodemailer (emails)
- PM2 (gestión de procesos)

### Infraestructura
- Nginx
- VPS Linux (Ubuntu)
- HTTPS con Let’s Encrypt
- GitHub para control de versiones

---

## 🚀 Despliegue

- Frontend compilado con **Vite** y servido mediante **Nginx**
- Backend ejecutado con **PM2**
- Certificados SSL gestionados con **Certbot**
- Variables de entorno gestionadas mediante configuración del servidor

---

## 🔐 Seguridad y buenas prácticas

- Uso de JWT para autenticación
- Separación de lógica de negocio
- Validación de entradas
- Uso de HTTPS
- Protección básica frente a errores comunes
- No exposición de credenciales en el repositorio

---

## 📈 Rendimiento y optimización

- Lazy loading de imágenes y vídeos
- Evitación de CLS (Cumulative Layout Shift)
- Carga diferida de contenido pesado (Instagram embeds, vídeos)
- Optimización básica para PageSpeed Insights

---

## 📚 Aprendizajes clave

Durante el desarrollo de este proyecto se han trabajado aspectos como:

- Arquitectura cliente-servidor
- Consumo y creación de APIs REST
- Gestión de estado en frontend
- Autenticación y seguridad
- Despliegue real en producción
- Resolución de problemas reales de rendimiento y compatibilidad

---

## 🔮 Posibles mejoras futuras

- Panel de administración más avanzado
- Gestión de stock en tiempo real
- Sistema de roles más detallado
- Internacionalización (i18n)
- Mejora de SEO avanzado
- Tests automatizados

---

## 👤 Autor

**José Ramón Hurtado**  
Proyecto final – Desarrollo de Aplicaciones Web (DAW)

---

## 📄 Licencia

Proyecto desarrollado con fines educativos.
