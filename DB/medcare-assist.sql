-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2024 at 07:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
  `uuid` binary(16) NOT NULL,
  `appointment_status` enum('PENDING','APPROVED','REJECTED') DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time(6) DEFAULT NULL,
  `doctor_id` binary(16) NOT NULL,
  `patient_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`uuid`, `appointment_status`, `date`, `time`, `doctor_id`, `patient_id`) VALUES
(0xa046677ee479489aafd208cc6d75d85d, 'APPROVED', '2024-05-10', '10:00:00.000000', 0x623b57e547b74317a04c2bdeb66501c3, 0xdf84c46ec6fd439e8dd5c579d8b594f1),
(0xd0c687c07934441fb82175034ea7bd7e, 'APPROVED', '2024-05-10', '10:00:00.000000', 0x623b57e547b74317a04c2bdeb66501c3, 0xdf84c46ec6fd439e8dd5c579d8b594f1);

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
(50, 'ENDOCRINOLOGIST', '70600400', 0x623b57e547b74317a04c2bdeb66501c3);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `uuid` binary(16) NOT NULL,
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

INSERT INTO `notification` (`uuid`, `message`, `notification_status`, `sent_at`, `title`, `recipient_id`, `sender_id`) VALUES
(0x98d18182739a48a9897f526382232307, 'Appointment request from Patient1 33 for 2024-05-10 at 10:00.', 'SENT', '2024-05-10 18:06:58.000000', 'Appointment Request', 0x623b57e547b74317a04c2bdeb66501c3, 0xdf84c46ec6fd439e8dd5c579d8b594f1),
(0x9ce1a7ecf22b4b27a5cdab5d768f5bcd, 'Your appointment request with Dr. Doctor 33 for 2024-05-10 at 10:00 has been approved.', 'SENT', '2024-05-10 18:08:34.000000', 'Appointment Approval', 0xdf84c46ec6fd439e8dd5c579d8b594f1, 0x623b57e547b74317a04c2bdeb66501c3);

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
('1996-06-12 00:00:00.000000', 0xdf84c46ec6fd439e8dd5c579d8b594f1);

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
(0x12acb323d80c4d25b8e2120d10578aa3, '2024-05-18 15:14:59.000000', 'bf1fbae3-7d6f-4903-ae40-bb2a06442faa', 'REFRESH_TOKEN', 0x623b57e547b74317a04c2bdeb66501c3),
(0x636a208fe6ae4e3c9c5f86ec20263347, '2024-05-18 15:18:52.000000', '09734a26-65e1-4ded-9dda-f713b4b5f910', 'REFRESH_TOKEN', 0x623b57e547b74317a04c2bdeb66501c3),
(0xbd5b48f79ca94eeab813477e0dabdfe2, '2024-05-18 15:26:37.000000', 'ef2f76b9-9fea-461d-b551-5789bc4d2a1b', 'REFRESH_TOKEN', 0x623b57e547b74317a04c2bdeb66501c3),
(0xe53d7d33c65f4ab8a1d6d5f698edc3d5, '2024-05-18 15:23:01.000000', 'c00d7fb8-a568-4b67-bd62-058a6d779cea', 'REFRESH_TOKEN', 0x623b57e547b74317a04c2bdeb66501c3);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uuid` binary(16) NOT NULL,
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

INSERT INTO `user` (`uuid`, `address`, `email`, `firstname`, `gender`, `lastname`, `password`, `phone_number`, `role`, `zip_code`) VALUES
(0x623b57e547b74317a04c2bdeb66501c3, 'Sousse', 'nawress.jed@gmail.com', 'Doctor', 'FEMALE', '33', '$2a$10$0nwodAKh3YJp67NsRIH4d.BlrRqnyit2aPNubKXt3IegBYkuwEn.K', '50200300', 'DOCTOR', '5000'),
(0xdf84c46ec6fd439e8dd5c579d8b594f1, 'Sousse', 'nawress.je@gmail.com', 'Patient1', 'FEMALE', '33', '$2a$10$iJeglD7HJTY1c353QIQbc.IsUHewhzfFh5h7fudM1MvxnCzsvb06W', '22888999', 'PATIENT', '4000');

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
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `FKoeb98n82eph1dx43v3y2bcmsl` (`doctor_id`),
  ADD KEY `FK4apif2ewfyf14077ichee8g06` (`patient_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `FKqnduwq6ix2pxx1add03905i1i` (`recipient_id`),
  ADD KEY `FKnbt1hengkgjqru2q44q8rlc2c` (`sender_id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`user_id`);

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
  ADD PRIMARY KEY (`uuid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FK8ahhk8vqegfrt6pd1p9i03aej` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

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
  ADD CONSTRAINT `FK9roto9ydtnjfkixvexq5vxyl5` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FKnbt1hengkgjqru2q44q8rlc2c` FOREIGN KEY (`sender_id`) REFERENCES `user` (`uuid`),
  ADD CONSTRAINT `FKqnduwq6ix2pxx1add03905i1i` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `FKp6ttmfrxo2ejiunew4ov805uc` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FKe32ek7ixanakfqsdaokm4q9y2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
