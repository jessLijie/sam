# SAM (Sistem Ambilan Mahasiswa)
Student Admission System With Automated Filtering Feature

## Commands

```bash
dotnet ef migrations add <NAME>
```

```bash
dotnet ef database update
```

```bash
netstat -a -n -o | findstr :3306 
```

```bash
taskkill /PID 6276 /F
```

```bash
win+r services.msc find MYSQL80 start workbench
```


## SQL Installation

Courses, Entry Requirements, Subjects

```bash
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

```
    
## Packages
```bash
dotnet add package UglyToad.PdfPig --prerelease❌ 
dotnet add package itext7 🤩
dotnet add package Tesseract
dotnet add package PdfiumViewer
dotnet add package PdfiumViewer.Native.x86_64.v8-xfa
dotnet add package System.Drawing.Common
dotnet add package Emgu.CV
dotnet add package Emgu.CV.Bitmap
dotnet add package Emgu.CV.runtime.windows
dotnet add package Emgu.CV.Extensions
dotnet add package F23.StringSimilarity
dotnet add package FuzzySharp
npm install jspdf html2canvas
npm install xlsx file-saver
dotnet add package MailKit
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

```


## Assumptions

`fc`: UT6481001(SE), UT6481002(DE), UT6481003(Bio), UT6481004(Network), UT6481005(Graphics)

`fkm`: UT6521001(pure), UT6521003(manufac), UT6521004(industry), UT6525001(aero), UT6525002(auto), UT6525003(offshore)

`fke`: UT6522002(electrical), UT6523001(electronic), UT6523002(mecha), UT6523003(bio)

### My Note

Entry Requirement: 
Created database for 4 different graduate types: Diploma, STPM, Foundation and SPM

Equivalent can be separated by "/"

Student's result:
when upload pdf, extract the information from the file and store into database
- foundation
- spm
- stpm
- diploma

CREATE TABLE sam.XXX_result (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  `faculty` varchar(45) NOT NULL,
  `program_code` varchar(45) DEFAULT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `grade` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

Limitation:
Only applicable to applicants with spm, stpm, foundation or diploma results [other qualifications shall be ignored] 
Focus is on the filter process**

!!!!BANNED SOLUTION !!!
i need to create few more new tables for my system: applications, spm_results, stpm_results, matriculation_result, foundation_result
applications [id, name, ic_number, spm, pre_u_type, pre_u]
spm_results [id, application_id, bm, bi]
stpm_results []
matriculation_results []
foudation_results []
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NONONONONO!!!!!!!!!!!!!!!!!!!!!!!!!!!


