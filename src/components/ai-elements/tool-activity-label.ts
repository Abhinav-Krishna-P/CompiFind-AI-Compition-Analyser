export type ToolActivityPart = {
  readonly type: string
  readonly state: string
  readonly input?: unknown
  readonly toolName?: string
}

type ToolActivityCopy = {
  active: (input: unknown) => string
  settled: (input: unknown) => string
  failed: (input: unknown) => string
}

function readString(input: unknown, key: string): string | null {
  if (typeof input !== 'object' || input === null) {
    return null
  }

  const value = (input as Record<string, unknown>)[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function basename(path: string | null): string | null {
  if (path === null) {
    return null
  }

  const trimmed = path.replace(/\/+$/u, '')
  const name = trimmed.split('/').pop()
  return name && name.length > 0 ? name : null
}

function compactAndTruncate(value: string | null, maxLength: number): string | null {
  if (value === null) {
    return null
  }

  const compact = value.replace(/\s+/gu, ' ').trim()
  if (compact.length === 0) {
    return null
  }

  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1)}…` : compact
}

function hostname(value: string | null): string | null {
  if (value === null) {
    return null
  }

  try {
    const host = new URL(value).hostname.replace(/^www\./u, '')
    return host.length > 0 ? host : null
  } catch {
    return null
  }
}

const fileName = (input: unknown) => basename(readString(input, 'file_path'))
const pattern = (input: unknown) => compactAndTruncate(readString(input, 'pattern'), 40)
const query = (input: unknown) => compactAndTruncate(readString(input, 'query'), 40)
const page = (input: unknown) => hostname(readString(input, 'url'))

function bashActivity(input: unknown): string | null {
  return readString(input, 'description') ?? compactAndTruncate(readString(input, 'command'), 48)
}

function skillActivity(input: unknown, verb: 'Reading' | 'Read'): string {
  const skill = readString(input, 'skill')
  const path = basename(readString(input, 'path'))
  if (path !== null) {
    return `${verb} ${path} from ${skill === null ? 'a skill' : `the ${skill} skill`}`
  }

  return `${verb} up on ${skill ?? 'a skill'}`
}

const TOOL_ACTIVITY_COPY: Readonly<Record<string, ToolActivityCopy>> = {
  Bash: {
    active: (input) => bashActivity(input) ?? 'Running a command',
    settled: (input) => {
      const activity = bashActivity(input)
      return activity === null ? 'Finished running a command' : `Finished: ${activity}`
    },
    failed: (input) => {
      const activity = bashActivity(input)
      return activity === null ? 'A command failed' : `Failed: ${activity}`
    },
  },
  Read: {
    active: (input) => `Reading ${fileName(input) ?? 'a file'}`,
    settled: (input) => `Read ${fileName(input) ?? 'a file'}`,
    failed: () => 'Couldn’t read a file',
  },
  Write: {
    active: (input) => `Writing ${fileName(input) ?? 'a file'}`,
    settled: (input) => `Wrote ${fileName(input) ?? 'a file'}`,
    failed: () => 'Couldn’t write a file',
  },
  Edit: {
    active: (input) => `Editing ${fileName(input) ?? 'a file'}`,
    settled: (input) => `Edited ${fileName(input) ?? 'a file'}`,
    failed: () => 'Couldn’t edit a file',
  },
  Grep: {
    active: () => 'Searching the code',
    settled: (input) => {
      const value = pattern(input)
      return value === null ? 'Searched the code' : `Searched the code for ${value}`
    },
    failed: () => 'Couldn’t search the code',
  },
  Glob: {
    active: () => 'Looking through the files',
    settled: (input) => {
      const value = pattern(input)
      return value === null ? 'Looked through files' : `Looked through files matching ${value}`
    },
    failed: () => 'Couldn’t look through the files',
  },
  WebSearch: {
    active: (input) => {
      const value = query(input)
      return value === null ? 'Searching the web' : `Searching the web for ${value}`
    },
    settled: (input) => {
      const value = query(input)
      return value === null ? 'Searched the web' : `Searched the web for ${value}`
    },
    failed: () => 'The web search failed',
  },
  WebFetch: {
    active: (input) => `Reading ${page(input) ?? 'a page'}`,
    settled: (input) => `Read ${page(input) ?? 'a page'}`,
    failed: () => 'Couldn’t read the page',
  },
  skill: {
    active: (input) => skillActivity(input, 'Reading'),
    settled: (input) => skillActivity(input, 'Read'),
    failed: (input) => {
      const skill = readString(input, 'skill')
      return skill === null ? 'Couldn’t load a skill' : `Couldn’t load the ${skill} skill`
    },
  },
}

function toolName(part: ToolActivityPart): string {
  if (part.type === 'dynamic-tool') {
    return part.toolName ?? part.type
  }

  return part.type.startsWith('tool-') ? part.type.slice('tool-'.length) : part.type
}

export function toolActivityLabel(part: ToolActivityPart): string {
  const name = toolName(part)
  const copy = Object.hasOwn(TOOL_ACTIVITY_COPY, name) ? TOOL_ACTIVITY_COPY[name] : undefined
  if (copy === undefined) {
    return name
  }

  if (part.state === 'output-available') {
    return copy.settled(part.input)
  }

  if (part.state === 'output-error') {
    return copy.failed(part.input)
  }

  return copy.active(part.input)
}
