# 🔐 ZeroTrustX

### Zero-Trust Security Framework for Smart Manufacturing

> **Never Trust. Always Verify.**

ZeroTrustX is a modern **Zero Trust cybersecurity frontend prototype** designed for connected smart-manufacturing environments.

The platform demonstrates how every access request can be evaluated using a combination of:

**Identity + MFA + Device Trust + Role + Resource + Context + Risk → Access Decision**

Instead of assuming that an authenticated user or device is automatically trustworthy, ZeroTrustX applies continuous verification and least-privilege principles before granting access to sensitive manufacturing resources.

---

## 🏭 Why ZeroTrustX?

Smart manufacturing environments increasingly connect:

* Industrial machines
* IoT devices
* Factory workstations
* Employees and operators
* Remote users
* Cloud applications
* Manufacturing databases
* Enterprise systems

This connectivity increases the attack surface.

A compromised account, unauthorized device, excessive privilege, or suspicious access request can potentially expose sensitive manufacturing resources.

Traditional security models often rely on the idea that users inside a trusted network can be trusted.

ZeroTrustX takes a different approach:

> **No user, device, or request is trusted automatically.**

Every access request must satisfy the relevant security policies.

---

# 🎯 Project Objective

The objective of ZeroTrustX is to demonstrate a practical Zero Trust security model for smart manufacturing environments through an interactive security management platform.

The prototype focuses on:

* Identity-based access
* Multi-factor authentication concepts
* Role-Based Access Control
* Device trust
* Least-privilege access
* Risk-based access decisions
* Security monitoring
* Access auditing
* Policy enforcement

---

# ⚡ Core Access Model

ZeroTrustX follows this security flow:

```text
                    ACCESS REQUEST
                          │
                          ▼
                   Identity Check
                          │
                          ▼
                         MFA
                          │
                          ▼
                   Device Verification
                          │
                          ▼
                    Role Validation
                          │
                          ▼
                  Resource Validation
                          │
                          ▼
                   Risk Evaluation
                          │
                          ▼
                   Policy Evaluation
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           ALLOW      STEP-UP       DENY
                      /RESTRICT
```

The core principle is:

### **Never Trust. Always Verify.**

---

# ✨ Key Features

## 👤 Identity Management

Manage users and their security roles through a centralized identity interface.

Supported demonstration roles:

* **Admin**
* **Security Analyst**
* **Engineer**
* **Operator**
* **Viewer**

---

## 🔑 Multi-Factor Authentication

The frontend represents MFA verification as an additional security layer before sensitive resources can be accessed.

The current frontend uses simulated authentication states.

> Real MFA will be integrated with the backend in the next development phase.

---

## 🛡️ Role-Based Access Control

ZeroTrustX uses RBAC concepts to ensure users only receive access appropriate to their responsibilities.

Example:

```text
Operator
    ↓
Machine Monitoring
    ✓ READ

Operator
    ↓
Plant Administration
    ✕ DENIED
```

The platform includes a visual permission matrix showing role-to-resource relationships.

---

## 💻 Device Trust

Devices are registered and assigned trust states.

Supported states:

🟢 **Trusted**

🟡 **Pending**

🔴 **Blocked**

Example:

```text
Factory-WS-01
Type: Workstation
Owner: Aarav Sharma
Trust: Trusted
```

A blocked device cannot satisfy the Zero Trust policy.

---

## 🎯 Risk-Based Access

The prototype contains a frontend risk engine that evaluates access requests using contextual factors.

Example factors include:

* User identity
* MFA status
* User role
* Device trust
* Requested resource
* Resource sensitivity
* Access context

A demonstration risk score is generated between:

**0–100**

---

## 🚦 Dynamic Access Decisions

ZeroTrustX supports three primary decisions:

### 🟢 ALLOW

The request satisfies the configured policy.

### 🟡 STEP-UP / RESTRICT

Additional verification or restrictions may be required.

### 🔴 DENY

The request violates a security rule or exceeds the allowed risk level.

Example:

```text
Trusted Device
      +
Authorized Role
      +
MFA Verified
      +
Low Risk
      ↓
ACCESS GRANTED
```

---

# 🧪 Access Simulator

The **Access Simulator** is the central demonstration feature of the prototype.

It allows a user to configure:

* User
* Device
* Resource
* Action
* Location / Context

and evaluate the request.

Example:

```text
User:
Operator

Device:
Factory-WS-01

Resource:
Machine Monitoring

Action:
READ

Context:
Factory Floor
```

The system evaluates the request and displays:

```text
IDENTITY       ✓ VERIFIED
MFA            ✓ VERIFIED
DEVICE         ✓ TRUSTED
ROLE           ✓ AUTHORIZED
RESOURCE       ✓ PERMITTED

RISK SCORE     18 / 100

DECISION       🟢 ACCESS GRANTED
```

---

# 🎬 Built-In Demo Scenarios

The frontend includes demonstration scenarios designed for hackathon presentations.

## Scenario 1 — Normal Operator

```text
Operator
+
Trusted Factory Workstation
+
Machine Monitoring
+
Valid Context
```

