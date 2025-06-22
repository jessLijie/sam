-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2025 at 05:27 PM
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
-- Database: `sam`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `Id` int(11) NOT NULL,
  `Name` longtext NOT NULL,
  `IcNumber` longtext NOT NULL,
  `Address` longtext DEFAULT NULL,
  `Gender` longtext DEFAULT NULL,
  `ApplicationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`Id`, `Name`, `IcNumber`, `Address`, `Gender`, `ApplicationId`) VALUES
(1, 'Wong Li Jie', '021105100968', 'abc@gmail.com', 'Female', 1),
(6, 'Test1', '021106102259', 'abc@gmail.com', 'Female', 6),
(7, 'Test3', '11111', 'abc@gmail.com', 'Female', 7),
(8, 'Test4', '12121212', 'abc@gmail.com', 'Male', 8),
(9, 'Test6', '11111', 'abc@gmail.com', 'Male', 9),
(11, 'XinLin', '020127888888', 'fdf@gmail.com', 'Female', 11),
(12, 'XinLin2', '020127888888', 'fdf@gmail.com', 'Female', 12),
(13, 'XinLin3', '020127888888', 'fdf@gmail.com', 'Female', 13);

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `Id` int(11) NOT NULL,
  `Name` longtext NOT NULL,
  `SpmResult` longtext DEFAULT NULL,
  `PreUResult` longtext DEFAULT NULL,
  `PreUType` longtext NOT NULL,
  `AppliedProgram` longtext DEFAULT NULL,
  `Remark` longtext DEFAULT NULL,
  `ApplicationStatus` longtext DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `RemarkUpdatedAt` datetime(6) DEFAULT NULL,
  `RemarkUpdatedBy` longtext DEFAULT NULL,
  `OperationUpdatedAt` datetime(6) DEFAULT NULL,
  `OperationUpdatedBy` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`Id`, `Name`, `SpmResult`, `PreUResult`, `PreUType`, `AppliedProgram`, `Remark`, `ApplicationStatus`, `CreatedAt`, `RemarkUpdatedAt`, `RemarkUpdatedBy`, `OperationUpdatedAt`, `OperationUpdatedBy`) VALUES
(1, 'Wong Li Jie', '{\n  \"Bahasa Melayu\": \"A\",\n  \"Bahasa Cina\": \"A\",\n  \"Bahasa Inggeris\": \"A\",\n  \"Sejarah\": \"A+\",\n  \"Mathematics\":\"A-\",\n  \"Additional Mathematics\":\"B\"\n}', '{\"Physics\":\"B\",\"Chemistry\":\"A\",\"Biology\":\"A+\"}', 'Foundation', 'UT6481001', 'f', 'approved', '2025-06-04 15:14:27', '2025-06-22 22:22:11.368593', 'admin', '2025-06-22 22:21:15.017949', 'admin'),
(6, 'Test1', '{\"Bahasa Melayu\":\"A-\",\"Bahasa Inggeris\":\"A\",\"Pendidikan Moral\":\"A-\",\"Sejarah\":\"A+\",\"Mathematics\":\"A+\",\"Additional Mathematics\":\"A\",\"Physics\":\"A-\",\"Chemistry\":\"A-\",\"Biology\":\"A\",\"Bahasa Cina\":\"A-\"}', '{\"Pengajian Am\":\"A\",\"Mathematics (T)\":\"B\",\"Physics\":\"A\",\"Chemistry\":\"A\"}', 'STPM', 'UT6481005', '', 'approved', '2025-06-04 15:14:27', NULL, NULL, NULL, NULL),
(7, 'Test3', '{\"Bahasa Inggeris\":\"A+\"}', '{\"MUET\":\"B\"}', 'STPM', 'UT6521004', NULL, 'pending', '2025-06-04 15:14:27', NULL, NULL, NULL, NULL),
(8, 'Test4', '{\"Bahasa Inggeris\":\"A\",\"Mathematics\":\"A\",\"Biology\":\"A\",\"Bahasa Cina\":\"A\"}', '{\"MUET\":\"A\"}', 'Diploma', 'UTM1234', NULL, 'pending', '2025-06-04 15:14:27', NULL, NULL, NULL, NULL),
(9, 'Test6', '{\"Bahasa Melayu\":\"A\",\"Bahasa Inggeris\":\"A\",\"Bahasa Cina\":\"A+\",\"Mathematics\":\"A\",\"Additional Mathematics\":\"A\"}', '{\"Physics\":\"B\",\"Biology\":\"A\"}', 'Matriculation', 'UT6481001', 'a', 'rejected', '2025-06-04 15:14:27', '2025-06-22 22:22:04.685545', 'admin', '2025-06-22 22:21:00.680992', 'admin'),
(11, 'XinLin', '{\"Pendidikan Moral\":\"A\"}', '{\"MUET\":\"5.0\"}', 'Matriculation', 'UTM1234', NULL, 'pending', '2025-06-04 15:14:27', NULL, NULL, NULL, NULL),
(12, 'XinLin2', '{\"Pendidikan Moral\":\"A\"}', '{\"Pengajian Am\":\"A\"}', 'STPM', 'UT6481004', NULL, 'not eligible', '2025-06-05 07:31:31', NULL, NULL, NULL, NULL),
(13, 'XinLin3', '{\"Pendidikan Moral\":\"A\"}', '{\"Physics\":\"A\"}', 'Foundation', 'UT6525003', NULL, 'pending', '2025-06-04 15:33:26', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `Id` int(11) NOT NULL,
  `Faculty` longtext NOT NULL,
  `CourseCode` longtext NOT NULL,
  `CourseName` longtext NOT NULL,
  `FacultyCode` longtext NOT NULL,
  `Quota` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`Id`, `Faculty`, `CourseCode`, `CourseName`, `FacultyCode`, `Quota`) VALUES
(1, 'Faculty of Computing', 'UT6481001', 'Software Engineering', 'fc', 2),
(2, 'Faculty of Computing', 'UT6481002', 'Data Engineering', 'fc', 3),
(3, 'Faculty of Computing', 'UT6481003', 'Bioinformatics', 'fc', 2),
(4, 'Faculty of Computing', 'UT6481004', 'Computer Networks & Security', 'fc', 2),
(5, 'Faculty of Computing', 'UT6481005', 'Graphics & Multimedia Software', 'fc', 10),
(6, 'Faculty of Mechanical Engineering', 'UT6521001', 'Pure Mechanical Engineering', 'fkm', 5),
(7, 'Faculty of Mechanical Engineering', 'UT6521003', 'Manufacturing Engineering', 'fkm', 5),
(8, 'Faculty of Mechanical Engineering', 'UT6521004', 'Industrial Engineering', 'fkm', 5),
(9, 'Faculty of Mechanical Engineering', 'UT6525001', 'Aerospace Engineering', 'fkm', 5),
(10, 'Faculty of Mechanical Engineering', 'UT6525002', 'Automotive Engineering', 'fkm', 5),
(11, 'Faculty of Mechanical Engineering', 'UT6525003', 'Offshore Engineering', 'fkm', 5),
(12, 'Faculty of Engineering', 'UT6522002', 'Electrical Engineering', 'fke', 5),
(13, 'Faculty of Engineering', 'UT6523001', 'Electronic Engineering', 'fke', 5),
(14, 'Faculty of Engineering', 'UT6523002', 'Mechatronics Engineering', 'fke', 7),
(15, 'Faculty of Engineering', 'UT6523003', 'Biomedical Engineering', 'fke', 5),
(16, 'Faculty of Built Environment and Surveying', 'UTM1234', 'Quantity Surveying', 'fabu', 2);

-- --------------------------------------------------------

--
-- Table structure for table `entryrequirements`
--

CREATE TABLE `entryrequirements` (
  `Id` int(11) NOT NULL,
  `Graduate_type` longtext NOT NULL,
  `Requirement_type` longtext NOT NULL,
  `Subject` longtext NOT NULL,
  `Grade` longtext NOT NULL,
  `Faculty` longtext DEFAULT NULL,
  `Program_code` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `entryrequirements`
--

INSERT INTO `entryrequirements` (`Id`, `Graduate_type`, `Requirement_type`, `Subject`, `Grade`, `Faculty`, `Program_code`) VALUES
(1, 'SPM', 'general', 'Bahasa Melayu', 'C', NULL, NULL),
(2, 'SPM', 'general', 'Bahasa Inggeris', 'C', NULL, NULL),
(3, 'STPM', 'general', 'Pengajian Am', '3.00', NULL, NULL),
(9, 'SPM', 'special', 'Mathematics', 'B', 'fc', 'UT6481001'),
(10, 'SPM', 'special', 'Additional Mathematics', 'B', 'fc', 'UT6481001'),
(12, 'STPM', 'special', 'Mathematics (T)', 'B-', 'fkm', 'UT6521001'),
(13, 'STPM', 'special', 'Physics', 'B-', 'fkm', 'UT6521001'),
(15, 'Foundation', 'general', 'Chemistry', '4.0', NULL, NULL),
(16, 'STPM', 'special', 'Mathematics (T)', '3.00', 'fc', 'UT6481005'),
(18, 'Matriculation', 'special', 'Biology', '3.00', 'fc', 'UT6481001'),
(19, 'SPM', 'general', 'Additional Mathematics', 'B', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `Id` int(11) NOT NULL,
  `Category` longtext NOT NULL,
  `SubjectName` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`Id`, `Category`, `SubjectName`) VALUES
(1, 'SPM', 'Bahasa Melayu'),
(2, 'STPM', 'Pengajian Am'),
(3, 'Matriculation', 'Biology'),
(5, 'SPM', 'Bahasa Inggeris'),
(6, 'Foundation', 'English'),
(7, 'SPM', 'Mathematics'),
(8, 'SPM', 'Additional Mathematics'),
(9, 'STPM', 'Mathematics (T)'),
(10, 'STPM', 'Physics');

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20250104162644_programEntryReq', '8.0.8'),
('20250309182214_AAA', '8.0.8'),
('20250310055105_updateApplicationModal', '8.0.8'),
('20250325105536_manageCourse', '8.0.8'),
('20250325105905_manageSubject', '8.0.8'),
('20250325141821_editCourse', '8.0.8'),
('20250408132843_choices', '8.0.8'),
('20250424155517_quota', '8.0.8'),
('20250620115013_AddRemark', '8.0.8'),
('20250622131809_AddStatusAndSubmittedAtToApplication', '8.0.8'),
('20250622132352_logRecord', '8.0.8'),
('20250622152053_dbInit', '8.0.8');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Applicants_ApplicationId` (`ApplicationId`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `entryrequirements`
--
ALTER TABLE `entryrequirements`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `entryrequirements`
--
ALTER TABLE `entryrequirements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `FK_Applicants_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `applications` (`Id`) ON DELETE CASCADE;
COMMIT;

INSERT INTO `sam`.`courses` (id, CourseCode, Faculty, FacultyCode, CourseName)
VALUES
-- Faculty of Computing
(1, 'UT6481001', 'Faculty of Computing', 'fc', 'Software Engineering'),
(2, 'UT6481002', 'Faculty of Computing', 'fc', 'Data Engineering'),
(3, 'UT6481003', 'Faculty of Computing', 'fc', 'Bioinformatics'),
(4, 'UT6481004', 'Faculty of Computing', 'fc', 'Networking'),
(5, 'UT6481005', 'Faculty of Computing', 'fc', 'Computer Graphics'),

-- Faculty of Mechanical Engineering
(6, 'UT6521001', 'Faculty of Mechanical Engineering', 'fkm', 'Pure Mechanical Engineering'),
(7, 'UT6521003', 'Faculty of Mechanical Engineering', 'fkm', 'Manufacturing Engineering'),
(8, 'UT6521004', 'Faculty of Mechanical Engineering', 'fkm', 'Industrial Engineering'),
(9, 'UT6525001', 'Faculty of Mechanical Engineering', 'fkm', 'Aerospace Engineering'),
(10, 'UT6525002', 'Faculty of Mechanical Engineering', 'fkm', 'Automotive Engineering'),
(11, 'UT6525003', 'Faculty of Mechanical Engineering', 'fkm', 'Offshore Engineering'),

-- Faculty of Engineering
(12, 'UT6522002', 'Faculty of Engineering', 'fke', 'Electrical Engineering'),
(13, 'UT6523001', 'Faculty of Engineering', 'fke', 'Electronic Engineering'),
(14, 'UT6523002', 'Faculty of Engineering', 'fke', 'Mechanical Engineering'),
(15, 'UT6523003', 'Faculty of Engineering', 'fke', 'Biomedical Engineering');

INSERT INTO `sam`.`entryrequirements`
(`Id`, `Graduate_type`, `Requirement_type`, `Subject`, `Grade`, `Faculty`, `Program_code`)
VALUES
(1, 'SPM', 'general', 'Malay', 'C', NULL, NULL),
(2, 'SPM', 'general', 'English', 'C', NULL, NULL),
(3, 'STPM', 'general', 'Pengajian Am', 'B', NULL, NULL),
(4, 'STPM', 'general', 'MUET', '5.0', NULL, NULL),
(5, 'Matriculation', 'general', 'PNGK', '1.0', NULL, NULL),
(6, 'Diploma', 'general', 'PNGK', '2.00', NULL, NULL),
(7, 'Diploma', 'general', 'Malay', '3.65', NULL, NULL),
(8, 'STPM', 'special', 'Additional Mathematics', 'B-', 'fc', 'UT6481001'),
(9, 'SPM', 'special', 'Mathematics', 'C', 'fc', 'UT6481001'),
(10, 'SPM', 'special', 'Additional Mathematics', 'C', 'fc', 'UT6481001'),
(11, 'STPM', 'special', 'PNGK', '3.67', 'fkm', 'UT6521001'),
(12, 'STPM', 'special', 'Additional Mathematics', 'B-', 'fkm', 'UT6521001'),
(13, 'STPM', 'special', 'Physics/Chemistry', 'B-', 'fkm', 'UT6521001');

INSERT INTO `sam`.`subjects`
(`Category`, `SubjectName`)
VALUES
('SPM','Bahasa Melayu'),
('STPM','Pengajian Am'),
('Matriculation','Biology'),
('Diploma','MUET')

    



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
