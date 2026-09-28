export interface Investigation { id: string; target: string; status: string; confidence: number; evidenceCount: number }
export interface Actor { name: string; aliases: string[]; firstObserved: string; lastObserved: string }
export interface Evidence { id: string; source: string; type: string; collectedAt: string; hash: string; confidence: number; integrity: 'VERIFIED' | 'FLAGGED' }
export interface Signal { label: string; confidence: number; category: 'infrastructure' | 'entity' | 'persona' | 'temporal' }
export interface Relationship { source: string; target: string; label: string; confidence: number }
export interface TimelineEvent { date: string; title: string; evidenceId: string; detail: string }

export const currentInvestigation: Investigation = { id: 'CASE-2026-0042', target: 'ShadowFox', status: 'Potential Actor Association', confidence: 87, evidenceCount: 127 };
export const currentActor: Actor = { name: 'ShadowFox', aliases: ['shadow_fox', 'SF_market', 'ShadowFox77'], firstObserved: '2024-08-12', lastObserved: '2026-09-21' };
export const currentEvidence: Evidence[] = [
  { id: 'EVID-00482', source: 'Synthetic Forum Snapshot', type: 'Alias similarity', collectedAt: '21 Sep 2026 14:32:11 UTC', hash: 'a83f…91cd', confidence: 82, integrity: 'VERIFIED' },
  { id: 'EVID-00483', source: 'Synthetic Historical Archive', type: 'PGP fingerprint relationship', collectedAt: '17 Sep 2026 11:22:09 UTC', hash: '3a82…7bd1', confidence: 96, integrity: 'VERIFIED' },
  { id: 'EVID-00484', source: 'Synthetic Infrastructure Record', type: 'Certificate similarity', collectedAt: '12 Sep 2026 04:15:44 UTC', hash: '4d81…2a91', confidence: 88, integrity: 'VERIFIED' },
];
export const currentSignals: Signal[] = [
  { label: 'Infrastructure', confidence: 92, category: 'infrastructure' }, { label: 'Entity Resolution', confidence: 88, category: 'entity' }, { label: 'Persona', confidence: 84, category: 'persona' }, { label: 'Temporal Linkage', confidence: 91, category: 'temporal' },
];
export const currentRelationships: Relationship[] = [
  { source: 'ShadowFox', target: 'PGP-7A92', label: 'PGP relationship', confidence: 96 }, { source: 'ShadowFox', target: 'Infra-04', label: 'temporal overlap', confidence: 91 }, { source: 'ShadowFox', target: 'Persona 03', label: 'behavioral similarity', confidence: 84 },
];
export const currentTimeline: TimelineEvent[] = [
  { date: '2024-08', title: 'Alias first observed', evidenceId: 'EVID-00482', detail: 'Synthetic forum alias signal collected.' }, { date: '2024-11', title: 'PGP fingerprint associated', evidenceId: 'EVID-00483', detail: 'Synthetic PGP relationship correlated.' }, { date: '2025-03', title: 'Marketplace migration detected', evidenceId: 'EVID-00482', detail: 'Synthetic alias transition observed.' }, { date: '2025-08', title: 'Infrastructure transition detected', evidenceId: 'EVID-00484', detail: 'Synthetic certificate change correlated.' }, { date: '2026-09', title: 'ShadowFox association generated', evidenceId: 'EVID-00484', detail: 'Investigative lead created from synthetic evidence.' },
];
