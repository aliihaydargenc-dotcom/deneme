const VERSION_KEY = 'uvero_app_version';

/**
 * Fetches version.json from the active Vite base path, bypassing all caches,
 * and compares it with the version stored in localStorage. If a newer version
 * is detected, all Service Worker caches are cleared and the page is reloaded.
 *
 * @returns {Promise<boolean>} true when the app should continue loading,
 *   false when a reload has been triggered.
 */
export async function checkVersion() {
    try {
        const versionUrl = `${import.meta.env.BASE_URL}version.json`;
        const response = await fetch(versionUrl, { cache: 'no-store' });
        if (!response.ok) return true;

        const { version } = await response.json();
        const storedVersion = localStorage.getItem(VERSION_KEY);

        if (storedVersion && storedVersion !== version) {
            localStorage.setItem(VERSION_KEY, version);

            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map((name) => caches.delete(name)));
            }

            window.location.reload();
            return false;
        }

        localStorage.setItem(VERSION_KEY, version);
        return true;
    } catch {
        return true;
    }
}
