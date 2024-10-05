// Methods for managing the LocalStorage.
// All values set by this app should have keys starting with a common prefix.
// This way these items don't interfere with items set by other apps.

const localStoragePrefix = "p5s-";

export function setLocalStorageItem(key: string, value: string): void {
    localStorage.setItem(localStoragePrefix + key, value);
}

export function getLocalStorageItem(key: string): string | null {
    return localStorage.getItem(localStoragePrefix + key);
}

export function removeLocalStorageItem(key: string): void {
    localStorage.removeItem(localStoragePrefix + key);
}

/**
 * The app should not call localStorage.clear() because that will delete everything,
 * including items that were set by other apps. It should only delete items with the correct prefix.
 */
export function clearLocalStorage(): void {
    Object.keys(localStorage)
        .filter((k) => k.startsWith(localStoragePrefix))
        .forEach((k) => localStorage.removeItem(k));
}
