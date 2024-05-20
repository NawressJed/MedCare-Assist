-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2024 at 05:47 PM
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
(0x096caeadf2cd4df7b4695692a7f983e3, 'APPROVED', '2024-05-30 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xc4971372d2684991838e1ba85bce57ed, 'PENDING', '2024-05-13 00:00:00.000000', '11:30:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xd5b32a3142c94ee58b77f68b59580d96, 'APPROVED', '2024-06-07 00:00:00.000000', '11:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb),
(0xfff3b079c53d42fca0de24cc18efe7a5, 'APPROVED', '2024-05-23 00:00:00.000000', '11:00:00', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb);

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
  `sender_id` binary(16) DEFAULT NULL,
  `appointment_id` binary(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `message`, `notification_status`, `sent_at`, `title`, `recipient_id`, `sender_id`, `appointment_id`) VALUES
(0x4e3bcf78bcd74b56a54829c6a94ca9af, 'Appointment request from Amal Bns for 2024-05-30 01:00:00.0 at 11:30:00.', 'SENT', '2024-05-19 15:42:23.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb, 0x096caeadf2cd4df7b4695692a7f983e3),
(0x5ad6e27ed24e43d595f5bcb22ab6569b, 'Your appointment request with Dr. Nawress Jedidi for 2024-06-07 01:00:00.0 at 11:00:00 has been approved.', 'SENT', '2024-05-19 15:36:25.000000', 'Appointment Approval', 0x4cce98144f22418d8209d232d52227cb, 0x8b567912b95a4e4688a5a01d004e088b, 0xd5b32a3142c94ee58b77f68b59580d96),
(0x6970ba3f7eb8410ea575b87e2196a91e, 'Appointment request from Amal Bns for 2024-06-07 01:00:00.0 at 11:00:00.', 'SENT', '2024-05-19 15:28:04.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb, 0xd5b32a3142c94ee58b77f68b59580d96),
(0xa7faf3b364df4448bb7ede39da81d86e, 'Your appointment request with Dr. Nawress Jedidi for 2024-05-30 01:00:00.0 at 11:30:00 has been approved.', 'SENT', '2024-05-19 15:42:26.000000', 'Appointment Approval', 0x4cce98144f22418d8209d232d52227cb, 0x8b567912b95a4e4688a5a01d004e088b, 0x096caeadf2cd4df7b4695692a7f983e3),
(0xf3db074603304ccc964f97a80239abc0, 'Your appointment request with Dr. Nawress Jedidi for 2024-05-23 01:00:00.0 at 11:00:00 has been approved.', 'SENT', '2024-05-19 15:21:41.000000', 'Appointment Approval', 0x4cce98144f22418d8209d232d52227cb, 0x8b567912b95a4e4688a5a01d004e088b, 0xfff3b079c53d42fca0de24cc18efe7a5),
(0xfd7fa8c5405b4800ba83da8d0d645ed4, 'Appointment request from Amal Bns for 2024-05-13 01:00:00.0 at 11:30:00.', 'SENT', '2024-05-19 15:36:14.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb, 0xc4971372d2684991838e1ba85bce57ed),
(0xfdb6a9e9a7c144a1aa8690ce53218446, 'Appointment request from Amal Bns for 2024-05-23 01:00:00.0 at 11:00:00.', 'SENT', '2024-05-19 15:21:06.000000', 'Appointment Request', 0x8b567912b95a4e4688a5a01d004e088b, 0x4cce98144f22418d8209d232d52227cb, 0xfff3b079c53d42fca0de24cc18efe7a5);

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
(0x01e60a87d2894a0daa3e31d57115bb65, '2024-05-25 21:06:58.000000', 'f6cf1a38-f635-40be-93da-31738d8050fc', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x035e3d2b31564714892d93b6efa72997, '2024-05-25 22:01:33.000000', '826da50e-4ec3-492d-abe3-19196aa074cd', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x06a244d7742241f0a37b5b9f33f4485d, '2024-05-25 21:45:48.000000', 'ff6dfa53-fc72-451e-933e-dd3b3f706708', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x074dc85132174a9e939f2941b25cdf78, '2024-05-26 12:29:36.000000', '5ab48b8c-a479-460d-8a8a-8e2aac411a45', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x113bd7239c9b419b9f23119950c59197, '2024-05-25 21:47:35.000000', '8742b34f-d355-4ff6-a5d2-ea0f5154eefd', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x19f47a6b4421415081eacc9ca4c4088a, '2024-05-25 19:10:43.000000', '7c876e86-855b-4a7b-9d9c-9ecc60fb7e57', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x1eb99664cd0f438bb594c49c27407185, '2024-05-26 15:11:49.000000', 'c6707a24-f5c1-45dd-a506-a5a5e2a7998a', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x24dd79b8456f46d197fda3e5e89a94c6, '2024-05-25 21:24:33.000000', 'bc65a492-0c7c-4c09-8e56-4aad679f5f4d', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x29ba77faa38b47178ad87602ee5481f9, '2024-05-26 15:15:14.000000', '7ab315c2-bb6d-458c-bb59-732bf5041b67', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x2a94d6c4f30e4ab2b59f580980d6d671, '2024-05-25 19:23:36.000000', '0f0ab23f-bcf8-4281-baac-255e261f856e', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x2ee8d08f720344ceaefbf0f47d8b2a4d, '2024-05-26 18:16:08.000000', '27368e4b-45f7-4bbd-9c13-2c5e1fad996c', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x35d5cd62de9e49ec946a5b6e02ab2167, '2024-05-25 19:10:35.000000', '7a3a8999-e9f0-4f1c-bca2-7f1f23cfeb44', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x3eb37fa32b894e8e8d3a57537d97f4a7, '2024-05-26 15:27:37.000000', 'e8446505-153b-4fc6-85f2-fe284136486a', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x41a67fca53c341948b4952bb046b5ca3, '2024-05-26 15:11:42.000000', '85149e3f-2946-4941-b91d-73639373af0d', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x4795f9b95540472b91a373795e85d4f7, '2024-05-26 15:08:58.000000', '17c6bfa4-17fe-4bbf-9070-cc1dfb9d02ec', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x4979a5fcc9cf4b0785991b46ef59f966, '2024-05-25 20:26:10.000000', '13dbf61b-749c-4623-9ba1-af341ed4ea43', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x552078e3d739453a9839f4d32d7a49e9, '2024-05-26 12:50:08.000000', 'c3733220-a4b4-4fbf-ac2a-81b7dabd8430', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x5a085667292c4d11ac0a561a824b16f5, '2024-05-26 12:36:17.000000', 'b5383318-723d-4140-b065-395c39b46426', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x5bceb7b4261c495b934a409bb8c43698, '2024-05-26 15:42:11.000000', '0193b971-2bb4-4d06-aed2-d4d97d6e7fe6', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x5f985aac590544899317981db8d8e97f, '2024-05-26 12:29:25.000000', '101bd148-8101-4f7b-b111-8ffc6c64e69e', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x5ffd2ca8b640468681830b126c205396, '2024-05-26 15:20:48.000000', 'a20826e8-2d2f-4918-a0fa-6a3bd2bcd29f', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x65d1ef607b1d461a8e4a5b5fb6b694d7, '2024-05-26 12:24:31.000000', '7346452e-2860-415c-b1e4-e05e6bda3998', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x6673a2dbc36c4db8982398594292bdd7, '2024-05-25 21:06:48.000000', '65984aa9-c25c-47ab-874e-8ffb343eb266', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x67f5d90683e94368bb770f787013675e, '2024-05-25 21:19:11.000000', '2ae2f5a2-3673-4895-a5d7-d65e0b7a6eb1', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x72e17025e21c49088405d49acebbafae, '2024-05-26 12:31:42.000000', '9d980a17-56ab-4046-bbad-7323fe7d775b', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x72eb01e0af8e4e79b16a998bd586bfbd, '2024-05-26 15:27:49.000000', '89cef46c-9e04-4221-a841-2abffc14caa1', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x8227c32c58ab48afbb64abfee619e7a0, '2024-05-25 19:22:34.000000', '3bac773b-a2aa-4082-815c-7b17396d1c90', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x8610a8f1422a4ac0834e9f3fc6fe96d6, '2024-05-26 15:35:55.000000', '5256061c-bcac-4d1b-ae1a-4041174d3898', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x8ac29133e08b4d4ab169a8b6b760a236, '2024-05-25 19:23:42.000000', '83929d4a-a903-4277-ac62-b9798dc9fa89', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x8f0d1676200144bca1afdb6f9fe15fad, '2024-05-26 12:24:16.000000', '0d494235-0ff5-4b45-bc10-4bfe46763d44', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x8f1eb837d2d9486380ea4b0bde01fa28, '2024-05-26 12:50:30.000000', '7b474a6f-83dc-4bbe-9248-59f62a1d3287', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x941f1c6ec29f4f66a9a41bebb61d809b, '2024-05-25 21:47:47.000000', '7edd9712-887e-4912-bf7b-981703bf7c3b', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0x993ff62b835849a693a977470be02232, '2024-05-25 19:22:26.000000', '142e0721-86d1-473e-89c6-5dc8406100e0', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0x9ba3b14cdcdc4d2ba795626cf9e9cebb, '2024-05-26 15:20:54.000000', '43affbfd-cd0e-4eb3-86a1-1716e2223d72', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xa4ece0c3bc3b4887a400ee453ef7d359, '2024-05-26 16:27:37.000000', 'e6a20624-2e6a-4426-a6e2-147826982f6c', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xabbcf9887e7e4a8fad9e7705d4455bf8, '2024-05-25 20:29:03.000000', '0a36781e-0af6-44a0-a972-5a19c76c74c9', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xada23ef3da0349a28235b27dfef6271e, '2024-05-26 15:10:06.000000', '002bf221-c693-4cb6-94e7-ee987f8655d4', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xb7a2355d4bd34c1eb36bb3ea3fd004b2, '2024-05-25 21:11:46.000000', '0cfdfb84-163a-4868-9dfa-dcab18e91728', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xc13309a94d824a7392bde06d8865171f, '2024-05-26 15:42:04.000000', '8e1b4e0f-1e18-45ff-8aac-9f72aec4fb1c', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xc23e62b93e204d6696b0e9cd87ba545f, '2024-05-25 21:45:28.000000', '79f08abb-bd18-4894-b5bc-d095e9155433', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xc55e4e1a28f94458994a3a9bd220f17a, '2024-05-26 15:07:35.000000', 'fd946d20-0e85-489f-88ea-e9d45584d03a', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xcb55b72b044e46c490fd75373f65039b, '2024-05-26 15:36:02.000000', 'a9abe6c9-08b8-4295-b686-d3d915d3de0e', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xdb83220dec7b4091a303d90a85656119, '2024-05-26 15:15:58.000000', '27c87019-683e-45ce-ad9f-3bb88a4dac79', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xdd88b0f7f8444a5982a9acda3cbb7f34, '2024-05-25 19:18:14.000000', '3683b769-4f81-49de-ac4d-1861540448cb', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xe643d679174f450a8912dbd595cc8ed9, '2024-05-25 20:30:35.000000', '74a00461-63d8-460e-8a94-1646810c450a', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xeabff1562bd145938f56466f2d8a2a1d, '2024-05-25 20:26:58.000000', '96f0721d-80ba-453c-961f-17a4c62399e8', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xec82760dfa074973bf827991871a9f60, '2024-05-26 12:31:35.000000', '30efe106-552c-46be-8cef-2a552ee8c8d6', 'REFRESH_TOKEN', 0x4cce98144f22418d8209d232d52227cb),
(0xf07a9842bb2b41b1b3400e66207883e9, '2024-05-25 19:17:59.000000', 'd202263e-97b0-4e93-9a90-1a7df7e98f8d', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xf9c142bb61554b299f754cae972bb858, '2024-05-26 16:15:57.000000', '039a62e2-c42e-4d98-b88b-36a641e9de48', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xfaa19c2cd5694b1781f88a9ba7096d2c, '2024-05-25 21:18:38.000000', '857ad6d3-005a-44cb-aa19-06a48793649d', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b),
(0xff91fba1100d4c3b83ee7fe7a360705b, '2024-05-26 12:36:24.000000', '1fbd9fdf-6c91-4a49-9241-643c44e36473', 'REFRESH_TOKEN', 0x8b567912b95a4e4688a5a01d004e088b);

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
  ADD KEY `FKnbt1hengkgjqru2q44q8rlc2c` (`sender_id`),
  ADD KEY `FKba3lvrguju5i8rct28wk40v8s` (`appointment_id`);

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
  ADD CONSTRAINT `FKba3lvrguju5i8rct28wk40v8s` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`id`),
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