### Result

🟢 **ACCESS GRANTED**

---

## Scenario 2 — Unknown Device

```text
Operator
+
Unknown Device
+
Remote Access
```

### Result

🟡 **STEP-UP / RESTRICT**

---

## Scenario 3 — Blocked Device

```text
Engineer
+
Blocked Device
+
Production Control
```

### Result

🔴 **ACCESS DENIED**

---

## Scenario 4 — Wrong Role

```text
Viewer
+
Plant Administration
```

### Result

🔴 **ACCESS DENIED**

Reason:

> Insufficient role permissions.

---

## Scenario 5 — High-Risk Request

Multiple risk signals are combined.

### Result

🔴 **HIGH-RISK ACCESS DENIED**

The security event is also reflected in the dashboard and audit views.

---

# 📊 Security Dashboard

The dashboard provides an overview of the simulated Zero Trust environment.

### Key Metrics

* Active Users
* Registered Devices
* Access Requests
* Access Granted
* Access Denied
* High-Risk Events

### Visualizations

* Access decisions over time
* Risk distribution
* Allowed vs denied requests
* Security events
* Device trust status

### Recent Activity

The dashboard displays recent access requests with:

```text
User
Device
Resource
Risk
Decision
Timestamp
```

---

# 🚨 Security Monitoring

ZeroTrustX includes frontend views for:

### Risk Monitor

Track:

* Risk levels
* High-risk requests
* Suspicious activity
* Risk trends

### Alerts

Monitor events such as:

* Blocked-device access attempts
* Unusual access contexts
* High-risk requests
* Multiple failed attempts

### Audit Logs

Track security events including:

* Login
* MFA
* Access granted
* Access denied
* Device registration
* Device blocking
* Policy changes
* Role changes

---

# 🏗️ Frontend Architecture

The current version is intentionally **frontend-only**.

```text
                    ZeroTrustX Frontend
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Dashboard    Access Control   Identity
             │             │             │
             ▼             ▼             ▼
         Analytics    Risk Engine     Device Trust
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                     Mock Services
                           │
                           ▼
                     Local State
```

The architecture is designed so that the mock services can later be replaced with real APIs.

---

# 🛠️ Technology Stack

## Frontend

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| React                 | UI framework              |
| TypeScript            | Type safety               |
| Vite                  | Development/build tooling |
| Tailwind CSS          | Styling                   |
| React Router          | Application routing       |
| Lucide React          | Icons                     |
| Recharts              | Analytics and charts      |
| Zustand / Context API | State management          |

---

# 📁 Project Structure

```text
zerotrustx/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── AppShell/
│   │   ├── Sidebar/
│   │   ├── Topbar/
│   │   ├── StatCard/
│   │   ├── DataTable/
│   │   ├── RiskMeter/
│   │   ├── VerificationChain/
│   │   ├── AccessDecisionCard/
│   │   ├── SecurityHealth/
│   │   ├── Drawer/
│   │   └── Modal/
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── AccessRequests/
│   │   ├── AccessSimulator/
│   │   ├── Users/
│   │   ├── Roles/
│   │   ├── Devices/
│   │   ├── RiskMonitor/
│   │   ├── Alerts/
│   │   ├── AuditLogs/
│   │   ├── Policies/
│   │   ├── Resources/
│   │   └── Settings/
│   │
│   ├── data/
│   │   ├── users.ts
│   │   ├── devices.ts
│   │   ├── resources.ts
│   │   ├── policies.ts
│   │   ├── accessRequests.ts
│   │   ├── alerts.ts
│   │   └── auditLogs.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── accessService.ts
│   │   ├── riskEngine.ts
│   │   └── deviceService.ts
│   │
│   ├── hooks/
│   ├── layouts/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 18+
* npm

Check your versions:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/zerotrustx.git
```

Enter the project:

```bash
cd zerotrustx
```

Install dependencies:

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

The application will be available at the local Vite development URL shown in your terminal.

---

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🔐 Demo Environment

The current version uses **frontend mock authentication**.

Example demo account:

```text
Email:
security@zerotrustx.local

Password:
Demo@123
```

> ⚠️ These credentials are for demonstration purposes only and must not be used in production.

---

# 🔌 Planned Backend Integration

The current prototype intentionally separates the UI from the data/service layer.

The next development phase will replace the mock services with:

```text
React + TypeScript
        │
        │ REST API
        ▼
FastAPI Backend
        │
        ▼
PostgreSQL
```

Planned backend modules:

* Authentication
* JWT sessions
* Real MFA
* IAM
* RBAC
* Device management
* Policy engine
* Risk engine
* Access decision engine
* Audit logging
* Alert management

---

# 🧠 Zero Trust Decision Model

The planned system evaluates:

```text
Identity
   +
MFA
   +
Device
   +
Role
   +
Resource
   +
Context
   +
Risk
   +
Policy
   ↓
Access Decision
```

The frontend already demonstrates this decision model through its interactive Access Simulator.

---

# 🔒 Security Philosophy

ZeroTrustX follows several Zero Trust principles:

