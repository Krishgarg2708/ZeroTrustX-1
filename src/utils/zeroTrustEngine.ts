import { AccessDecision, ZeroTrustPolicy } from '../types';

export interface EvaluationInput {
  userName: string;
  userRole: string;
  resource: string;
  deviceName: string;
  deviceTrustScore: number;
  isDeviceTrusted: boolean;
  mfaVerified: boolean;
  location: string;
  ipReputation: 'Low Risk' | 'Medium Risk' | 'Known Tor/Proxy' | 'High Threat';
  behaviorAnomaly: 'Normal' | 'Unusual Hours' | 'Impossible Travel' | 'Elevated Privilege';
}

export interface EvaluationResult {
  decision: AccessDecision;
  riskScore: number;
  reasons: string[];
  matchedPolicyName: string;
  subScores: {
    identityTrust: number;
    deviceTrust: number;
    networkTrust: number;
    behaviorTrust: number;
  };
}

export function evaluateZeroTrustAccess(
  input: EvaluationInput,
  policies: ZeroTrustPolicy[] = []
): EvaluationResult {
  const reasons: string[] = [];
  
  // Calculate dynamic contextual risk score (0 = lowest risk / safest, 100 = critical threat)
  let calculatedRisk = 15; // base ambient risk

  // 1. Device Trust factor
  if (input.deviceTrustScore >= 85 && input.isDeviceTrusted) {
    calculatedRisk -= 10;
    reasons.push('Device posture verified compliant & hardware root-of-trust intact');
  } else if (input.deviceTrustScore < 60 || !input.isDeviceTrusted) {
    calculatedRisk += 35;
    reasons.push('Device health score below enterprise compliance baseline (< 60)');
  } else {
    calculatedRisk += 10;
    reasons.push('Device trusted with minor pending OS updates');
  }

  // 2. MFA factor
  if (input.mfaVerified) {
    calculatedRisk -= 10;
    reasons.push('FIDO2 / TOTP multi-factor verification succeeded');
  } else {
    calculatedRisk += 30;
    reasons.push('Multi-Factor Authentication not yet verified for session');
  }

  // 3. IP and Location factor
  const highRiskLocations = ['Unknown Tor Exit', 'High Risk Proxy', 'Anonymous VPN'];
  if (highRiskLocations.includes(input.location) || input.ipReputation === 'Known Tor/Proxy' || input.ipReputation === 'High Threat') {
    calculatedRisk += 45;
    reasons.push(`Suspicious IP egress detected (${input.ipReputation})`);
  } else if (input.ipReputation === 'Medium Risk') {
    calculatedRisk += 15;
    reasons.push('Moderate risk IP range (Public cloud or foreign ISP)');
  } else {
    reasons.push('Clean residential/office IP with positive reputation history');
  }

  // 4. Behavioral factor
  if (input.behaviorAnomaly === 'Impossible Travel') {
    calculatedRisk += 40;
    reasons.push('High-velocity geo-velocity anomaly detected (Impossible travel)');
  } else if (input.behaviorAnomaly === 'Elevated Privilege') {
    calculatedRisk += 20;
    reasons.push('Unusual high-privilege resource request outside regular scope');
  } else if (input.behaviorAnomaly === 'Unusual Hours') {
    calculatedRisk += 12;
    reasons.push('Access attempt outside customary working schedule');
  } else {
    reasons.push('Behavioral biometrics & temporal access pattern normal');
  }

  // Clamp risk score to 5 - 98
  calculatedRisk = Math.max(5, Math.min(98, calculatedRisk));

  // Find matching policy
  const matchedPolicy = policies.find(p => 
    p.status === 'active' && 
    (p.resources.includes(input.resource) || p.resources.includes('*') || p.applicableRoles.includes(input.userRole))
  ) || policies[0];

  const policyName = matchedPolicy ? matchedPolicy.name : 'Default-Zero-Trust-Baseline';

  // Evaluate against policy requirements
  let decision: AccessDecision = 'ALLOW';

  if (calculatedRisk >= 65 || input.ipReputation === 'High Threat' || input.behaviorAnomaly === 'Impossible Travel') {
    decision = 'DENY';
    reasons.unshift('CRITICAL: Access blocked due to anomalous risk threshold breach');
  } else if (calculatedRisk >= 40 || !input.mfaVerified || input.deviceTrustScore < 70) {
    decision = 'CHALLENGE';
    reasons.unshift('STEP-UP REQUIRED: Risk profile warrants secondary biometric or hardware MFA verification');
  } else {
    decision = 'ALLOW';
    reasons.unshift(`ACCESS GRANTED: Continuous posture aligns with ${policyName}`);
  }

  return {
    decision,
    riskScore: calculatedRisk,
    reasons,
    matchedPolicyName: policyName,
    subScores: {
      identityTrust: input.mfaVerified ? 94 : 52,
      deviceTrust: input.deviceTrustScore,
      networkTrust: input.ipReputation === 'Low Risk' ? 92 : input.ipReputation === 'Medium Risk' ? 68 : 22,
      behaviorTrust: input.behaviorAnomaly === 'Normal' ? 95 : 45
    }
  };
}
