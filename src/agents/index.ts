import type { AgentDefinition } from '@coldbrew/app-agents'

/* Declare each agent as an id-matching folder beside this file
   (definition.ts + prompt.ts, plus optional skills/<name>/SKILL.md or
   skills/<name>.md) and register it here. The id match is required when the
   folder carries skills. This array is the only registration point;
   payload.config.ts imports it and nothing else agent-related. */
export const agents: readonly AgentDefinition[] = []