### 1. Never Trust Automatically

Authentication does not automatically mean authorization.

### 2. Verify Explicitly

Access decisions consider identity, device, role, context, and policy.

### 3. Least Privilege

Users should receive only the permissions necessary for their responsibilities.

### 4. Assume Breach

Security controls should limit the damage caused by compromised accounts or devices.

### 5. Continuous Visibility

Access events should be monitored and auditable.

---

# 🏭 Smart Manufacturing Use Case

ZeroTrustX is designed around connected manufacturing environments.

Example:

```text
                    SMART FACTORY

 ┌──────────┐    ┌───────────┐    ┌────────────┐
 │ Operator │    │ Engineer  │    │   Admin    │
 └────┬─────┘    └─────┬─────┘    └─────┬──────┘
      │                │                │
      └────────────────┼────────────────┘
                       ▼
                 ┌───────────┐
                 │ZeroTrustX │
                 └─────┬─────┘
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
 Machine Systems    IoT Gateway    Production DB
```

Instead of granting broad network access, ZeroTrustX evaluates whether a specific user/device should access a specific resource.

---

# 💡 Innovation

ZeroTrustX does not claim that Zero Trust itself is a new technology.

The innovation lies in applying Zero Trust principles specifically to a connected manufacturing environment through an integrated model combining:

**Identity + Device Trust + RBAC + Risk + Policy + Monitoring**

The platform provides a unified interface for visualizing and demonstrating these controls.

---

# 📈 Future Roadmap

### Phase 1 — Frontend Prototype

**Current**

* Interactive dashboard
* Access simulator
* Mock risk engine
* RBAC visualization
* Device registry
* Policy management
* Alerts
* Audit logs

### Phase 2 — Backend Integration

* FastAPI
* PostgreSQL
* JWT
* Real authentication
* Real RBAC
* Real audit logging

### Phase 3 — Advanced Security

* TOTP-based MFA
* Device posture verification
* Policy-as-code
* Behavioral analytics
* SIEM integration

### Phase 4 — Industrial Integration

* Industrial IoT integration
* Multi-site factories
* Cloud workloads
* Network segmentation
* Automated incident response

---

# ⚠️ Current Limitations

This repository currently contains a **frontend prototype**.

Therefore:

* Authentication is simulated.
* MFA is represented through frontend states.
* Risk evaluation is demonstration logic.
* Data is mock/local data.
* No real industrial equipment is connected.
* No production security infrastructure is deployed.
* The current system should not be treated as a production cybersecurity solution.

These limitations are intentional for the prototype stage.

---

# 🧪 Demo Flow

For a hackathon demonstration:

### 1. Login

Enter the demo account.

### 2. Open Dashboard

Show:

* Users
* Devices
* Access requests
* Risk events

### 3. Open Access Simulator

Select:

```text
Operator
+
Trusted Device
+
Machine Monitoring
```

Click:

**Evaluate Access**

Show:

🟢 **ACCESS GRANTED**

### 4. Change Device

Select:

**Unknown Device**

Evaluate again.

Show:

🟡 **STEP-UP / RESTRICT**

### 5. Select Blocked Device

Evaluate.

Show:

🔴 **ACCESS DENIED**

### 6. Test Wrong Role

Select:

**Viewer → Plant Administration**

Show:

🔴 **ACCESS DENIED**

### 7. Open Audit Logs

Demonstrate that access events are recorded.

---

# 🎥 Hackathon Pitch

### The Problem

Smart factories are becoming increasingly connected, but connectivity creates a larger attack surface.

### The Gap

Traditional network trust does not adequately answer:

> **Who should access what, from which device, under what conditions?**

### The Solution

ZeroTrustX evaluates every access request using:

**Identity + MFA + Device + Role + Context + Risk + Policy**

### The Result

Instead of:

> **“You're inside the network, so you're trusted.”**

ZeroTrustX asks:

> **“Should this specific request be trusted right now?”**

---

# 👥 Team

**Team ZeroTrustX**

| Member    | Responsibility              |
| --------- | --------------------------- |
| Team Lead | Architecture & Coordination |
| Member 2  | Frontend Development        |
| Member 3  | Backend & Security          |
| Member 4  | Database & Risk Engine      |

Replace the placeholders with the actual team members before submission.

---

# 📜 License

This project is intended as a hackathon prototype and educational cybersecurity project.

Add the appropriate open-source license before public production use.

---

# ⚠️ Disclaimer

ZeroTrustX is a prototype intended for **educational, demonstration, and hackathon purposes**.

It is not a replacement for a professionally audited enterprise Zero Trust implementation.

Security decisions, risk thresholds, and demonstration policies used in the prototype are illustrative and should not be treated as production security standards.

---

# 🌐 Project Vision

ZeroTrustX aims to demonstrate how Zero Trust principles can help secure increasingly connected manufacturing environments.

The long-term vision is a security layer where:

```text
Every User
     +
Every Device
     +
Every Request
     +
Every Resource
     ↓
Continuously Verified
```

### 🔐 ZeroTrustX

## **Never Trust. Always Verify.**
