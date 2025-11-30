-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-11-2025 a las 19:15:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `beliccia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `estado` enum('activo','convertido','expirado') NOT NULL DEFAULT 'activo',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_items`
--

CREATE TABLE `carrito_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `carrito_id` int(10) UNSIGNED NOT NULL,
  `producto_variante_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `padre_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`, `descripcion`, `padre_id`, `created_at`, `updated_at`) VALUES
(13, 'Novias', 'novias', 'Vestidos de novia y trajes nupciales', NULL, '2025-11-29 10:29:42', '2025-11-29 10:29:42'),
(14, 'Fiesta', 'fiesta', 'Vestidos de fiesta, madrinas e invitadas', NULL, '2025-11-29 10:29:42', '2025-11-29 10:29:42'),
(15, 'Complementos', 'complementos', 'Accesorios y complementos', NULL, '2025-11-29 10:29:42', '2025-11-29 10:29:42'),
(16, 'Madrinas', 'madrinas', 'Vestidos de madrina', 14, '2025-11-29 10:32:31', '2025-11-29 10:32:31'),
(17, 'Invitadas', 'invitadas', 'Vestidos de invitada', 14, '2025-11-29 10:32:31', '2025-11-29 10:32:31'),
(18, 'Tocados', 'tocados', 'Tocados y adornos para el cabello', 15, '2025-11-29 10:32:31', '2025-11-29 10:32:31'),
(19, 'Bolsos', 'bolsos', 'Bolsos y clutches de fiesta', 15, '2025-11-29 10:32:31', '2025-11-29 10:32:31'),
(20, 'Pendientes', 'pendientes', 'Pendientes y joyería para eventos', 15, '2025-11-29 10:32:31', '2025-11-29 10:32:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `colecciones`
--

INSERT INTO `colecciones` (`id`, `nombre`, `slug`, `descripcion`, `activa`, `fecha_inicio`, `fecha_fin`, `created_at`, `updated_at`) VALUES
(1, 'Novias 2025', 'novias-2025', 'Colección de vestidos de novia 2025', 1, '2025-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(2, 'Novias 2026', 'novias-2026', 'Colección de vestidos de novia 2026', 1, '2026-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(3, 'Fiesta 2025', 'fiesta-2025', 'Colección de vestidos de fiesta 2025', 1, '2025-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(4, 'Fiesta 2026', 'fiesta-2026', 'Colección de vestidos de fiesta 2026', 1, '2026-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(5, 'Madrinas 2025', 'madrinas-2025', 'Colección de madrinas 2025', 1, '2025-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(6, 'Madrinas 2026', 'madrinas-2026', 'Colección de madrinas 2026', 1, '2026-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(7, 'Invitadas 2025', 'invitadas-2025', 'Colección de invitadas 2025', 1, '2025-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(8, 'Invitadas 2026', 'invitadas-2026', 'Colección de invitadas 2026', 1, '2026-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(9, 'Complementos 2025', 'complementos-2025', 'Colección de tocados, bolsos y pendientes 2025', 1, '2025-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(10, 'Complementos 2026', 'complementos-2026', 'Colección de tocados, bolsos y pendientes 2026', 1, '2026-01-01', NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33'),
(11, 'Beliccia Atelier', 'beliccia-atelier', 'Colección permanente Beliccia Atelier', 1, NULL, NULL, '2025-11-29 10:47:33', '2025-11-29 10:47:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('envio','facturacion') NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `linea1` varchar(150) NOT NULL,
  `linea2` varchar(150) DEFAULT NULL,
  `ciudad` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `codigo_postal` varchar(20) NOT NULL,
  `pais` varchar(100) NOT NULL DEFAULT 'España',
  `telefono` varchar(30) DEFAULT NULL,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id`, `nombre`, `slug`, `descripcion`, `activa`, `created_at`, `updated_at`) VALUES
(1, 'Beliccia', 'beliccia', 'Colecciones propias Beliccia', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(2, 'Fara Sposa', 'fara-sposa', 'Colección de novia Fara Sposa', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(3, 'Jarice', 'jarice', 'Colección de novia Jarice', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(4, 'Novia D\'art', 'novia-dart', 'Colección de novia Novia D\'art', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(5, 'Blanca Martín', 'blanca-martin', 'Vestidos de fiesta Blanca Martín', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(6, 'Cayma', 'cayma', 'Vestidos de fiesta Cayma', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(7, 'Cayro', 'cayro', 'Vestidos de fiesta Cayro', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(8, 'CPS', 'cps', 'Vestidos de fiesta CPS', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(9, 'Invitadíssimas', 'invitadissimas', 'Colección de fiesta Invitadíssimas', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(10, 'Lozania', 'lozania', 'Vestidos de fiesta Lozania', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31'),
(11, 'Madison', 'madison', 'Vestidos de fiesta Madison', 1, '2025-11-29 10:41:31', '2025-11-29 10:41:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `proveedor` varchar(50) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `metodo_pago_id` int(10) UNSIGNED DEFAULT NULL,
  `proveedor` varchar(50) NOT NULL,
  `referencia_pasarela` varchar(150) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `moneda` varchar(10) NOT NULL DEFAULT 'EUR',
  `estado` enum('pendiente','autorizado','capturado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  `modo` enum('test','live') NOT NULL DEFAULT 'test',
  `autorizacion` varchar(100) DEFAULT NULL,
  `card_brand` varchar(50) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `error_codigo` varchar(50) DEFAULT NULL,
  `error_mensaje` varchar(255) DEFAULT NULL,
  `raw_request` text DEFAULT NULL,
  `raw_response` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `numero_pedido` varchar(50) NOT NULL,
  `estado` enum('pendiente','pagado','preparando','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `total_items` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `total_iva` decimal(10,2) NOT NULL,
  `gastos_envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `descuento_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `envio_nombre` varchar(150) NOT NULL,
  `envio_direccion` varchar(255) NOT NULL,
  `envio_ciudad` varchar(100) NOT NULL,
  `envio_provincia` varchar(100) NOT NULL,
  `envio_cp` varchar(20) NOT NULL,
  `envio_pais` varchar(100) NOT NULL,
  `envio_telefono` varchar(30) DEFAULT NULL,
  `metodo_pago_id` int(10) UNSIGNED DEFAULT NULL,
  `estado_pago` enum('pendiente','pagado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  `notas_cliente` text DEFAULT NULL,
  `notas_internas` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_historial_estado`
--

CREATE TABLE `pedido_historial_estado` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `estado` enum('pendiente','pagado','preparando','enviado','entregado','cancelado') NOT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  `cambiado_por` int(10) UNSIGNED DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_items`
--

CREATE TABLE `pedido_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `producto_variante_id` int(10) UNSIGNED DEFAULT NULL,
  `nombre_producto` varchar(200) NOT NULL,
  `descripcion_variante` varchar(100) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `categoria_id` int(10) UNSIGNED DEFAULT NULL,
  `marca_id` int(10) UNSIGNED DEFAULT NULL,
  `coleccion_id` int(10) UNSIGNED DEFAULT NULL,
  `codigo_interno` varchar(100) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `descripcion_corta` varchar(255) DEFAULT NULL,
  `descripcion_larga` text DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `venta_online` tinyint(1) NOT NULL DEFAULT 0,
  `visible_web` tinyint(1) NOT NULL DEFAULT 1,
  `tags_origen` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `marca_id`, `coleccion_id`, `codigo_interno`, `nombre`, `slug`, `descripcion_corta`, `descripcion_larga`, `precio_base`, `venta_online`, `visible_web`, `tags_origen`, `created_at`, `updated_at`) VALUES
(10, 13, 4, 1, NULL, 'chiara', 'chiara', 'Vestido de corte recto con escote cuadrado y tirantes anchos que aportan un aire clásico.', 'Vestido de corte recto con escote cuadrado y tirantes anchos que aportan un aire clásico. Destaca su péplum estructurado con una gran flor central, creando un punto focal elegante. Este diseño minimalista y sofisticado despunta por su tejido en tussord y su amplia sobrefalda.\r\n', 1892.56, 0, 1, 'corte-recto', '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(12, 15, 1, NULL, 'BEL000151', 'CLUTCH PIRÁMIDE VERDE', 'clutch-piramide-verde', 'CLUTCH PIRÁMIDE VERDE', 'CLUTCH PIRÁMIDE VERDE', 32.19, 1, 1, 'bolso', '2025-11-29 13:14:45', '2025-11-29 13:14:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_imagenes`
--

CREATE TABLE `producto_imagenes` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `es_portada` tinyint(1) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto_imagenes`
--

INSERT INTO `producto_imagenes` (`id`, `producto_id`, `url`, `alt_text`, `es_portada`, `orden`, `created_at`, `updated_at`) VALUES
(11, 10, '/imagenes/novias/2025/chiara/chiara-1-5224x4320-1764417590524-575140.jpeg', 'chiara', 1, 0, '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(12, 10, '/imagenes/novias/2025/chiara/chiara-2-2943x4320-1764417590548-529132.jpeg', 'chiara', 0, 1, '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(13, 10, '/imagenes/novias/2025/chiara/chiara-3-3062x4320-1764417590554-845886.jpeg', 'chiara', 0, 2, '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(14, 10, '/imagenes/novias/2025/chiara/chiara-4-3375x4320-1764417590590-380490.jpeg', 'chiara', 0, 3, '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(15, 10, '/imagenes/novias/2025/chiara/chiara-5-2882x4320-1764417590617-273225.jpeg', 'chiara', 0, 4, '2025-11-29 12:59:50', '2025-11-29 12:59:50'),
(17, 12, '/imagenes/complementos/2025/clutch-mar-1764418485405-273741.jpeg', 'CLUTCH PIRÁMIDE VERDE', 1, 0, '2025-11-29 13:14:45', '2025-11-29 13:14:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_variantes`
--

CREATE TABLE `producto_variantes` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `sku` varchar(100) NOT NULL,
  `talla` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto_variantes`
--

INSERT INTO `producto_variantes` (`id`, `producto_id`, `sku`, `talla`, `color`, `stock`, `activo`, `created_at`, `updated_at`) VALUES
(3, 10, 'chiara-44', '44', NULL, 0, 1, '2025-11-29 12:59:50', '2025-11-29 12:59:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `rol` enum('admin','cliente') NOT NULL DEFAULT 'cliente',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `email`, `password_hash`, `telefono`, `rol`, `activo`, `created_at`, `updated_at`) VALUES
(3, 'Jose Ramon', 'Hurtado Mije', 'jhurtadomije@gmail.com', '$2b$10$4sofgoWqUKBSDcviPpsFg.DDq4lbZ5G0zzucooGwRqb6QYCSLS9F.', '652407574', 'admin', 1, '2025-11-28 18:14:30', '2025-11-28 18:46:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_carritos_usuario` (`usuario_id`);

--
-- Indices de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_carrito_items_carrito` (`carrito_id`),
  ADD KEY `fk_carrito_items_variante` (`producto_variante_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_categorias_padre` (`padre_id`);

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_direcciones_usuario` (`usuario_id`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pagos_pedido` (`pedido_id`),
  ADD KEY `fk_pagos_metodo` (`metodo_pago_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_pedido` (`numero_pedido`),
  ADD KEY `fk_pedidos_usuario` (`usuario_id`),
  ADD KEY `fk_pedidos_metodo_pago` (`metodo_pago_id`);

--
-- Indices de la tabla `pedido_historial_estado`
--
ALTER TABLE `pedido_historial_estado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_historial_pedido` (`pedido_id`),
  ADD KEY `fk_historial_usuario` (`cambiado_por`);

--
-- Indices de la tabla `pedido_items`
--
ALTER TABLE `pedido_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pedido_items_pedido` (`pedido_id`),
  ADD KEY `fk_pedido_items_producto` (`producto_id`),
  ADD KEY `fk_pedido_items_variante` (`producto_variante_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_productos_categoria` (`categoria_id`),
  ADD KEY `fk_productos_marca` (`marca_id`),
  ADD KEY `fk_productos_coleccion` (`coleccion_id`);

--
-- Indices de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_imagenes_producto` (`producto_id`);

--
-- Indices de la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_producto_variantes_sku` (`sku`),
  ADD KEY `fk_variantes_producto` (`producto_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido_historial_estado`
--
ALTER TABLE `pedido_historial_estado`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido_items`
--
ALTER TABLE `pedido_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `fk_carritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD CONSTRAINT `fk_carrito_items_carrito` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_carrito_items_variante` FOREIGN KEY (`producto_variante_id`) REFERENCES `producto_variantes` (`id`);

--
-- Filtros para la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD CONSTRAINT `fk_categorias_padre` FOREIGN KEY (`padre_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `fk_direcciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_metodo` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_pagos_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_metodo_pago` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`),
  ADD CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `pedido_historial_estado`
--
ALTER TABLE `pedido_historial_estado`
  ADD CONSTRAINT `fk_historial_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_historial_usuario` FOREIGN KEY (`cambiado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedido_items`
--
ALTER TABLE `pedido_items`
  ADD CONSTRAINT `fk_pedido_items_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pedido_items_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `fk_pedido_items_variante` FOREIGN KEY (`producto_variante_id`) REFERENCES `producto_variantes` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `fk_productos_coleccion` FOREIGN KEY (`coleccion_id`) REFERENCES `colecciones` (`id`),
  ADD CONSTRAINT `fk_productos_marca` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`);

--
-- Filtros para la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD CONSTRAINT `fk_imagenes_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  ADD CONSTRAINT `fk_variantes_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
