-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2024 at 03:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medcare-assist`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `is_admin` bit(1) NOT NULL,
  `user_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id` binary(16) NOT NULL,
  `appointment_status` enum('PENDING','APPROVED','REJECTED') DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `doctor_id` binary(16) NOT NULL,
  `patient_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`id`, `appointment_status`, `date`, `time`, `doctor_id`, `patient_id`) VALUES
(0x13a26abb978e41cbaa433a9618d25de2, 'PENDING', '2024-05-29 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x1f92bdfeea404e6382cc2577f5b4fab5, 'APPROVED', '2024-05-21 00:00:00.000000', '09:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x449cc6744db94d58b7e562d3a6555566, 'PENDING', '2024-05-24 00:00:00.000000', '09:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x46fd34dc5ec84701b5c8d7e6dd3b7463, 'PENDING', '2024-04-30 00:00:00.000000', '11:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x64551bf178ef40b4bd35c644db603881, 'PENDING', '2024-05-23 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x79b072cdf41147cc8a3edf8ce230c4dd, 'PENDING', '2024-05-23 00:00:00.000000', '10:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x8464b7936d1649f0b1d663cea63e5a2b, 'PENDING', '2024-07-23 00:00:00.000000', '09:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x96c9da4a422843388dfd3b81d5df64c7, 'PENDING', '2024-05-29 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0x9c15444758f040f1ba32ff2972449eb2, 'PENDING', '2024-06-28 00:00:00.000000', '11:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xe5bbf02649174db2a884ad776803fdda, 'PENDING', '2024-05-29 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xf27233a9457e43b58c26da0be414b1ec, 'PENDING', '2024-05-18 00:00:00.000000', '10:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `consultation_price` float NOT NULL,
  `specialty` enum('ANESTHESIOLOGIST','CARDIOLOGIST','DERMATOLOGIST','ENDOCRINOLOGIST','FAMILY_PHYSICIAN','GASTROENTEROLOGIST','NERPHOLOGIST','NEUROLOGIST','OPHTHALMOLOGIST','PEDIATRICIAN','RADIOLOGIST') DEFAULT NULL,
  `work_phone_number` varchar(255) DEFAULT NULL,
  `user_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`consultation_price`, `specialty`, `work_phone_number`, `user_id`) VALUES
(70, 'NEUROLOGIST', '70300500', 0x8b567912b95a4e4688a5a01d004e088b);

-- --------------------------------------------------------

--
-- Table structure for table `medical_file`
--

CREATE TABLE `medical_file` (
  `id` binary(16) NOT NULL,
  `date` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `disease` varchar(255) DEFAULT NULL,
  `doctor_id` binary(16) NOT NULL,
  `patient_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` binary(16) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `notification_status` enum('NOT_SENT','SENT') DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `recipient_id` binary(16) DEFAULT NULL,
  `sender_id` binary(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `message`, `notification_status`, `sent_at`, `title`, `recipient_id`, `sender_id`) VALUES
(0x1bd479b7baec437fa65b3ae7d72ad7f8, 'Appointment request from Amal Bns for Sat May 18 01:00:00 CET 2024 at 10:30:00.', 'SENT', '2024-05-18 00:15:35.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xb5399c3ec0dc4114804cb4becfed4403, 'Appointment request from Amal Bns for Fri May 24 01:00:00 CET 2024 at 09:30:00.', 'SENT', '2024-05-18 10:14:56.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `date_of_birth` datetime(6) DEFAULT NULL,
  `user_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`date_of_birth`, `user_id`) VALUES
('1997-06-09 23:00:00.000000', 0x4cce98144f22418d8209d232d52227cb);

-- --------------------------------------------------------

--
-- Table structure for table `patients_doctors`
--

CREATE TABLE `patients_doctors` (
  `doctor_id` binary(16) NOT NULL,
  `patient_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients_doctors`
--

INSERT INTO `patients_doctors` (`doctor_id`, `patient_id`) VALUES
(0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb);

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` binary(16) NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `token_type` enum('ACCESS_TOKEN','REFRESH_TOKEN','CONFIRM_ACCOUNT','RESET_PASSWORD') DEFAULT NULL,
  `user_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`id`, `expires_at`, `token`, `token_type`, `user_id`) VALUES
