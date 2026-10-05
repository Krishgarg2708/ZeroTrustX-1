# 🔐 ZeroTrustX

### Zero Trust Network Access Framework

**ZeroTrustX** is a modern cybersecurity framework built around the **Zero Trust security model**, designed to secure access to applications, APIs, and resources by continuously verifying **identity, device, permissions, and access context**.

> **"Never Trust. Always Verify."**

Unlike traditional security systems that often trust users after a successful login, ZeroTrustX follows a **continuous verification and least-privilege approach**. Every access request is evaluated before access is granted.

---

## 🚨 Problem Statement

Traditional network security commonly follows a perimeter-based model:

```text
User → Login → Authentication → Trusted Network → Access
```

The problem is that authentication alone does not guarantee that a request is safe.

An attacker may:

- Steal valid user credentials
- Compromise an employee account
- Use an unknown or malicious device
- Attempt privilege escalation
- Access resources they don't actually need
- Exploit excessive permissions
- Move laterally inside a trusted network

Once an attacker gets inside a traditional trusted environment, the damage can spread quickly.

### ZeroTrustX solves this by changing the security model:

```text
Every Request
     ↓
Verify Identity
     ↓
Verify Device
     ↓
Check MFA
     ↓
Check Role & Permissions
     ↓
Evaluate Context
     ↓
Apply Security Policy
     ↓
ALLOW / DENY / CHALLENGE
```

---

# 🎯 Project Objective

The primary objective of ZeroTrustX is to create a centralized **Zero Trust Network Access (ZTNA)** framework that provides:

- 🔑 Strong identity verification
- 🛡️ Multi-Factor Authentication
- 👤 Role-Based Access Control
- 📋 Policy-Based Authorization
- 🔍 Device verification
- ⚡ Continuous access evaluation
- 🚫 Least-privilege access
- 📊 Security monitoring and audit logging
- 🚨 Suspicious-access detection
- 🔐 Secure API and resource access

---

# 🧠 Core Concept

ZeroTrustX is based on the principle:

> **No user, device, application, or network is trusted by default.**

Every access request is treated as potentially untrusted.

The system evaluates multiple security signals before making an authorization decision.

### Access Decision

```text
                    Access Request
                          │
                          ▼
                  ┌───────────────┐
                  │ Identity      │
                  │ Verification  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ MFA           │
                  │ Verification  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Device        │
                  │ Verification  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ RBAC          │
                  │ Authorization │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Policy        │
                  │ Evaluation    │
                  └───────┬───────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ Security Decision   │
                ├─────────────────────┤
                │ ✅ ALLOW            │
                │ ❌ DENY             │
                │ ⚠️ CHALLENGE        │
                └─────────────────────┘
```

---

# ✨ Key Features

## 🔑 1. Identity & Access Management

ZeroTrustX provides centralized identity management for users and administrators.

### Capabilities

- User registration
- Secure login
- Password hashing
- JWT-based authentication
- Session/token management
- User identity verification
- Account management

---

## 🔐 2. Multi-Factor Authentication

Password-based authentication alone is not sufficient.

ZeroTrustX introduces an additional authentication layer.

```text
Password
   +
OTP / MFA
   ↓
Verified Identity
```

This protects accounts even when passwords are compromised.

---

## 👥 3. Role-Based Access Control

ZeroTrustX implements **RBAC** to ensure users only access resources required for their role.

Example:

| Role | Permissions |
|------|-------------|
| Admin | Full system access |
| Security Analyst | Security monitoring |
| Manager | Department resources |
| Employee | Assigned resources |
| Guest | Limited resources |

Example:

```text
Admin
 ├── Users
 ├── Policies
 ├── Logs
 └── Resources

Employee
 ├── Assigned Resources
 └── Personal Profile

Guest
 └── Public Resources
```

---

# 📋 4. Policy-Based Access Control

Access decisions are not based only on username and password.

Policies can consider:

- User identity
- Role
- Device
- IP address
- Location
- Resource
- Request type
- Authentication status
- Risk level
- Time/context

Example policy:

```text
IF
    user.role == "employee"
AND
    device.status == "trusted"
AND
    MFA == "verified"
AND
    resource == "employee-dashboard"

THEN
    ALLOW
```

Otherwise:

```text
DENY ACCESS
```

---

# 💻 5. Device Trust Verification

A legitimate user may still be using a compromised device.

ZeroTrustX therefore considers device trust as part of the authorization process.

Example device states:

```text
Trusted
    ↓
Access Allowed

Unknown
    ↓
Additional Verification

Compromised
    ↓
Access Denied
```

