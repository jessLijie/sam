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


