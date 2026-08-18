-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Aug 18, 2026 at 04:51 AM
-- Server version: 8.0.46
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `client_id` int NOT NULL,
  `client_fullname` varchar(255) NOT NULL,
  `client_email` varchar(255) NOT NULL,
  `client_password` varchar(255) NOT NULL,
  `client_insitution` int DEFAULT NULL,
  `cleint_role` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commect`
--

CREATE TABLE `commect` (
  `cm_id` int NOT NULL,
  `cm_ev_id` int NOT NULL,
  `cm_assessor_id` int NOT NULL,
  `cm_detail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evolution`
--

CREATE TABLE `evolution` (
  `ev_id` int NOT NULL,
  `ev_client_id` int NOT NULL,
  `ev_as_id` int NOT NULL,
  `ev_status` enum('dart','consider','success','timeout') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `insitution`
--

CREATE TABLE `insitution` (
  `ins_id` int NOT NULL,
  `ins_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `score_id` int NOT NULL,
  `score_ev_id` int NOT NULL,
  `score_assessor_id` int NOT NULL,
  `score_topic_id` int NOT NULL,
  `score_subtopic_id` int NOT NULL,
  `score_score` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subtopic`
--

CREATE TABLE `subtopic` (
  `subtopic_id` int NOT NULL,
  `subtopic_topic_id` int NOT NULL,
  `subtopic_name` varchar(255) NOT NULL,
  `subtopic_detail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `topic_id` int NOT NULL,
  `topic_name` varchar(255) NOT NULL,
  `topic_ev_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`client_id`),
  ADD KEY `client_insitution` (`client_insitution`,`cleint_role`),
  ADD KEY `cleint_role` (`cleint_role`);

--
-- Indexes for table `commect`
--
ALTER TABLE `commect`
  ADD PRIMARY KEY (`cm_id`),
  ADD KEY `cm_ev_id` (`cm_ev_id`,`cm_assessor_id`),
  ADD KEY `cm_assessor_id` (`cm_assessor_id`);

--
-- Indexes for table `evolution`
--
ALTER TABLE `evolution`
  ADD PRIMARY KEY (`ev_id`),
  ADD KEY `ev_client_id` (`ev_client_id`,`ev_as_id`);

--
-- Indexes for table `insitution`
--
ALTER TABLE `insitution`
  ADD PRIMARY KEY (`ins_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `score_ev_id` (`score_ev_id`,`score_assessor_id`,`score_topic_id`,`score_subtopic_id`),
  ADD KEY `score_assessor_id` (`score_assessor_id`),
  ADD KEY `score_subtopic_id` (`score_subtopic_id`),
  ADD KEY `score_topic_id` (`score_topic_id`);

--
-- Indexes for table `subtopic`
--
ALTER TABLE `subtopic`
  ADD PRIMARY KEY (`subtopic_id`),
  ADD KEY `subtopic_topic_id` (`subtopic_topic_id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`topic_id`),
  ADD KEY `topic_ev_id` (`topic_ev_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `client_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commect`
--
ALTER TABLE `commect`
  MODIFY `cm_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evolution`
--
ALTER TABLE `evolution`
  MODIFY `ev_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `insitution`
--
ALTER TABLE `insitution`
  MODIFY `ins_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `score_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subtopic`
--
ALTER TABLE `subtopic`
  MODIFY `subtopic_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
  MODIFY `topic_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`cleint_role`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `client_ibfk_2` FOREIGN KEY (`client_insitution`) REFERENCES `insitution` (`ins_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `commect`
--
ALTER TABLE `commect`
  ADD CONSTRAINT `commect_ibfk_1` FOREIGN KEY (`cm_assessor_id`) REFERENCES `client` (`client_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `commect_ibfk_2` FOREIGN KEY (`cm_ev_id`) REFERENCES `evolution` (`ev_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `evolution`
--
ALTER TABLE `evolution`
  ADD CONSTRAINT `evolution_ibfk_1` FOREIGN KEY (`ev_id`) REFERENCES `topic` (`topic_ev_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `evolution_ibfk_2` FOREIGN KEY (`ev_client_id`) REFERENCES `client` (`client_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_1` FOREIGN KEY (`score_ev_id`) REFERENCES `evolution` (`ev_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `score_ibfk_2` FOREIGN KEY (`score_assessor_id`) REFERENCES `client` (`client_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `score_ibfk_3` FOREIGN KEY (`score_subtopic_id`) REFERENCES `subtopic` (`subtopic_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `score_ibfk_4` FOREIGN KEY (`score_topic_id`) REFERENCES `topic` (`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `topic`
--
ALTER TABLE `topic`
  ADD CONSTRAINT `topic_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `subtopic` (`subtopic_topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
