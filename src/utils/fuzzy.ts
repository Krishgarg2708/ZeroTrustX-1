/**
 * Small subsequence matcher for the command palette.
 *
 * Substring matching (`.includes`) is too strict for a palette — nobody types
 * "Hardware FIDO2 Key" in full, they type "fido". Full fuzzy libraries are
 * overkill for a few hundred local rows, so this is a scored subsequence
 * match that rewards the three things that actually correlate with intent:
 *
 *   - consecutive runs (typing "poli" beats p-o-l-i scattered across a string)
 *   - matches at the start of a word (acronyms: "dt" finds "Device Trust")
 *   - short haystacks (an exact-ish hit on a short label outranks a buried
 *     hit in a long description)
 */

export interface FuzzyResult {
  score: number;
  /** Indices in the haystack that matched, for highlighting. */
  matches: number[];
}

const isBoundary = (s: string, i: number) => {
  if (i === 0) return true;
  const prev = s[i - 1];
  return prev === ' ' || prev === '-' || prev === '_' || prev === '.' || prev === '/' || prev === '@';
};

export const fuzzyMatch = (needle: string, haystack: string): FuzzyResult | null => {
  if (!needle) return { score: 0, matches: [] };

  const n = needle.toLowerCase();
  const h = haystack.toLowerCase();

  // Cheap exits that also give the best scores.
  if (h === n) return { score: 1000, matches: [...Array(h.length).keys()] };

  const direct = h.indexOf(n);
  if (direct !== -1) {
    const base = 500 - direct * 2 + (isBoundary(h, direct) ? 60 : 0);
    return {
      score: base - haystack.length * 0.2,
      matches: Array.from({ length: n.length }, (_, k) => direct + k),
    };
  }

  // Subsequence walk.
  const matches: number[] = [];
  let score = 0;
  let hi = 0;
  let run = 0;

  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni];
    let found = -1;
    while (hi < h.length) {
      if (h[hi] === ch) {
        found = hi;
        break;
      }
      hi++;
    }
    if (found === -1) return null;

    matches.push(found);
    score += 10;
    if (isBoundary(h, found)) score += 18;
    // Consecutive characters are worth progressively more.
    run = matches.length > 1 && found === matches[matches.length - 2] + 1 ? run + 1 : 0;
    score += run * 12;
    hi = found + 1;
  }

  // Penalise long haystacks and matches that start late.
  score -= haystack.length * 0.25;
  score -= matches[0] * 0.6;

  return { score, matches };
};

/**
 * Best score across several fields, so a row can be found by any of its
 * attributes while still being ranked by its strongest one.
 */
export const fuzzyScoreFields = (needle: string, fields: string[]): number | null => {
  let best: number | null = null;
  for (const f of fields) {
    const r = fuzzyMatch(needle, f);
    if (r && (best === null || r.score > best)) best = r.score;
  }
  return best;
};

/** Splits a label into matched / unmatched runs for rendering. */
export const highlightSegments = (
  text: string,
  needle: string
): { text: string; hit: boolean }[] => {
  const r = needle ? fuzzyMatch(needle, text) : null;
  if (!r || !r.matches.length) return [{ text, hit: false }];

  const hits = new Set(r.matches);
  const out: { text: string; hit: boolean }[] = [];
  let buffer = '';
  let bufferHit = hits.has(0);

  for (let i = 0; i < text.length; i++) {
    const hit = hits.has(i);
    if (hit !== bufferHit) {
      if (buffer) out.push({ text: buffer, hit: bufferHit });
      buffer = '';
      bufferHit = hit;
    }
    buffer += text[i];
  }
  if (buffer) out.push({ text: buffer, hit: bufferHit });
  return out;
};
