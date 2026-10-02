export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AccessDecision = 'ALLOW' | 'CHALLENGE' | 'DENY';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: 'SOC' | 'Finance' | 'DevOps' | 'Engineering' | 'Executive' | 'HR' | 'Legal';
  role: string;
  employeeId: string;
  status: 'active' | 'suspended' | 'pending';
  mfaStatus: 'enabled' | 'disabled' | 'enforced';
  mfaMethod: 'Authenticator App' | 'Hardware FIDO2 Key' | 'Biometric Passkey' | 'SMS OTP' | 'None';
  deviceTrust: 'trusted' | 'partially_trusted' | 'untrusted';
  riskLevel: RiskLevel;
  riskScore: number;
  lastActive: string;
  location: string;
  ipAddress: string;
  assignedResources: string[];
  privileged: boolean;
}

export interface Device {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userEmail: string;
  os: 'macOS 15.1' | 'Windows 11 Enterprise' | 'Ubuntu 24.04 LTS' | 'iOS 18.2' | 'Android 15';
  deviceType: 'Laptop' | 'Desktop' | 'Workstation' | 'Mobile';
  trustScore: number; // 0 - 100
  trustStatus: 'trusted' | 'unknown' | 'blocked' | 'at_risk';
  riskLevel: RiskLevel;
  lastSeen: string;
  location: string;
  ipAddress: string;
  edrStatus: 'CrowdStrike Active' | 'Defender Active' | 'SentinelOne Active' | 'Inactive / Missing';
  encryption: 'FileVault Enabled' | 'BitLocker Enabled' | 'LUKS Enabled' | 'Unencrypted';
  patchStatus: 'Compliant (Latest)' | 'Pending 1 Update' | 'Out of Date (Critical)';
  fingerprint: string;
  certSerial: string;
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userDepartment: string;
  resource: string;
  resourceCategory: 'Database' | 'Cloud Console' | 'Production Cluster' | 'Code Repository' | 'HR System' | 'Financial ERP';
  requestedRole: string;
  deviceId: string;
  deviceName: string;
  deviceTrustScore: number;
  isDeviceTrusted: boolean;
  mfaVerified: boolean;
  location: string;
  ipAddress: string;
  ipReputation: 'Low Risk' | 'Medium Risk' | 'Known Tor/Proxy' | 'High Threat';
  behaviorAnomaly: 'Normal' | 'Unusual Hours' | 'Impossible Travel' | 'Elevated Privilege';
  riskScore: number; // 0 - 100
  requestedAt: string;
  status: 'pending' | 'approved' | 'denied' | 'challenged';
  decision?: AccessDecision;
  decisionReason?: string[];
  policyMatched?: string;
  reviewerNotes?: string;
}

export interface PolicyCondition {
  field: 'role' | 'deviceTrust' | 'mfa' | 'riskScore' | 'location' | 'edrCompliant';
  operator: 'equals' | 'greater_than' | 'less_than' | 'in';
  value: string | number;
}

export interface ZeroTrustPolicy {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: 'active' | 'draft' | 'disabled';
  applicableRoles: string[];
  resources: string[];
  conditions: {
    minDeviceTrust: number;
    requireMFA: boolean;
    maxRiskScore: number;
    allowedLocations?: string[];
    requireEDR: boolean;
  };
  actionOnMatch: 'ALLOW' | 'STEP_UP_MFA';
  actionOnFail: 'DENY' | 'STEP_UP_MFA';
  lastModified: string;
  modifiedBy: string;
  enforcedCount: number;
}

export interface RolePermissionCategory {
  category: 'Identity' | 'Users' | 'Devices' | 'Policies' | 'Security Events' | 'Reports' | 'Settings';
  permissions: {
    id: string;
    label: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  }[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  code: 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'SOC_ANALYST' | 'MANAGER' | 'EMPLOYEE' | 'GUEST';
  description: string;
  usersCount: number;
  permissionsCount: number;
  resourcesCount: number;
  riskLevel: RiskLevel;
  categories: RolePermissionCategory[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: RiskLevel;
  eventType: 'Login Success' | 'Suspicious Login' | 'Access Denied' | 'Policy Updated' | 'Step-Up Challenge' | 'Device Quarantined' | 'Privilege Escalation';
  user: string;
  userEmail: string;
  ip: string;
  device: string;
  location: string;
  action: 'Allowed' | 'Blocked' | 'Challenged' | 'Configured' | 'Quarantined';
  details: string;
  resourceTarget?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  result: 'Success' | 'Denied' | 'Warning' | 'Failed';
  metadata?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  severity: RiskLevel;
  type: 'security' | 'access' | 'device' | 'policy';
  read: boolean;
  actionUrl?: string;
}

export interface ActiveSession {
  id: string;
  userName: string;
  userEmail: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  connectedResource: string;
  authMethod: string;
  deviceTrustScore: number;
  remainingMinutes: number;
  lastHeartbeat: string;
  bytesTransferred: string;
  riskScore: number;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  requireHardwareMFAForPrivileged: boolean;
  autoBlockRiskThreshold: number;
  minDeviceTrustScore: number;
  continuousAuthIntervalSeconds: number;
  geoFencingStrict: boolean;
  edrRequiredForProd: boolean;
  anomalousLoginAlerts: boolean;
}
