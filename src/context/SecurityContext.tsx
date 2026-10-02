import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Device,
  AccessRequest,
  ZeroTrustPolicy,
  RoleDefinition,
  SecurityEvent,
  AuditLog,
  NotificationItem,
  SecuritySettings,
  ActiveSession,
} from '../types';
import {
  initialUsers,
  initialDevices,
  initialAccessRequests,
  initialPolicies,
  initialRoles,
  initialSecurityEvents,
  initialAuditLogs,
  initialNotifications,
  initialSettings,
  initialActiveSessions,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface SecurityContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string; avatar: string };
  environment: 'Production' | 'Staging' | 'DR-East';
  setEnvironment: (env: 'Production' | 'Staging' | 'DR-East') => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Data States
  users: User[];
  devices: Device[];
  accessRequests: AccessRequest[];
  policies: ZeroTrustPolicy[];
  roles: RoleDefinition[];
  securityEvents: SecurityEvent[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  settings: SecuritySettings;
  activeSessions: ActiveSession[];

  // Global Dialogs & Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  isLiveSessionsModalOpen: boolean;
  setIsLiveSessionsModalOpen: (open: boolean) => void;
  isTourModalOpen: boolean;
  setIsTourModalOpen: (open: boolean) => void;

  // Live Stream Simulation
  isLiveStreamActive: boolean;
  toggleLiveStream: () => void;
  triggerAttackScenario: (type: 'credential_stuffing' | 'impossible_travel' | 'malware_outbreak') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;

  // User Actions
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  toggleUserStatus: (userId: string) => void;
  requireMFAForUser: (userId: string) => void;

  // Device Actions
  toggleDeviceTrust: (deviceId: string) => void;
  quarantineDevice: (deviceId: string) => void;

  // Session Actions
  revokeSession: (sessionId: string) => void;

  // Access Request Actions
  approveRequest: (requestId: string, reviewerNotes?: string) => void;
  denyRequest: (requestId: string, reviewerNotes?: string) => void;
  challengeRequest: (requestId: string, reviewerNotes?: string) => void;

  // Policy Actions
  addPolicy: (policy: Omit<ZeroTrustPolicy, 'id'>) => void;
  updatePolicy: (policy: ZeroTrustPolicy) => void;
  togglePolicyStatus: (policyId: string) => void;
  deletePolicy: (policyId: string) => void;

  // RBAC Actions
  togglePermission: (
    roleId: string,
    categoryName: string,
    permId: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Settings
  updateSettings: (newSettings: Partial<SecuritySettings>) => void;

  // Audit Logs
  logAudit: (action: string, resource: string, result: 'Success' | 'Denied' | 'Warning' | 'Failed', metadata?: string) => void;

  // Reset to demo defaults
  resetToDemoDefaults: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ztx_auth') === 'true';
  });

  const [currentUser] = useState({
    name: 'Aarav Mehta',
    email: 'admin@zerotrustx.demo',
    role: 'Lead Security Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  });

  const [environment, setEnvironment] = useState<'Production' | 'Staging' | 'DR-East'>('Production');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isLiveSessionsModalOpen, setIsLiveSessionsModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Live Stream Simulation
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // Guaranteed unique ID generator and collision eliminator
  const createUniqueSecurityId = (prefix: string) => {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  };

  const deduplicateById = <T extends { id: string }>(items: T[]): T[] => {
    const seen = new Set<string>();
    const result: T[] = [];
    for (const item of items) {
      if (item && item.id) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        } else {
          // Collision detected: regenerate unique ID
          const freshId = `${item.id}-${Math.random().toString(36).substring(2, 6)}`;
          seen.add(freshId);
          result.push({ ...item, id: freshId });
        }
      }
    }
    return result;
  };

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
    const saved = localStorage.getItem('ztx_sessions');
    return saved ? deduplicateById(JSON.parse(saved)) : initialActiveSessions;
  });

  // Entities stored in local state with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ztx_users');
    return saved ? deduplicateById(JSON.parse(saved)) : initialUsers;
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('ztx_devices');
    return saved ? deduplicateById(JSON.parse(saved)) : initialDevices;
  });

  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    const saved = localStorage.getItem('ztx_requests');
    return saved ? deduplicateById(JSON.parse(saved)) : initialAccessRequests;
  });

  const [policies, setPolicies] = useState<ZeroTrustPolicy[]>(() => {
    const saved = localStorage.getItem('ztx_policies');
    return saved ? deduplicateById(JSON.parse(saved)) : initialPolicies;
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    const saved = localStorage.getItem('ztx_roles');
    return saved ? deduplicateById(JSON.parse(saved)) : initialRoles;
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => {
    const saved = localStorage.getItem('ztx_events');
    return saved ? deduplicateById(JSON.parse(saved)) : deduplicateById(initialSecurityEvents);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ztx_audit');
    return saved ? deduplicateById(JSON.parse(saved)) : deduplicateById(initialAuditLogs);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ztx_notifs');
    return saved ? deduplicateById(JSON.parse(saved)) : deduplicateById(initialNotifications);
  });

  const [settings, setSettings] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('ztx_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ztx_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ztx_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('ztx_requests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    localStorage.setItem('ztx_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('ztx_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('ztx_events', JSON.stringify(securityEvents));
  }, [securityEvents]);

  useEffect(() => {
    localStorage.setItem('ztx_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('ztx_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ztx_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ztx_sessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  // Live Stream Simulation: Periodically generates real-time telemetry events
  useEffect(() => {
    if (!isLiveStreamActive || !isAuthenticated) return;

    const streamInterval = setInterval(() => {
      // Pick random simulated event
      const sampleSimulatedEvents: Omit<SecurityEvent, 'id' | 'timestamp'>[] = [
        {
          severity: 'low',
          eventType: 'Login Success',
          user: 'Priya Patel',
          userEmail: 'priya.patel@zerotrustx.demo',
          ip: '106.51.78.44',
          device: 'MacBook Air (M2)',
          location: 'Hyderabad, India',
          action: 'Allowed',
          details: 'Continuous device posture passed; hardware TPM cryptographic attestation valid.',
          resourceTarget: 'GitHub Microservices'
        },
        {
          severity: 'medium',
          eventType: 'Step-Up Challenge',
          user: 'Karthik Nair',
          userEmail: 'karthik.nair@zerotrustx.demo',
          ip: '49.207.180.89',
          device: 'ThinkPad T14 Gen 4',
          location: 'Bengaluru, India',
          action: 'Challenged',
          details: 'Unusual off-hours access to Kubernetes production cluster; challenged for FIDO2 key tap.',
          resourceTarget: 'Kubernetes EKS Core'
        },
        {
          severity: 'low',
          eventType: 'Login Success',
          user: 'Divya Iyer',
          userEmail: 'divya.iyer@zerotrustx.demo',
          ip: '14.139.245.98',
          device: 'Dell Latitude 7440',
          location: 'New Delhi, India',
          action: 'Allowed',
          details: 'BitLocker encryption check OK, CrowdStrike Falcon sensor active.',
          resourceTarget: 'Workday HR Portal'
        },
      ];

      const chosen = sampleSimulatedEvents[Math.floor(Math.random() * sampleSimulatedEvents.length)];
      const newEvt: SecurityEvent = {
        ...chosen,
        id: createUniqueSecurityId('EVT'),
        timestamp: 'Just now',
      };

      setSecurityEvents((prev) => deduplicateById([newEvt, ...prev.slice(0, 24)]));
    }, 12000);

    return () => clearInterval(streamInterval);
  }, [isLiveStreamActive, isAuthenticated]);

  // Toast handler
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth actions
  const login = (email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      localStorage.setItem('ztx_auth', 'true');
      addToast('Zero Trust Handshake Established', 'Continuous device authentication active', 'success');
      logAudit('Admin Session Established', 'ZeroTrustX Admin Console', 'Success', `Authenticated as ${email}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ztx_auth');
    addToast('Session Terminated', 'Zero Trust tokens flushed from browser session', 'info');
  };

  // Reset to demo defaults
  const resetToDemoDefaults = () => {
    localStorage.removeItem('ztx_users');
    localStorage.removeItem('ztx_devices');
    localStorage.removeItem('ztx_requests');
    localStorage.removeItem('ztx_policies');
    localStorage.removeItem('ztx_roles');
    localStorage.removeItem('ztx_events');
    localStorage.removeItem('ztx_audit');
    localStorage.removeItem('ztx_notifs');
    localStorage.removeItem('ztx_settings');
    localStorage.removeItem('ztx_sessions');

    setUsers(deduplicateById(initialUsers));
    setDevices(deduplicateById(initialDevices));
    setAccessRequests(deduplicateById(initialAccessRequests));
    setPolicies(deduplicateById(initialPolicies));
    setRoles(deduplicateById(initialRoles));
    setSecurityEvents(deduplicateById(initialSecurityEvents));
    setAuditLogs(deduplicateById(initialAuditLogs));
    setNotifications(deduplicateById(initialNotifications));
    setSettings(initialSettings);
    setActiveSessions(deduplicateById(initialActiveSessions));

    addToast('Environment Reset', 'Demo state restored to baseline Zero Trust security defaults', 'info');
    logAudit('Reset Environment Defaults', 'System State', 'Success', 'Local state restored to factory seed');
  };

  // Log audit helper
  const logAudit = (
    action: string,
    resource: string,
    result: 'Success' | 'Denied' | 'Warning' | 'Failed',
    metadata?: string
  ) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: AuditLog = {
      id: createUniqueSecurityId('AUD'),
      timestamp: formatted,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action,
      resource,
      ipAddress: '14.139.245.12',
      result,
      metadata,
    };
    setAuditLogs((prev) => deduplicateById([newLog, ...prev]));
  };

  // Users
  const addUser = (userData: Omit<User, 'id'>) => {
    const newId = createUniqueSecurityId('USR');
    const newUser: User = { ...userData, id: newId };
    setUsers((prev) => deduplicateById([newUser, ...prev]));
    addToast('Identity Provisioned', `User ${newUser.name} added with Zero Trust profile`, 'success');
    logAudit('Provisioned User Identity', `User: ${newUser.email}`, 'Success', `Role: ${newUser.role}`);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addToast('Identity Updated', `${updatedUser.name} profile synchronized`, 'info');
    logAudit('Updated User Profile', `User: ${updatedUser.email}`, 'Success');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          addToast(
            `User ${newStatus === 'suspended' ? 'Suspended' : 'Activated'}`,
            `${u.name} status is now ${newStatus}`,
            newStatus === 'suspended' ? 'warning' : 'success'
          );
          logAudit(
            newStatus === 'suspended' ? 'Suspended User' : 'Re-activated User',
            `User: ${u.email}`,
            'Success'
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const requireMFAForUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          addToast('MFA Policy Enforced', `Hardware MFA mandatory on next login for ${u.name}`, 'warning');
          logAudit('Enforced Mandatory MFA', `User: ${u.email}`, 'Success');
          return { ...u, mfaStatus: 'enforced' };
        }
        return u;
      })
    );
  };

  // Devices
  const toggleDeviceTrust = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const newStatus = d.trustStatus === 'trusted' ? 'unknown' : 'trusted';
          const newScore = newStatus === 'trusted' ? 92 : 55;
          addToast(
            `Device Posture Updated`,
            `${d.name} trust marked as ${newStatus} (Score: ${newScore})`,
            'info'
          );
          logAudit('Modified Device Trust Posture', `Device: ${d.name} (${d.id})`, 'Success', `Status: ${newStatus}`);
          return { ...d, trustStatus: newStatus, trustScore: newScore };
        }
        return d;
      })
    );
  };

  const quarantineDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const isBlocked = d.trustStatus === 'blocked';
          const nextStatus = isBlocked ? 'trusted' : 'blocked';
          const nextScore = isBlocked ? 90 : 15;
          addToast(
            isBlocked ? 'Device Unquarantined' : 'Device Quarantined',
            isBlocked
              ? `${d.name} restored to network gateway`
              : `${d.name} isolated from all zero trust micro-segments`,
            isBlocked ? 'success' : 'error'
          );
          logAudit(
            isBlocked ? 'Restored Device from Quarantine' : 'Quarantined Endpoint Device',
            `Device: ${d.name} (${d.id})`,
            'Success',
            `Target user: ${d.userName}`
          );

          // Also inject a security event
          if (!isBlocked) {
            setSecurityEvents((evts) => [
              {
                id: `EVT-${Date.now().toString().slice(-4)}`,
                timestamp: 'Just now',
                severity: 'critical',
                eventType: 'Device Quarantined',
                user: d.userName,
                userEmail: d.userEmail,
                ip: d.ipAddress,
                device: d.name,
                location: d.location,
                action: 'Quarantined',
                details: 'Device network egress revoked manually by SOC administrator.',
                resourceTarget: 'Zero Trust Gateway Isolation'
              },
              ...evts
            ]);
          }

          return { ...d, trustStatus: nextStatus, trustScore: nextScore, riskLevel: isBlocked ? 'low' : 'critical' };
        }
        return d;
      })
    );
  };

  // Access Requests
  const approveRequest = (requestId: string, reviewerNotes?: string) => {
    setAccessRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          addToast('Access Request Approved', `${req.userName} granted access to ${req.resource}`, 'success');
          logAudit(
            'Approved JIT Access Request',
            req.resource,
            'Success',
            `User: ${req.userName}, Role: ${req.requestedRole}`
          );

          setSecurityEvents((evts) => [
            {
              id: `EVT-${Date.now().toString().slice(-4)}`,
              timestamp: 'Just now',
              severity: 'low',
              eventType: 'Login Success',
              user: req.userName,
              userEmail: req.userEmail,
              ip: req.ipAddress,
              device: req.deviceName,
              location: req.location,
              action: 'Allowed',
              details: `Administrator approved access request ${req.id} for ${req.resource}.`,
              resourceTarget: req.resource
            },
            ...evts
          ]);

          return {
            ...req,
            status: 'approved',
            decision: 'ALLOW',
            reviewerNotes: reviewerNotes || 'Verified identity, device trust, and role compliance in Zero Trust panel.',
            decisionReason: ['Administrator manual override approval', 'Hardware posture verified compliant'],
          };
        }
        return req;
      })
    );
  };

  const denyRequest = (requestId: string, reviewerNotes?: string) => {
    setAccessRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          addToast('Access Request Denied', `Access for ${req.userName} was blocked`, 'error');
          logAudit(
            'Denied Resource Access Request',
            req.resource,
            'Denied',
            `User: ${req.userName}, Notes: ${reviewerNotes || 'Risk too high'}`
          );

          setSecurityEvents((evts) =>
            deduplicateById([
              {
                id: createUniqueSecurityId('EVT'),
                timestamp: 'Just now',
                severity: 'high',
                eventType: 'Access Denied',
                user: req.userName,
                userEmail: req.userEmail,
                ip: req.ipAddress,
                device: req.deviceName,
                location: req.location,
                action: 'Blocked',
                details: `Administrator denied access request ${req.id} to ${req.resource}.`,
                resourceTarget: req.resource,
              },
              ...evts,
            ])
          );

          return {
            ...req,
            status: 'denied',
            decision: 'DENY',
            reviewerNotes: reviewerNotes || 'Access denied due to elevated risk profile or non-compliant device.',
            decisionReason: ['Administrator denied request', 'Policy condition breach'],
          };
        }
        return req;
      })
    );
  };

  const challengeRequest = (requestId: string, reviewerNotes?: string) => {
    setAccessRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          addToast('Step-Up MFA Challenged', `Hardware biometric prompt dispatched to ${req.userName}`, 'warning');
          logAudit('Triggered Step-Up MFA Challenge', req.resource, 'Warning', `Target: ${req.userName}`);

          setSecurityEvents((evts) =>
            deduplicateById([
              {
                id: createUniqueSecurityId('EVT'),
                timestamp: 'Just now',
                severity: 'medium',
                eventType: 'Step-Up Challenge',
                user: req.userName,
                userEmail: req.userEmail,
                ip: req.ipAddress,
                device: req.deviceName,
                location: req.location,
                action: 'Challenged',
                details: `Access request ${req.id} paused awaiting secondary FIDO2 hardware verification.`,
                resourceTarget: req.resource,
              },
              ...evts,
            ])
          );

          return {
            ...req,
            status: 'challenged',
            decision: 'CHALLENGE',
            reviewerNotes: reviewerNotes || 'Step-up MFA challenge issued before granting session token.',
          };
        }
        return req;
      })
    );
  };

  // Policies
  const addPolicy = (policyData: Omit<ZeroTrustPolicy, 'id'>) => {
    const newPolicy: ZeroTrustPolicy = {
      ...policyData,
      id: `POL-0${policies.length + 1}`,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: currentUser.name,
      enforcedCount: 0,
    };
    setPolicies((prev) => [newPolicy, ...prev]);
    addToast('Zero Trust Policy Created', `${newPolicy.name} deployed to security enforcement points`, 'success');
    logAudit('Created Zero Trust Policy', newPolicy.name, 'Success');
  };

  const updatePolicy = (policy: ZeroTrustPolicy) => {
    const updated = {
      ...policy,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: currentUser.name,
    };
    setPolicies((prev) => prev.map((p) => (p.id === policy.id ? updated : p)));
    addToast('Policy Synchronized', `${policy.name} updated across all gateways`, 'success');
    logAudit('Updated Zero Trust Policy', policy.name, 'Success');
  };

  const togglePolicyStatus = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === policyId) {
          const nextStatus = p.status === 'active' ? 'disabled' : 'active';
          addToast('Policy State Toggled', `${p.name} is now ${nextStatus}`, 'info');
          logAudit(
            nextStatus === 'active' ? 'Enabled Policy Rule' : 'Disabled Policy Rule',
            p.name,
            'Success'
          );
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const deletePolicy = (policyId: string) => {
    const target = policies.find((p) => p.id === policyId);
    setPolicies((prev) => prev.filter((p) => p.id !== policyId));
    addToast('Policy Removed', `Policy ${target?.name || policyId} deleted`, 'warning');
    logAudit('Deleted Zero Trust Policy', target?.name || policyId, 'Warning');
  };

  // RBAC
  const togglePermission = (
    roleId: string,
    categoryName: string,
    permId: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          const updatedCategories = role.categories.map((cat) => {
            if (cat.category === categoryName) {
              const updatedPerms = cat.permissions.map((p) => {
                if (p.id === permId) {
                  return { ...p, [action]: !p[action] };
                }
                return p;
              });
              return { ...cat, permissions: updatedPerms };
            }
            return cat;
          });
          return { ...role, categories: updatedCategories };
        }
        return role;
      })
    );
    addToast('Role Permissions Saved', `Matrix updated for selected role`, 'success');
    logAudit('Modified Role Permission Matrix', `Role ID: ${roleId}`, 'Success', `Action: ${action} toggled`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All security alerts marked as read', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SecuritySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Security Configuration Updated', 'Zero Trust thresholds adjusted successfully', 'success');
    logAudit('Updated Global Security Settings', 'System Governance', 'Success');
  };

  // Session Actions
  const revokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addToast('Session Revoked Immediately', `Cryptographic token for ${sessionId} invalidated at edge`, 'warning');
    logAudit('Terminated Cryptographic Session', `Session ${sessionId}`, 'Success', 'Admin manual termination');
  };

  const toggleLiveStream = () => {
    setIsLiveStreamActive((prev) => {
      const next = !prev;
      addToast(
        next ? 'Live SOC Stream Resumed' : 'Live Stream Paused',
        next ? 'Incoming access attempts and events stream in real-time' : 'Telemetry stream paused',
        'info'
      );
      return next;
    });
  };

  const triggerAttackScenario = (type: 'credential_stuffing' | 'impossible_travel' | 'malware_outbreak') => {
    const timestamp = 'Just now';
    if (type === 'credential_stuffing') {
      const attackEvent: SecurityEvent = {
        id: createUniqueSecurityId('EVT'),
        timestamp,
        severity: 'critical',
        eventType: 'Suspicious Login',
        user: 'Botnet Cluster (Tor Exit)',
        userEmail: 'root-probe@tor-relay-4.onion',
        ip: '185.220.101.5',
        device: 'Automated Python Requests Agent',
        location: 'Tor Exit Node (Frankfurt)',
        action: 'Blocked',
        details: 'Perimeter Alert: 48 failed authentication attempts in 4 seconds. Adaptive Rate-Limiting dropped traffic.',
        resourceTarget: 'Identity Provider WebAuthn Gateway',
      };

      setSecurityEvents((prev) => deduplicateById([attackEvent, ...prev]));
      addToast('CRITICAL SECURITY INCIDENT DETECTED', 'Tor Exit node credential stuffing attack dropped at perimeter', 'error');
      logAudit('Perimeter Attack Mitigated', 'Auth Gateway', 'Denied', 'Tor Exit probe blocked');
    } else if (type === 'impossible_travel') {
      const travelEvent: SecurityEvent = {
        id: createUniqueSecurityId('EVT'),
        timestamp,
        severity: 'high',
        eventType: 'Step-Up Challenge',
        user: 'Aarav Mehta',
        userEmail: 'aarav.mehta@zerotrustx.demo',
        ip: '91.200.12.8',
        device: 'MacBook Pro 16"',
        location: 'London, UK',
        action: 'Challenged',
        details: 'Impossible Travel Anomaly: User was in New Delhi 14 minutes ago. Mandatory hardware FIDO2 re-challenge dispatched.',
        resourceTarget: 'SOC SIEM Command Vault',
      };

      setSecurityEvents((prev) => deduplicateById([travelEvent, ...prev]));
      addToast('Impossible Travel Detected', 'Velocity check triggered mandatory hardware challenge for Aarav Mehta', 'warning');
      logAudit('Triggered Impossible Travel Step-Up', 'SOC SIEM Portal', 'Warning', 'Delta: 6,700 km in 14 min');
    } else {
      const malwareEvent: SecurityEvent = {
        id: createUniqueSecurityId('EVT'),
        timestamp,
        severity: 'critical',
        eventType: 'Device Quarantined',
        user: 'Neha Gupta',
        userEmail: 'neha.gupta@zerotrustx.demo',
        ip: '122.161.49.88',
        device: 'HP EliteBook 840 G10',
        location: 'New Delhi, India',
        action: 'Quarantined',
        details: 'CrowdStrike Falcon sensor detected malicious unsigned payload. Device severed from all corporate VLANs.',
        resourceTarget: 'Zero Trust Gateway Isolation',
      };

      setSecurityEvents((prev) => deduplicateById([malwareEvent, ...prev]));
      addToast('Endpoint Automatically Quarantined', 'CrowdStrike sensor isolated HP EliteBook 840 G10', 'error');
      logAudit('Automated Endpoint Quarantine', 'HP EliteBook 840 G10', 'Success', 'Zero Trust Isolation');
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        environment,
        setEnvironment,
        login,
        logout,
        users,
        devices,
        accessRequests,
        policies,
        roles,
        securityEvents,
        auditLogs,
        notifications,
        settings,
        activeSessions,
        isSearchOpen,
        setIsSearchOpen,
        isSimulatorOpen,
        setIsSimulatorOpen,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        isLiveSessionsModalOpen,
        setIsLiveSessionsModalOpen,
        isTourModalOpen,
        setIsTourModalOpen,
        isLiveStreamActive,
        toggleLiveStream,
        triggerAttackScenario,
        toasts,
        addToast,
        removeToast,
        addUser,
        updateUser,
        toggleUserStatus,
        requireMFAForUser,
        toggleDeviceTrust,
        quarantineDevice,
        revokeSession,
        approveRequest,
        denyRequest,
        challengeRequest,
        addPolicy,
        updatePolicy,
        togglePolicyStatus,
        deletePolicy,
        togglePermission,
        markNotificationAsRead,
        markAllNotificationsRead,
        updateSettings,
        logAudit,
        resetToDemoDefaults,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
