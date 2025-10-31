const storageKey = (key: string) => `onboarding.v1.${key}`;

export function markOnboardingSeen(key: string) {
  try {
    localStorage.setItem(storageKey(key), "seen");
  } catch {}
}

export function hasOnboardingSeen(key: string): boolean {
  try {
    return localStorage.getItem(storageKey(key)) === "seen";
  } catch {
    return false;
  }
}

export function clearOnboarding(key: string) {
  try {
    localStorage.removeItem(storageKey(key));
  } catch {}
}


