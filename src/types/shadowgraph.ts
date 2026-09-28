export interface Investigation { id: string; case_id: string; target: string; status: string; confidence: number; evidence_count?: number; updated_at: string }
export interface Actor { id: string; investigation_id: string; name: string; aliases?: string[]; confidence?: number; first_observed?: string; last_observed?: string }
export interface Evidence { id: string; investigation_id: string; source: string; type: string; collected_at: string; sha256: string; confidence: number; integrity: 'VERIFIED' | 'UNVERIFIED' | 'FLAGGED' }
export interface Signal { id: string; investigation_id: string; label: string; category: string; confidence: number; polarity?: 'supporting' | 'contradictory' }
export interface Relationship { id: string; investigation_id: string; source: string; target: string; label: string; confidence: number }
export interface TimelineEvent { id: string; investigation_id: string; event_at: string; title: string; detail?: string; evidence_id?: string }
