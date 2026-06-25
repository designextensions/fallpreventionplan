// Lightweight client-side module completion tracking. There is no per-user
// progress table on the backend yet, so we persist completion locally. This is
// enough to wire the "Mark as Complete" button, show real progress on the
// dashboard, and resume at the first incomplete module.

const KEY = "fpp.completed";

export function getCompleted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function isModuleComplete(slug: string): boolean {
  return getCompleted().has(slug);
}

export function setModuleComplete(slug: string, done: boolean): void {
  if (typeof window === "undefined") return;
  const set = getCompleted();
  if (done) set.add(slug);
  else set.delete(slug);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    // Notify same-tab listeners (the storage event only fires across tabs).
    window.dispatchEvent(new CustomEvent("fpp:progress"));
  } catch {
    // ignore
  }
}
