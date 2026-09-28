import { supabase } from './supabase';
import type { Actor, Evidence, Investigation, Relationship, Signal, TimelineEvent } from '../types/shadowgraph';

async function query<T>(request: PromiseLike<{ data: T[] | null; error: Error | null }>): Promise<T[]> { const { data, error } = await request; if (error) throw error; return data ?? []; }
export const getInvestigations = () => query<Investigation>(supabase.from('investigations').select('*').order('updated_at', { ascending: false }));
export async function getInvestigation(caseId: string) { const rows = await query<Investigation>(supabase.from('investigations').select('*').eq('case_id', caseId).limit(1)); return rows[0] ?? null; }
export const getActors = (investigationId: string) => query<Actor>(supabase.from('actors').select('*').eq('investigation_id', investigationId));
export const getEvidence = (investigationId: string) => query<Evidence>(supabase.from('evidence').select('*').eq('investigation_id', investigationId).order('collected_at', { ascending: false }));
export const getSignals = (investigationId: string) => query<Signal>(supabase.from('signals').select('*').eq('investigation_id', investigationId));
export const getRelationships = (investigationId: string) => query<Relationship>(supabase.from('relationships').select('*').eq('investigation_id', investigationId));
export const getTimelineEvents = (investigationId: string) => query<TimelineEvent>(supabase.from('timeline_events').select('*').eq('investigation_id', investigationId).order('event_at', { ascending: true }));
