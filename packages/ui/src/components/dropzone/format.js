/**
 * Dropzone helpers — upstream dropzone.tsx's pure file utilities
 * (formatBytes, matchesAccept, describeLimits, iconFor). A "file" here is
 * the plain object the mini program can carry: { name, size, type, path }.
 */

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 10 || Number.isInteger(v) ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

export const tokensOf = (accept) =>
  (typeof accept === 'string' ? accept.split(',') : Array.isArray(accept) ? accept : [])
    .map((t) => String(t).trim())
    .filter(Boolean);

export function matchesAccept(file, accept) {
  const tokens = tokensOf(accept).map((t) => t.toLowerCase());
  if (tokens.length === 0) return true;
  const name = String(file.name || '').toLowerCase();
  const type = String(file.type || '').toLowerCase();
  return tokens.some((t) =>
    t.startsWith('.') ? name.endsWith(t) : t.endsWith('/*') ? type.startsWith(t.slice(0, -1)) : type === t
  );
}

export const sameFile = (a, b) =>
  a.name === b.name && a.size === b.size && (a.time || 0) === (b.time || 0);

export function describeLimits(o) {
  const tokens = tokensOf(o.accept);
  const kinds = tokens.map((t) => {
    if (t.startsWith('.')) return t.slice(1).toUpperCase();
    if (t === 'image/*') return 'Images';
    if (t === 'video/*') return 'Videos';
    if (t === 'audio/*') return 'Audio';
    if (t === 'text/*') return 'Text files';
    const sub = t.split('/')[1];
    return sub && sub !== '*' ? sub.toUpperCase() : t;
  });
  const parts = [];
  if (kinds.length) parts.push(kinds.join(', '));
  if (o.maxSize)
    parts.push(`${parts.length ? 'up to' : 'Up to'} ${formatBytes(o.maxSize)}${o.multiple === false ? '' : ' each'}`);
  if (o.maxFiles && o.multiple !== false)
    parts.push(`${parts.length ? 'at most' : 'At most'} ${o.maxFiles} file${o.maxFiles === 1 ? '' : 's'}`);
  return parts.join(' ');
}

export const iconFor = (file) =>
  String(file.type || '').startsWith('image/')
    ? 'image'
    : /pdf|text|word|document/.test(String(file.type || ''))
      ? 'file-text'
      : /zip|compressed|tar/.test(String(file.type || ''))
        ? 'archive'
        : 'file';
