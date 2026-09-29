import { supabase } from './supabase';
import type { Actor, Evidence, Investigation, Relationship, Signal, TimelineEvent } from '../types/shadowgraph';

async function query<T>(request: PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return data ?? [];
}
export const getInvestigations = () => query<Investigation>(supabase.from('investigations').select('*').order('updated_at', { ascending: false }));
export async function getInvestigation(caseId: string) {
  const rows = await query<Investigation>(supabase.from('investigations').select('*').eq('case_id', caseId).limit(1));
  return rows[0] ?? null;
}
export const getActors = (investigationId: string) => query<Actor>(supabase.from('actors').select('*').eq('investigation_id', investigationId));
export const getEvidence = (investigationId: string) => query<Evidence>(supabase.from('evidence').select('*').eq('investigation_id', investigationId).order('collected_at', { ascending: false }));
export const getSignals = (investigationId: string) => query<Signal>(supabase.from('signals').select('*').eq('investigation_id', investigationId));
export const getRelationships = (investigationId: string) => query<Relationship>(supabase.from('relationships').select('*').eq('investigation_id', investigationId));
export const getTimelineEvents = (investigationId: string) => query<TimelineEvent>(supabase.from('timeline_events').select('*').eq('investigation_id', investigationId).order('event_at', { ascending: true }));

export async function createDemoInvestigation(input: { caseName: string; target: string; investigationType: string; priority: string; description: string }) {
  const caseId = 'CASE-' + new Date().getUTCFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
  const target = input.target.trim() || 'Unknown Target';
  const now = new Date();
  const { data: investigation, error } = await supabase.from('investigations').insert({
    case_id: caseId, target, investigation_type: input.investigationType, last_activity: now.toISOString(),
    evidence_count: 4, confidence: 87, status: 'Active', priority: input.priority, description: input.description, is_demo: true,
  }).select().single();
  if (error || !investigation) throw new Error(error?.message ?? 'Failed to create investigation.');
  const invId = investigation.id as string;
  const evidencePayload = [
    { evidence_id: caseId+'-EV01', investigation_id: invId, source:'Synthetic Forum-A', evidence_type:'Username similarity', observed_at:new Date(now.getTime()-86400000*6).toISOString(), sha256:'demo-'+crypto.randomUUID().replace(/-/g,'').slice(0,20), confidence:82, integrity_status:'VERIFIED', title:'Alias similarity', content:'Synthetic demonstration evidence.', collected_at:now.toISOString() },
    { evidence_id: caseId+'-EV02', investigation_id: invId, source:'Synthetic Archive', evidence_type:'PGP fingerprint', observed_at:new Date(now.getTime()-86400000*5).toISOString(), sha256:'demo-'+crypto.randomUUID().replace(/-/g,'').slice(0,20), confidence:96, integrity_status:'VERIFIED', title:'PGP relationship', content:'Synthetic demonstration evidence.', collected_at:now.toISOString() },
    { evidence_id: caseId+'-EV03', investigation_id: invId, source:'Synthetic Infrastructure', evidence_type:'Certificate similarity', observed_at:new Date(now.getTime()-86400000*3).toISOString(), sha256:'demo-'+crypto.randomUUID().replace(/-/g,'').slice(0,20), confidence:88, integrity_status:'VERIFIED', title:'Infrastructure reuse', content:'Synthetic demonstration evidence.', collected_at:now.toISOString() },
    { evidence_id: caseId+'-EV04', investigation_id: invId, source:'Synthetic Forum-B', evidence_type:'Timezone inconsistency', observed_at:new Date(now.getTime()-86400000).toISOString(), sha256:'demo-'+crypto.randomUUID().replace(/-/g,'').slice(0,20), confidence:41, integrity_status:'FLAGGED', title:'Contradictory signal', content:'Synthetic contradiction for demonstration.', collected_at:now.toISOString() },
  ];
  const { data: evidence, error: evidenceError } = await supabase.from('evidence').insert(evidencePayload).select();
  if (evidenceError || !evidence) throw new Error(evidenceError?.message ?? 'Failed to create evidence.');
  const ev = evidence as Array<{id:string}>;
  const { error: actorError } = await supabase.from('actors').insert({ investigation_id:invId, name:target, actor_type:'Potential Actor Association', confidence:87, first_observed:now.toISOString(), last_observed:now.toISOString(), status:'Investigative Lead', is_demo:true });
  if (actorError) throw new Error(actorError.message);
  const { error: signalError } = await supabase.from('signals').insert([
    { investigation_id:invId, engine:'Temporal Infrastructure Fingerprint', signal_type:'Infrastructure reuse', description:'Synthetic infrastructure correlation detected.', weight:22, supports:true, confidence:91, evidence_id:ev[2].id },
    { investigation_id:invId, engine:'Contradiction-Aware Entity Resolution', signal_type:'PGP relationship', description:'Synthetic PGP relationship detected.', weight:18, supports:true, confidence:96, evidence_id:ev[1].id },
    { investigation_id:invId, engine:'Contradiction-Aware Entity Resolution', signal_type:'Timezone mismatch', description:'Synthetic contradiction detected.', weight:-6, supports:false, confidence:41, evidence_id:ev[3].id },
  ]);
  if (signalError) throw new Error(signalError.message);
  const { error: relationshipError } = await supabase.from('relationships').insert([
    { investigation_id:invId, source_entity:target, source_type:'actor', target_entity:'alias_'+target.toLowerCase().replace(/\s+/g,'_'), target_type:'alias', relationship_type:'alias', confidence:88, evidence_id:ev[0].id },
    { investigation_id:invId, source_entity:target, source_type:'actor', target_entity:'PGP-DEMO', target_type:'pgp', relationship_type:'PGP relationship', confidence:96, evidence_id:ev[1].id },
    { investigation_id:invId, source_entity:target, source_type:'actor', target_entity:'Infra-DEMO', target_type:'infrastructure', relationship_type:'infrastructure reuse', confidence:91, evidence_id:ev[2].id },
  ]);
  if (relationshipError) throw new Error(relationshipError.message);
  const { error: timelineError } = await supabase.from('timeline_events').insert([
    { investigation_id:invId, event_at:new Date(now.getTime()-86400000*6).toISOString(), event_type:'Alias first observed', title:'Alias first observed', description:'Synthetic alias observation created.', confidence:82, evidence_id:ev[0].id },
    { investigation_id:invId, event_at:new Date(now.getTime()-86400000*5).toISOString(), event_type:'PGP association', title:'PGP fingerprint associated', description:'Synthetic PGP relationship created.', confidence:96, evidence_id:ev[1].id },
    { investigation_id:invId, event_at:new Date(now.getTime()-86400000*3).toISOString(), event_type:'Infrastructure transition', title:'Infrastructure transition detected', description:'Synthetic infrastructure transition created.', confidence:91, evidence_id:ev[2].id },
    { investigation_id:invId, event_at:new Date(now.getTime()-86400000).toISOString(), event_type:'Contradiction flagged', title:'Contradictory timezone signal flagged', description:'Synthetic contradiction requires analyst review.', confidence:41, evidence_id:ev[3].id },
  ]);
  if (timelineError) throw new Error(timelineError.message);
  return caseId;
}

export async function getDatabaseCounts() {
  const tables = ['investigations','actors','evidence','signals','relationships','timeline_events'] as const;
  const entries = await Promise.all(tables.map(async table => {
    const { count, error } = await supabase.from(table).select('*', { count:'exact', head:true });
    if (error) throw new Error(error.message);
    return [table, count ?? 0] as const;
  }));
  return Object.fromEntries(entries) as Record<string, number>;
}