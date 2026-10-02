export interface CopilotResponseResult {
  text: string;
  modelUsed: string;
  sources?: { title: string; url: string }[];
  webSearchQueries?: string[];
  isSimulated?: boolean;
}

export function generateSimulatedCopilotResponse(
  query: string,
  role: 'soc_analyst' | 'architecture_advisor' | 'incident_responder',
  enableSearch: boolean
): CopilotResponseResult {
  const lower = query.toLowerCase();

  // 1. CVE / Vulnerabilities query
  if (lower.includes('cve') || lower.includes('vpn') || lower.includes('zero-day') || lower.includes('vulnerability')) {
    return {
      text: `### 🛡️ Threat Intelligence Report: Enterprise VPN & ZTNA Vulnerability Analysis

**Current Security Advisory Context:**
Legacy SSL-VPN concentrators and perimeter appliances remain prime targets for state-sponsored and ransomware initial access vectors. Recent high-severity disclosures underscore the urgency of transitioning to **Identity-Aware Zero Trust Network Access (ZTNA)**.

#### Critical Vulnerability Disclosures:
1. **CVE-2024-21887 & CVE-2024-3400 (Perimeter Command Injections)**
   - *Impact*: Pre-authentication remote code execution (RCE) on perimeter edge firewalls.
   - *Attack Chain*: Threat actors leverage path traversal and unauthenticated webhook endpoints to drop web shells and exfiltrate cryptographic session secrets.
   - *ZeroTrustX Mitigation*: ZeroTrustX eliminates edge port exposure using outbound-only mTLS micro-tunnels (Software-Defined Perimeter). Attackers scanning external IPs find all inbound ports closed (Dark Cloud architecture).

2. **CVE-2023-46805 (Authentication Bypass via Web Interface)**
   - *Impact*: Bypass of 2FA/MFA on legacy portal authentication handlers.
   - *ZeroTrustX Mitigation*: Identity validation occurs before TCP connection establishment via FIDO2/WebAuthn hardware tokens, neutralizing web portal session hijacking.

#### Recommended SOC Playbook:
- **Phase 1: Immediate Quarantine**: Execute an endpoint compliance scan across all remote workers. Enforce CrowdStrike Falcon sensor v7.14+.
- **Phase 2: Transition from Subnet VPN to Application Microsegmentation**: Disallow broad network CIDR access. Route connections solely through ZeroTrustX ephemeral WireGuard tunnels.
- **Phase 3: Continuous Revocation**: Enable adaptive velocity checking (Impossible Travel) to auto-drop hijacked session cookies.`,
      modelUsed: 'gemini-3.5-flash (SOC Autonomous Defense)',
      sources: [
        { title: 'CISA Alert: Mitigating Vulnerabilities in Edge Appliances', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' },
        { title: 'NIST NVD: CVE-2024-3400 Detail & CVSS 10.0 Analysis', url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3400' },
        { title: 'Zero Trust Architecture Guidance (NIST SP 800-207)', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final' },
      ],
      webSearchQueries: ['latest 2026 enterprise VPN CVE disclosures', 'CISA edge appliance zero trust guidance'],
      isSimulated: true,
    };
  }

  // 2. JIT / Kubernetes / Privileged access query
  if (lower.includes('jit') || lower.includes('kubernetes') || lower.includes('k8s') || lower.includes('control plane') || lower.includes('root')) {
    return {
      text: `### 🔐 Architecture Recommendation: Just-In-Time (JIT) Ephemeral Access for Kubernetes Control Plane

To achieve zero permanent privileges for Kubernetes cluster administrators, ZeroTrustX recommends implementing a **Just-In-Time (JIT) Dynamic Assertion Pipeline**:

#### 1. Architecture Flow
\`\`\`
[Admin Workstation] 
     │ (Hardware FIDO2 Auth)
     ▼
[ZeroTrustX PEP / Gateway] ──► [Policy Engine (PDP)] ──► Dual-Authorization (Manager + SOC)
     │                                                           │ (Approved)
     ▼                                                           ▼
[Ephemeral OIDC Token] ◄─────────────────────────────────────────┘
     │ (Valid for 60 minutes)
     ▼
[k8s-apiserver --oidc-issuer-url=https://zerotrustx.internal/oauth]
\`\`\`

#### 2. Core Governance Controls:
- **No Static Kubeconfig Credentials**: Deprecate static client certificates and persistent ServiceAccount tokens in developer environments.
- **Hardware-Enforced Step-Up**: Require YubiKey or Touch ID biometric assertion at the instant the \`kubectl\` command executes against production clusters.
- **Ephemeral Session Validity**: Scope access tickets to a maximum TTL of **45–60 minutes**, with automatic revocation upon risk score elevation.
- **Cryptographic Command Auditing**: All \`exec\`, \`port-forward\`, and \`apply\` verbs are logged directly to the immutable ZeroTrustX audit stream (\`AUD-9821\`).

#### 3. Recommended Policy Rule:
\`\`\`json
{
  "policyId": "POL-K8S-PROD-JIT",
  "name": "Production Kubernetes Control Plane JIT Access",
  "requiredRole": ["Security Admin", "Lead SRE"],
  "conditions": {
    "deviceTrustScoreMin": 90,
    "hardwareMfaRequired": true,
    "peerApprovalRequired": true,
    "sessionDurationMinutes": 60,
    "allowedCIDR": ["Corporate Office", "Approved ZTNA PoP"]
  },
  "action": "ALLOW_WITH_EPHEMERAL_STEPUP"
}
\`\`\``,
      modelUsed: 'gemini-3.5-flash (ZTNA Systems Architect)',
      sources: [
        { title: 'Kubernetes Official: Authenticating via OpenID Connect (OIDC)', url: 'https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens' },
        { title: 'Zero Trust Ephemeral Privileges Framework', url: 'https://www.cisa.gov/zero-trust-maturity-model' },
      ],
      webSearchQueries: ['kubernetes zero trust JIT access OIDC configuration', 'ephemeral admin access best practices'],
      isSimulated: true,
    };
  }

  // 3. Neha / Treasury / REQ-10484 query
  if (lower.includes('neha') || lower.includes('treasury') || lower.includes('10484') || lower.includes('challenged')) {
    return {
      text: `### 🔍 Access Evaluation Triage: REQ-10484 (Neha Gupta — Treasury Portal)

**Request Summary:**
- **User**: Neha Gupta (\`neha.gupta@company.com\`) — *Financial Controller*
- **Target Resource**: Swift Banking & Treasury Portal (Production Vault)
- **Device**: HP EliteBook 840 G10 (Device Trust Score: **68 / 100**)
- **Calculated Risk Score**: **74 / 100 (HIGH RISK)**
- **System Decision**: **CHALLENGE (Step-Up MFA Required)**

---

#### Root Cause Analysis:
1. **Unusual Geo-IP Telemetry**:
   - Neha initiated this request from an external residential ISP in New Delhi rather than the corporate campus VLAN.
2. **Device Posture Non-Compliance**:
   - Her CrowdStrike Falcon sensor reported a pending definition update (delta > 48h).
   - Local firewall state: Active, but USB mass storage restriction was disabled.
3. **High-Value Target Classification**:
   - The *Swift Banking & Treasury Portal* is categorized as **Critical Tier 0 Infrastructure** under Policy \`POL-02\`.
   - Any access with a risk score above 40 automatically triggers mandatory Step-Up Authentication.

#### SOC Recommended Resolution:
- Instruct Neha to complete the hardware WebAuthn biometric prompt dispatched to her registered YubiKey 5C.
- Trigger automatic endpoint patch synchronization to bring device trust score from 68 back above the 80 threshold.
- If unverified within 10 minutes, the request should be marked **DENIED** by the SOC on-call analyst.`,
      modelUsed: 'gemini-3.5-flash (SOC Threat Analyst)',
      sources: [
        { title: 'ZeroTrustX Policy POL-02: Treasury Microsegmentation Rule', url: 'https://zerotrustx.internal/policies/POL-02' },
        { title: 'Access Request REQ-10484 Telemetry Log', url: 'https://zerotrustx.internal/requests/REQ-10484' },
      ],
      webSearchQueries: ['REQ-10484 audit trace', 'Treasury Portal access evaluation heuristics'],
      isSimulated: true,
    };
  }

  // 4. CISA Zero Trust Maturity Model
  if (lower.includes('cisa') || lower.includes('5 pillars') || lower.includes('maturity model') || lower.includes('pillars')) {
    return {
      text: `### 🏛️ The 5 Pillars of the CISA Zero Trust Maturity Model (v2.0)

The Cybersecurity and Infrastructure Security Agency (CISA) defines Zero Trust across **five core pillars**, interconnected by three foundation-wide cross-cutting capabilities:

#### 1. 👤 Identity Pillar
- **Objective**: Ensure that only verified entities (humans and service accounts) access resources.
- **Maturity progression**: Legacy passwords ➔ Centralized IAM ➔ Mandatory Phishing-Resistant MFA (FIDO2) ➔ Continuous risk-adaptive authentication.

#### 2. 💻 Device Pillar
- **Objective**: Hardware integrity and continuous health verification before granting access.
- **Maturity progression**: Unmanaged endpoints ➔ MDM inventory ➔ Real-time EDR health attestation (CrowdStrike/Defender) + TPM 2.0 cryptographic binding.

#### 3. 🌐 Network Pillar
- **Objective**: Segment networks and prevent lateral movement.
- **Maturity progression**: Flat corporate LAN with perimeter firewalls ➔ Macro-segmentation ➔ Microsegmentation with Software-Defined Perimeters (SDP) and isolated ephemeral mTLS tunnels.

#### 4. 📦 Application & Workload Pillar
- **Objective**: Protect apps regardless of where they are hosted (on-prem, cloud, SaaS).
- **Maturity progression**: Direct open web access ➔ Reverse proxy with static ACLs ➔ Continuous application-level authorization and JIT privilege tokens.

#### 5. 📊 Data Pillar
- **Objective**: Discover, classify, and cryptographically protect enterprise data at rest and in transit.
- **Maturity progression**: Perimeter perimeter defenses ➔ Data loss prevention (DLP) ➔ Automated cryptographic tagging, envelope encryption, and real-time egress blocking.

---

#### 🔗 Cross-Cutting Capabilities:
- **Visibility and Analytics**: Automated telemetry ingestion across all five pillars.
- **Automation and Orchestration (SOAR)**: Dynamic threat containment and quarantine playbooks.
- **Governance**: Enterprise-wide continuous policy enforcement and compliance tracking.`,
      modelUsed: 'gemini-3.5-flash (CISA Architecture Advisor)',
      sources: [
        { title: 'CISA Zero Trust Maturity Model Version 2.0 (Official Document)', url: 'https://www.cisa.gov/zero-trust-maturity-model' },
        { title: 'NIST SP 800-207: Zero Trust Architecture Standard', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final' },
        { title: 'Executive Order 14028: Improving the Nation\'s Cybersecurity', url: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/' },
      ],
      webSearchQueries: ['CISA zero trust maturity model 5 pillars', 'NIST SP 800-207 tenets'],
      isSimulated: true,
    };
  }

  // 5. Default Fallback tailored to query
  return {
    text: `### 🛡️ ZeroTrustX Security Assessment: "${query}"

**Evaluation Persona**: ${role === 'soc_analyst' ? 'SOC Threat Analyst' : role === 'architecture_advisor' ? 'Zero Trust Lead Architect' : 'Incident Response Commander'}
**Telemetry Status**: Evaluated against current active policies (\`POL-01\` through \`POL-05\`) and 2,481 protected enterprise identities.

#### Key Security Insights:
1. **Zero Trust Principle Application**:
   - ZeroTrustX operates under the foundational mandate: *"Never Trust, Always Verify"*.
   - All network sessions are treated as untrusted, regardless of whether traffic originates inside corporate physical offices or remote public networks.

2. **Contextual Evaluation Vector**:
   - **Identity Proofing**: Verified via FIDO2 / WebAuthn cryptographic passkeys.
   - **Device Integrity**: Evaluated via hardware TPM 2.0 chip and CrowdStrike EDR telemetry.
   - **Risk Heuristics**: Continuous velocity checking, IP reputation scoring, and behavior anomaly detection.

3. **Recommended Immediate Action**:
   - Ensure the relevant Zero Trust Access Policy in the **Policies** tab is marked **ACTIVE**.
   - Monitor the **Live Security Events** feed for telemetry anomalies related to this resource.
   - Use the **Access Policy Simulator** (\`Ctrl + K\` or top bar button) to run test scenarios against the 5-Gate evaluation pipeline.

*Note: For live real-time web querying, configure the GEMINI_API_KEY environment variable.*`,
    modelUsed: 'gemini-3.5-flash (Autonomous SOC Intelligence)',
    sources: [
      { title: 'ZeroTrustX Enterprise Security Architecture Guide', url: 'https://zerotrustx.internal/docs/architecture' },
      { title: 'NIST SP 800-207 Tenets and Implementation', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final' },
    ],
    webSearchQueries: [`Zero Trust best practices for: ${query.slice(0, 30)}`],
    isSimulated: true,
  };
}
