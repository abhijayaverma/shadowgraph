import { useCallback, useEffect, useState } from 'react';
import { getActors, getEvidence, getInvestigation, getRelationships, getSignals, getTimelineEvents } from '../lib/shadowgraph';
import type { Actor, Evidence, Investigation, Relationship, Signal, TimelineEvent } from '../types/shadowgraph';

export function useInvestigation(caseId = 'CASE-2026-0042') {
  const [investigation, setInvestigation] = useState<Investigation | null>(null); const [actor, setActor] = useState<Actor | null>(null); const [evidence, setEvidence] = useState<Evidence[]>([]); const [signals, setSignals] = useState<Signal[]>([]); const [relationships, setRelationships] = useState<Relationship[]>([]); const [timeline, setTimeline] = useState<TimelineEvent[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const refetch = useCallback(async () => { setLoading(true); setError(null); try { const item = await getInvestigation(caseId); if (!item) throw new Error(`Investigation ${caseId} was not found.`); const [actors, nextEvidence, nextSignals, nextRelationships, nextTimeline] = await Promise.all([getActors(item.id), getEvidence(item.id), getSignals(item.id), getRelationships(item.id), getTimelineEvents(item.id)]); setInvestigation(item); setActor(actors[0] ?? null); setEvidence(nextEvidence); setSignals(nextSignals); setRelationships(nextRelationships); setTimeline(nextTimeline); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load investigation data.'); } finally { setLoading(false); } }, [caseId]);
  useEffect(() => { void refetch(); }, [refetch]); return { investigation, actor, evidence, signals, relationships, timeline, loading, error, refetch };
}
