-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 09 Des 2025 pada 00.15
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kasir`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Sembako'),
(3, 'Bumbu Dapur'),
(6, 'Kopi'),
(7, 'Camilan'),
(8, 'Non Kopi'),
(9, 'Susu');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `address`, `created_at`) VALUES
(1, 'Pak Budi', '0812345', 'RT 002 RW 003', '2025-12-02 09:17:11'),
(2, 'Pak Aep', '0899999', 'Jl Melati No 1', '2025-12-02 09:32:23'),
(3, 'Ibu Tetangga', '0812345678', 'Kp. Pasirjati No. 5', '2025-12-06 08:45:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `debt_payments`
--

CREATE TABLE `debt_payments` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `amount` decimal(15,0) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `price_buy` decimal(15,0) DEFAULT NULL,
  `price_sell` decimal(15,0) DEFAULT NULL,
  `price_wholesale` decimal(15,0) DEFAULT NULL,
  `min_wholesale_qty` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `min_stock` int(11) DEFAULT 5,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `code`, `name`, `category_id`, `unit_id`, `price_buy`, `price_sell`, `price_wholesale`, `min_wholesale_qty`, `stock`, `min_stock`, `image`, `created_at`) VALUES
(1, '123456', 'Roti Bakar', 7, 7, 18000, 28000, 0, 0, 69, 25, 'product-1764929555487.png', '2025-12-02 03:43:08'),
(2, '1234565', 'Kentang Goreng', 7, 7, 10000, 25000, 0, 0, 25, 20, 'product-1764929497680.png', '2025-12-02 04:36:53'),
(3, '54321', 'Espresso', 3, 8, 15000, 23000, 0, 0, 27, 20, 'product-1764905637054.png', '2025-12-02 05:04:53'),
(4, 'kop-001', 'Cappucino', 6, 8, 15000, 25000, 0, 0, 15, 10, 'product-1765060559186.png', '2025-12-04 09:40:14'),
(5, 'kop-002', 'Kopi Hitam', 6, 8, 10000, 20000, 0, 0, 34, 10, 'product-1765060569544.png', '2025-12-04 22:17:07'),
(7, '4433222', 'Cireng', 7, 7, 10000, 12000, 0, 0, 30, 5, 'product-1764997736900.png', '2025-12-06 05:08:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(15,0) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchases`
--

