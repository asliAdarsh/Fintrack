# FinTrack - Premium Personal Finance Manager

FinTrack is a modern, fintech-style personal finance tracking application designed for secure, intuitive, and high-performance wealth management. Built for a technical assessment, it demonstrates a full-stack architecture using Flask, React, and PostgreSQL, focusing on **Simplicity**, **Correctness**, and **Interface Safety**.

## 🚀 Quick Start

### 1. Infrastructure Setup (Docker)
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up -d --build
```
*This initializes a PostgreSQL 15 instance and the application services.*

### 2. Manual Setup (Development)
**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Key Technical Decisions

### 1. Architecture: The "Modular Blueprint" Pattern
- **Decoupled Services**: The backend is built using **Flask Blueprints** to separate concerns (Auth, Transactions, Analytics, etc.), ensuring high **Change Resilience**. 
- **Single Source of Truth**: The PostgreSQL database enforces referential integrity through foreign keys, preventing invalid states (e.g., an expense without a category).

### 2. Interface Safety & Security
- **JWT Authentication**: Uses stateless JSON Web Tokens (stored in `localStorage` for the demo, but architected for `HttpOnly` cookies in production) to secure every API request.
- **Strict Data Types**: The backend enforces balance consistency (Decimal precision) and validation checks on all incoming JSON payloads to prevent misuse.

### 3. Frontend Experience (Aesthetics & Performance)
- **Glassmorphism UI**: Uses Tailwind CSS v4 to achieve a premium "Glassmorphism" look using `backdrop-blur` and custom CSS variables for dynamic themes (Light/Dark).
- **Responsive State Management**: React Context API is used for Global Currency and Authentication states, reducing prop-drilling and improving maintainability.

### 4. Continuous Observability & Production Readiness
- **Docker Orchestration**: The entire stack is containerized, ensuring "Works on my machine" consistency across development and evaluation environments.
- **Lean Production Footprint**: A strict policy was enforced to remove all non-essential developer comments, focusing on **Simplicity** and self-documenting code.

---

## 🛠️ Tech Stack
- **Backend**: Python 3.11, Flask, SQLAlchemy (ORM), JWT.
- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts.
- **Database**: PostgreSQL (Relational), SQLite (Fallback).
- **Infratructure**: Docker, Nginx (Reverse Proxy), Gunicorn.

---

## 📈 Future Extensions
1. **Automated Verification**: Integrated test suite using `pytest` and `Cypress`.
2. **Enhanced Observability**: Integration with Sentry/ELK stack for error tracking.
3. **Advanced Security**: Implementing OAuth2 and CSRF protection headers.

Enjoy tracking your finances with **FinTrack**!