(0x2bb3be9d81eb4d0ea7ca0460fb85c43b, '2024-05-25 10:14:17.000000', 'dd5f6034-8715-4918-bd8b-ba1c8a57f63d', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x2cb98a4f69ce4e46a84a45b5c173753f, '2024-05-25 10:11:53.000000', 'ceb92c63-cf3e-40b7-9f3f-6fae6fc8866f', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x4c06465dbc014a1fb0ec44eb5f0641a8, '2024-05-25 10:14:39.000000', 'cad5d8d6-565a-4e16-9843-3bee503ec241', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x57e0bddf9c5a4b838b704d6071e6b610, '2024-05-24 17:20:54.000000', '0eace5bb-15c7-4ae0-8e28-fb09378b9363', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x5fb2105f80654480b429ab52bc447392, '2024-05-25 11:51:53.000000', '4806e083-01d1-4329-8248-3dd63971c28e', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x740328b7b42b479a8dd352f11ae4e6bb, '2024-05-24 21:30:38.000000', '36b5c8b5-f753-4b13-9853-192e75836ec8', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x89174bfe13274128ba9ca350bf50d769, '2024-05-25 00:03:16.000000', 'addef936-16ae-4239-b8f4-1fa1423d624b', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x9ab15b327f674433b3e8b508d6ca33a1, '2024-05-24 16:23:16.000000', 'cc22cd98-5b2e-40fc-8fd0-a0c711218a76', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xa7bee9926b86400ca35446da0d08ed3f, '2024-05-25 00:03:56.000000', '85355d0f-b6e7-46a0-b72c-706573629ea2', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xc1cfec49e9fb4ea894b0d828b4acf72d, '2024-05-24 20:45:32.000000', '624c8dbe-c1ee-4fe7-bee4-5c54de3c8606', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xe40f45d8cfa54c9b91c9c19d917c8703, '2024-05-24 20:44:36.000000', '9fd611fc-a55e-491a-b618-f0e2c949b2b0', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xe6687fff722240aba1be4c406af5fd0a, '2024-05-25 10:11:13.000000', '0792d6bf-282e-4bc2-bdd8-f15ec7a72cfd', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` binary(16) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','DOCTOR','PATIENT') DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `address`, `email`, `firstname`, `gender`, `lastname`, `password`, `phone_number`, `role`, `zip_code`) VALUES
(0x4cce98144f22418d8209d232d52227cb, 'Monastir, Jemmal', 'amal.bns@gmail.com', 'Amal', 'FEMALE', 'Bns', '$2a$10$DaNaebUhlw3lR.0cJ68m..MKYRhYSD0gw1GPq0ABJVA3MDfEbJPnC', '22555777', 'PATIENT', '5020'),
(0x8b567912b95a4e4688a5a01d004e088b, 'Monastir', 'nawress.jed@gmail.com', 'Nawress', 'FEMALE', 'Jedidi', '$2a$10$i7sFlGO4Tv12zxdNRVkd1.ErCfX20JvpkPGPZjbKJ8thoK5Tiyh5q', '55666777', 'DOCTOR', '5000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKoeb98n82eph1dx43v3y2bcmsl` (`doctor_id`),
  ADD KEY `FK4apif2ewfyf14077ichee8g06` (`patient_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `medical_file`
--
ALTER TABLE `medical_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKf7thcjqjxelh3gix37htg1wm7` (`doctor_id`),
  ADD KEY `FK4og8vptoswb4ftro17f2wvbio` (`patient_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqnduwq6ix2pxx1add03905i1i` (`recipient_id`),
  ADD KEY `FKnbt1hengkgjqru2q44q8rlc2c` (`sender_id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `patients_doctors`
--
ALTER TABLE `patients_doctors`
  ADD PRIMARY KEY (`doctor_id`,`patient_id`),
  ADD KEY `FKnutnv4dpjncdxlolc1jq419mx` (`patient_id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_pddrhgwxnms2aceeku9s2ewy5` (`token`),
  ADD KEY `FKe32ek7ixanakfqsdaokm4q9y2` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FK8ahhk8vqegfrt6pd1p9i03aej` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `FK4apif2ewfyf14077ichee8g06` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`user_id`),
  ADD CONSTRAINT `FKoeb98n82eph1dx43v3y2bcmsl` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`user_id`);

--
-- Constraints for table `doctor`
--
ALTER TABLE `doctor`
  ADD CONSTRAINT `FK9roto9ydtnjfkixvexq5vxyl5` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `medical_file`
--
ALTER TABLE `medical_file`
  ADD CONSTRAINT `FK4og8vptoswb4ftro17f2wvbio` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`user_id`),
  ADD CONSTRAINT `FKf7thcjqjxelh3gix37htg1wm7` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`user_id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FKnbt1hengkgjqru2q44q8rlc2c` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKqnduwq6ix2pxx1add03905i1i` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `FKp6ttmfrxo2ejiunew4ov805uc` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `patients_doctors`
--
ALTER TABLE `patients_doctors`
  ADD CONSTRAINT `FKnutnv4dpjncdxlolc1jq419mx` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`user_id`),
  ADD CONSTRAINT `FKtaxs75ejow3mwqwfpatvgf09v` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`user_id`);

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FKe32ek7ixanakfqsdaokm4q9y2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