INSERT INTO `purchases` (`id`, `invoice_no`, `supplier_id`, `user_id`, `total_amount`, `created_at`) VALUES
(1, 'PO-1234567', 2, 1, 670000, '2025-12-02 10:12:34'),
(2, 'INV-12343312', 1, 1, 9000, '2025-12-04 09:42:01'),
(3, 'INV-1234444444', 2, 1, 250000, '2025-12-05 10:19:31'),
(4, 'BUY-1765017699920', 6, 1, 100000, '2025-12-06 10:41:39'),
(5, 'BUY-1765017724429', 6, 1, 225000, '2025-12-06 10:42:04'),
(6, 'INV-333333', 6, 1, 380000, '2025-12-06 11:15:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price_buy` decimal(15,0) DEFAULT NULL,
  `subtotal` decimal(15,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_id`, `qty`, `price_buy`, `subtotal`) VALUES
(1, 1, 1, 160, 4000, 640000),
(2, 1, 3, 100, 300, 30000),
(3, 2, 2, 30, 300, 9000),
(4, 3, 5, 10, 10000, 100000),
(5, 3, 4, 10, 15000, 150000),
(6, 4, 7, 10, 10000, 100000),
(7, 5, 4, 15, 15000, 225000),
(8, 6, 5, 1, 10000, 10000),
(9, 6, 1, 20, 18000, 360000),
(10, 6, 7, 1, 10000, 10000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `access_menu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`, `access_menu`) VALUES
(1, 'Super Admin', '[\"*\"]'),
(2, 'Kasir', '[\"dashboard\",\"pos\",\"pos_history\",\"master_data\",\"inventory\",\"reports\",\"categories\",\"units\",\"products\",\"suppliers\",\"customers\"]');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `total_amount` decimal(15,0) DEFAULT NULL,
  `discount_amount` decimal(15,0) DEFAULT 0,
  `final_amount` decimal(15,0) DEFAULT NULL,
  `paid_amount` decimal(15,0) DEFAULT NULL,
  `change_amount` decimal(15,0) DEFAULT NULL,
  `payment_method` enum('Tunai','QRIS','Transfer') DEFAULT 'Tunai',
  `payment_status` enum('lunas','kasbon') DEFAULT 'lunas',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sales`
--

INSERT INTO `sales` (`id`, `invoice_no`, `user_id`, `customer_id`, `total_amount`, `discount_amount`, `final_amount`, `paid_amount`, `change_amount`, `payment_method`, `payment_status`, `created_at`) VALUES
(1, 'INV-1764662068983', 1, NULL, 15000, 0, 15000, 20000, 5000, 'Tunai', 'lunas', '2025-12-02 07:54:28'),
(2, 'INV-1764668030276', 1, 2, 5000, 0, 5000, 5000, 0, 'Tunai', 'lunas', '2025-12-02 09:33:50'),
(3, 'INV-1764712802448', 1, NULL, 95000, 0, 95000, 100000, 5000, 'Tunai', 'lunas', '2025-12-02 22:00:02'),
(4, 'INV-1764736547751', 1, NULL, 15000, 0, 15000, 15000, 0, 'Tunai', 'lunas', '2025-12-03 04:35:47'),
(5, 'INV-1764834555311', 1, NULL, 27000, 0, 27000, 30000, 3000, 'Tunai', 'lunas', '2025-12-04 07:49:15'),
(6, 'INV-1764903029162', 1, NULL, 5000, 0, 5000, 5000, 0, 'QRIS', 'lunas', '2025-12-05 02:50:29'),
(7, 'INV-1764909414978', 1, NULL, 405000, 0, 405000, 405000, 0, 'QRIS', 'lunas', '2025-12-05 04:36:54'),
(8, 'INV-1764918389067', 1, NULL, 10000, 0, 10000, 10000, 0, 'Tunai', 'lunas', '2025-12-05 07:06:29'),
(9, 'INV-1764919092135', 1, NULL, 1107500, 0, 1107500, 1107500, 0, 'Transfer', 'lunas', '2025-12-05 07:18:12'),
(10, 'INV-1764929185035', 1, 1, 4522500, 0, 4522500, 4800000, 277500, 'Tunai', 'lunas', '2025-12-05 10:06:25'),
(11, 'INV-1764929894662', 1, NULL, 254000, 0, 254000, 260000, 6000, 'Tunai', 'lunas', '2025-12-05 10:18:14'),
(12, 'INV-1764998535488', 1, NULL, 60000, 0, 60000, 60000, 0, 'QRIS', 'lunas', '2025-12-06 05:22:15'),
(13, 'INV-1765001932837', 1, NULL, 25000, 0, 25000, 25000, 0, 'Transfer', 'lunas', '2025-12-06 06:18:52'),
(14, 'INV-1765013026210', 1, NULL, 25000, 0, 25000, 25000, 0, 'QRIS', 'lunas', '2025-12-06 09:23:46'),
(15, 'INV-1765013091745', 1, NULL, 425000, 0, 425000, 425000, 0, 'QRIS', 'lunas', '2025-12-06 09:24:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(15,0) DEFAULT NULL,
  `subtotal` decimal(15,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `price`, `subtotal`) VALUES
(1, 1, 3, 10, 500, 5000),
(2, 1, 2, 2, 500, 1000),
(3, 1, 1, 2, 4500, 9000),
(4, 2, 2, 10, 500, 5000),
(5, 3, 1, 10, 4500, 45000),
(6, 3, 3, 100, 500, 50000),
(7, 4, 2, 30, 500, 15000),
(8, 5, 1, 6, 4500, 27000),
(9, 6, 3, 1, 500, 500),
(10, 6, 1, 1, 4500, 4500),
(11, 7, 5, 2, 200000, 400000),
(12, 7, 2, 10, 500, 5000),
(13, 8, 2, 10, 500, 5000),
(14, 8, 3, 10, 500, 5000),
(15, 9, 2, 5, 500, 2500),
(16, 9, 5, 1, 200000, 200000),
(17, 9, 4, 1, 900000, 900000),
(18, 9, 3, 1, 500, 500),
(19, 9, 1, 1, 4500, 4500),
(20, 10, 1, 5, 4500, 22500),
(21, 10, 4, 5, 900000, 4500000),
(22, 11, 5, 3, 20000, 60000),
(23, 11, 4, 5, 25000, 125000),
(24, 11, 3, 3, 23000, 69000),
(25, 12, 7, 1, 12000, 12000),
(26, 12, 1, 1, 28000, 28000),
(27, 12, 5, 1, 20000, 20000),
(28, 13, 4, 1, 25000, 25000),
(29, 14, 4, 1, 25000, 25000),
(30, 15, 4, 17, 25000, 425000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `store_name` varchar(255) DEFAULT 'Aplikasi Kasir',
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `store_name`, `email`, `phone`, `address`, `logo`) VALUES
(1, 'Coffee Shop2', 'admin@toko.com', '08123456789', 'Jl. Jendral Sudirman No. 1', 'logo-1765063719441.svg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `stock_adjustments`
--

CREATE TABLE `stock_adjustments` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `system_stock` int(11) DEFAULT NULL,
  `real_stock` int(11) DEFAULT NULL,
  `difference` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `stock_adjustments`
--

INSERT INTO `stock_adjustments` (`id`, `product_id`, `user_id`, `system_stock`, `real_stock`, `difference`, `note`, `created_at`) VALUES
(1, 2, 1, 38, 38, 0, '', '2025-12-03 04:27:00'),
(2, 1, 1, 228, 225, -3, 'rusak', '2025-12-03 04:28:13'),
(3, 3, 1, 40, 42, 2, '', '2025-12-03 04:29:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `phone`, `address`, `created_at`) VALUES
(1, 'PT Wings', '081234567', 'Jl Pahlawan No 123', '2025-12-02 09:16:24'),
(2, 'PT Indofood Fortuna Makmur', '123456', 'tes', '2025-12-02 09:59:19'),
(3, 'PT Mayora Indah Tbk', '2234567', 'tes', '2025-12-02 09:59:37'),
(4, 'PT Kino Indonesia Tbk', '5678', 'tes', '2025-12-02 09:59:52'),
(5, 'PD. Dua Bintang Snack', '0812345678', 'Jl. Merdeka Barat No. 10', '2025-12-02 10:00:05'),
(6, 'PT Distributor Segalanya', '089999999999', 'Jl. Raya Sukamaju No. 12', '2025-12-06 09:46:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `units`
--

INSERT INTO `units` (`id`, `name`) VALUES
(1, 'Pcs'),
(2, 'Lembar'),
(3, 'Buah'),
(4, 'Liter'),
(5, 'Kg'),
(6, 'Sachet'),
(7, 'Porsi'),
(8, 'Gelas');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role_id` int(11) DEFAULT 2,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role_id`, `password`, `avatar`, `created_at`) VALUES
(1, 'Admin', 'admin@email.com', 1, '$2b$10$0Ihi0Gt0Zpede7WpXxkQ2ONKY9mQYrTkz2kv0CkvOCYVjK5jWWU2a', 'avatar-1-1765064142496.png', '2025-12-01 02:55:55'),
(2, 'Budi', 'budi@email.com', 2, '$2b$10$iRfk1CwFRuYKSHCoCczgu.auQ9qjlXyfoHTswrHvvdxkVXTQoJiQ2', NULL, '2025-12-08 04:43:28');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indeks untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_no` (`invoice_no`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indeks untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD CONSTRAINT `debt_payments_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`);

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Ketidakleluasaan untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  ADD CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Ketidakleluasaan untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD CONSTRAINT `stock_adjustments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
