export const toNodeTreads = (text) =>
  text
    .trim()
    .split('\n')
    .map((line) =>
      line.match(/^(\S+)\s+(\d+)\s+(\S+)\s+(\d+)\s+([\d,]+)(?:\s*(\w+))?/),
    )
    .filter(Boolean)
    .map((match) => ({
      name: match[1],
      pid: parseInt(match[2]),
      session: match[3],
      sessionNum: parseInt(match[4]),
      memory: parseInt(match[5].replace(/,/g, '')),
      unit: match[6] || 'K',
    }))