---

# 🛡️ 6. Least Privilege

Users receive only the permissions they actually require.

Instead of:

```text
Employee → Access Everything
```

ZeroTrustX follows:

```text
Employee
   ↓
Required Role
   ↓
Required Permission
   ↓
Required Resource
```

This reduces the impact of compromised accounts.

---

# 🔍 7. Continuous Verification

ZeroTrustX does not consider authentication as a permanent trust decision.

Access can be reevaluated when security conditions change.

For example:

```text
Normal Login
     ↓
Access Granted
     ↓
Unusual Device Detected
     ↓
Risk Increased
     ↓
Re-authentication / MFA
     ↓
Access Restricted
```

---

# 🚨 8. Risk-Based Access

ZeroTrustX can assign a risk score to an access request.

Example:

```text
Identity        → Verified
Device          → Unknown
Location        → Unusual
Behavior        → Suspicious
MFA             → Verified
────────────────────────────
Risk Score      → HIGH
```

Possible decisions:

```text
LOW RISK
   → ALLOW

MEDIUM RISK
   → MFA / CHALLENGE

HIGH RISK
   → DENY
```

---

# 📊 9. Security Monitoring & Audit Logs

Every important security event can be recorded.

Example:

```text
[19:42:10] LOGIN_SUCCESS
[19:43:02] RESOURCE_ACCESS
[19:44:18] MFA_VERIFIED
[19:48:51] POLICY_DENIED
[19:49:03] SUSPICIOUS_REQUEST
```

Audit logs help security administrators investigate:

- Failed logins
- Unauthorized access
- Policy violations
- Suspicious devices
- Privilege escalation attempts
- Unusual access patterns

---

# 🏗️ System Architecture

```text
                    ┌────────────────────┐
                    │      CLIENT        │
                    │ Web / Application  │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    API GATEWAY     │
                    └─────────┬──────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │     AUTHENTICATION       │
                 │     & IAM SERVICE        │
                 └────────────┬─────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
             ┌─────────────┐     ┌─────────────┐
             │     MFA     │     │    RBAC     │
             └──────┬──────┘     └──────┬──────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                  ┌───────────────────────┐
                  │   POLICY ENGINE       │
                  │                       │
                  │ Identity              │
                  │ Device                │
                  │ Context               │
                  │ Risk                  │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ ACCESS DECISION       │
                  │                       │
                  │ ALLOW / DENY / MFA    │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ PROTECTED RESOURCES   │
                  └───────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ AUDIT & SECURITY LOGS │
                  └───────────────────────┘
```

---

# 🧩 Technology Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- REST APIs
- JWT Authentication

### Security

- Zero Trust Architecture
- IAM
- RBAC
- MFA
- Least Privilege
- Policy-Based Access Control
- Device Trust
- Risk-Based Authorization

### Database

- PostgreSQL / MySQL
- SQLAlchemy

### Development Tools

- Git
- GitHub
- VS Code
- Postman
- Docker

---

# 📁 Project Structure

```text
ZeroTrustX/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── security/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── security/
│
├── tests/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/ZeroTrustX.git
cd ZeroTrustX
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

MFA_ENABLED=true
```

> ⚠️ Never commit `.env` files or production secrets to GitHub.

---

## 4. Start Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔌 API Overview

Example API endpoints:

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-mfa
POST /api/auth/refresh
POST /api/auth/logout
```

### Users

```http
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### Roles & Permissions

```http
GET  /api/roles
POST /api/roles
GET  /api/permissions
POST /api/permissions
```

### Policies

```http
GET  /api/policies
POST /api/policies
PUT  /api/policies/{id}
DELETE /api/policies/{id}
```

### Access Control

```http
POST /api/access/evaluate
GET  /api/access/history
```

### Security Logs

```http
GET /api/logs
GET /api/logs/security
GET /api/logs/failed
```

---

# 🔐 Example Access Evaluation

### Request

```json
{
  "user_id": 102,
  "resource": "admin-dashboard",
  "device_id": "DEV-8932",
  "ip_address": "192.168.1.20",
  "mfa_verified": true
}
```

### Response

```json
{
  "decision": "DENY",
  "risk_score": 82,
  "reason": "Insufficient role privileges"
}
```

Another request:

```json
{
  "decision": "ALLOW",
  "risk_score": 18,
  "reason": "Identity, device and policy verified"
}
```

---

# 🧪 Security Scenarios

ZeroTrustX can demonstrate several real-world scenarios.

