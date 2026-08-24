# Developer Portfolio — Anne Beth Andersen

Personal developer portfolio presenting practical software development, healthcare technology, research software, APIs, automation and data projects.

**Live portfolio:** https://abla86.github.io/developer-portfolio/

## Profile

I build practical digital solutions across frontend, backend and data. My work combines healthcare-domain knowledge, research methodology, software development, structured workflows and automation.

The portfolio demonstrates progression from web fundamentals to React, Python, C#/.NET, REST APIs, SQL, Docker and secure CI/CD practices.

## Featured projects

### Evidence Appraisal Tool — advanced research prototype v1.0.0

A full-featured research-oriented web application for structured evidence appraisal, research workflow support and evidence traceability. The project is deliberately presented as a **prototype**: the implemented software is substantially more than a UI mock-up, while clinical validation, production security, institutional privacy governance and other formal deployment requirements are not claimed as complete.

- React 19 + Vite frontend
- ASP.NET Core REST API on .NET 9
- AMSTAR 2, CASP, AGREE II and GRADE workflow support
- RoB 2 workflow explicitly marked prototype
- Structured evidence location and researcher rationale
- Researcher-confirmed judgements rather than unsupported automated conclusions
- Bibliography import and duplicate-candidate detection
- PRISMA workflow and export support
- Screening, extraction, reviewer comparison and Cohen's kappa
- Evidence document analysis with candidate/uncertain semantics
- Evidence verification and hash-linked audit history
- Project finalization with SHA-256 integrity marker and lock control
- Defensive API hardening including request-size limits, rate limiting, CORS configuration and security headers
- GitHub Actions CI
- CodeQL and Dependabot
- Public demonstration deployment

**Repository:** https://github.com/abla86/evidence-appraisal-tool

**Live prototype:** https://evidence-appraisal-tool.onrender.com

**Status:** Full-featured advanced research prototype. Not clinically validated, certified or intended for confidential research data in the public deployment.

### Workforce & Competence Management System

Verified full-stack workforce planning and competence management application covering employees, competence, shift planning and staffing coverage.

- React 19 + Vite 7 frontend
- ASP.NET Core Minimal API on .NET 10
- Entity Framework Core 10
- SQL Server 2022 container
- Docker Compose
- Employee and competence management
- Basic / Intermediate / Advanced competence levels
- Competence validity and expiry/review indicators
- Shift planning, assignments and staffing requirements
- Required competence and role checks
- Availability, approved absence, overlap and rest-period checks
- Explainable GREEN / YELLOW / RED operational coverage status
- Candidate ranking and qualified replacement suggestions
- Non-destructive what-if scenario analysis
- Coverage history/audit events
- Authenticated CSV/JSON data exchange and reports
- **18/18 backend tests passed in final local verification**
- EF model/migration validation passed with no pending model changes
- Frontend lint and production build passed
- Docker Compose, SQL Server, API and frontend health checks passed
- GitHub Actions full-stack smoke testing
- CodeQL and Dependabot

**Repository:** https://github.com/abla86/workforce-competence-management

**Live demo:** https://workforce-frontend.onrender.com/

## What is actually used in the Workforce repository

**Programming languages**

- C#
- JavaScript
- PowerShell

**Data and database technologies**

- SQL Server 2022
- Entity Framework Core 10 for database access and migrations
- No standalone `.sql`/T-SQL source files are currently stored in the Workforce repository

**Markup, styling and configuration**

- HTML
- CSS
- YAML
- JSON
- Dockerfile / Docker Compose configuration

**Frameworks and libraries**

- ASP.NET Core
- React
- Vite
- Entity Framework Core
- OpenAPI
- xUnit

**Infrastructure / DevOps / security**

- Docker
- Docker Compose
- GitHub Actions
- CodeQL
- Dependabot

## Selected projects

### Healthcare, research and data

- Evidence Appraisal Tool
- Workforce & Competence Management
- HealthTech Device API
- Healthcare Data Analyzer
- Healthcare Workforce SQL
- Shift & Competence Planner

### Backend and APIs

- FastAPI Learning
- HealthTech Device API
- ASP.NET Core / .NET projects

### Frontend applications

- React Task Dashboard
- To-Do App
- Task Manager
- Dashboard UI

### Development progression

- Advanced JavaScript Counter
- Calculator
- Digital Clock
- JavaScript Counter
- Hello HTML

## Technical stack

### Frontend

HTML5 · CSS3 · JavaScript · React · Vite · Jest

### Backend and data

Python · FastAPI · C# · .NET 10 · ASP.NET Core · Entity Framework Core · REST APIs · OpenAPI · SQL Server · PostgreSQL

### Engineering and DevSecOps

Git · GitHub · GitHub Actions · Docker · Docker Compose · CodeQL · Dependabot · xUnit · pytest · Jest · PowerShell

### Automation and IoT

Home Assistant · MQTT · Zigbee · Raspberry Pi · YAML automation

### AI

AI-assisted software development · Generative AI tooling · Workflow automation · Evaluation-oriented development

## Engineering principles demonstrated

- Build around real professional problems and workflows.
- Keep domain judgement separate from software validation.
- Prefer explicit evidence, rationale and traceability over opaque automation.
- Test functionality and document verification.
- Use CI/CD and security scanning as part of development rather than as an afterthought.
- Keep claims about functionality aligned with what the repositories actually implement.
- Extend existing functionality non-destructively rather than replacing working research workflows.

## Portfolio

Full project portfolio: https://abla86.github.io/developer-portfolio/

## Direction

Building toward full-stack and backend software development, digital health and health-tech product development, with particular interest in APIs, data, evidence, automation, AI and systems that solve real professional problems.

## Author

Anne Beth Andersen