### Scenario 1 — Valid User

```text
Valid Credentials
       ↓
MFA Verified
       ↓
Trusted Device
       ↓
Correct Role
       ↓
Policy Matched
       ↓
✅ ACCESS GRANTED
```

### Scenario 2 — Stolen Credentials

```text
Valid Credentials
       ↓
Unknown Device
       ↓
Suspicious Context
       ↓
Risk Increased
       ↓
⚠️ Additional Verification
```

### Scenario 3 — Unauthorized Resource

```text
Valid User
     ↓
Correct Authentication
     ↓
Incorrect Role
     ↓
❌ ACCESS DENIED
```

### Scenario 4 — High-Risk Request

```text
Valid Identity
      ↓
Unknown Device
      ↓
Unusual Location
      ↓
Suspicious Behaviour
      ↓
High Risk Score
      ↓
🚫 ACCESS BLOCKED
```

---

# 🎯 ZeroTrustX vs Traditional Security

| Traditional Security | ZeroTrustX |
|---|---|
| Trust after login | Verify every request |
| Perimeter-focused | Identity-focused |
| Static permissions | Dynamic authorization |
| Password-centric | MFA + identity |
| Broad access | Least privilege |
| Implicit trust | Explicit verification |
| Limited monitoring | Continuous monitoring |
| Network-based trust | Context-based trust |

---

# 🌍 Real-World Applications

ZeroTrustX can be applied to:

- 🏥 Healthcare systems
- 🏦 Banking and financial systems
- 🏢 Enterprise networks
- ☁️ Cloud applications
- 🎓 Educational institutions
- 🏛️ Government systems
- 🔐 SaaS platforms
- 🖥️ Internal corporate applications
- 🔌 API ecosystems

---

# 🚀 Future Enhancements

ZeroTrustX can be extended with more advanced capabilities:

### 🤖 AI-Based Risk Detection

Use machine learning to identify abnormal user behaviour.

```text
User Behaviour
      ↓
ML Model
      ↓
Anomaly Detection
      ↓
Risk Score
      ↓
Access Decision
```

### 🔗 Micro-Segmentation

Restrict communication between different services and network segments.

### ☁️ Cloud Integration

Support environments such as:

- AWS
- Microsoft Azure
- Google Cloud

### 🧬 Behavioral Biometrics

Analyze:

- Login patterns
- Typing behavior
- Access frequency
- Device patterns

### 🔑 Passwordless Authentication

Support:

- Passkeys
- WebAuthn
- Security keys

### 📱 Device Posture Checks

Evaluate:

- OS version
- Security patches
- Antivirus status
- Encryption
- Device compliance

---

# 📈 Security Benefits

ZeroTrustX aims to reduce:

- Unauthorized access
- Credential-based attacks
- Privilege abuse
- Lateral movement
- Excessive permissions
- Insider-risk exposure

And improve:

- Identity security
- Access visibility
- Policy enforcement
- Auditability
- Incident detection

---

# 🧑‍💻 Team

### Team AgentX

| Member | Role |
|---|---|
| **Krish Garg** | Team Leader / Developer |
| **Sonam** | Technical Lead |

---

# 🏆 Project

**Project:** ZeroTrustX  
**Category:** Cybersecurity  
**Domain:** Zero Trust Security  
**Focus:** IAM · MFA · RBAC · ZTNA · Access Control

---

# 📜 Security Philosophy

ZeroTrustX follows a simple security philosophy:

```text
┌─────────────────────────────────────┐
│          ZERO TRUST MODEL           │
├─────────────────────────────────────┤
│                                     │
│       NEVER TRUST                   │
│             ↓                       │
│       ALWAYS VERIFY                │
│             ↓                       │
│       LEAST PRIVILEGE              │
│             ↓                       │
│       CONTINUOUSLY MONITOR         │
│             ↓                       │
│       ADAPTIVE ACCESS              │
│                                     │
└─────────────────────────────────────┘
```

---

# ⚠️ Disclaimer

ZeroTrustX is an educational and prototype cybersecurity project designed to demonstrate Zero Trust security principles.

It should undergo professional security auditing, penetration testing, threat modeling, and compliance validation before being deployed in a production environment.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# ⭐ Support

If you find **ZeroTrustX** useful:

⭐ Star the repository  
🍴 Fork the project  
🐛 Report issues  
💡 Suggest improvements  
🤝 Contribute to the project

---

## 🔐 ZeroTrustX

**Don't trust the network. Verify the request.**

> **Never Trust. Always Verify.**
