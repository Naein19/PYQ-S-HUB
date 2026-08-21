'use client';

import { useEffect } from 'react';

const RELOAD_FLAG = 'pyqs-chunk-reload';

function isChunkLoadError(message: unknown): boolean {
    return typeof message === 'string' && /Loading chunk [\w-]+ failed|ChunkLoadError/i.test(message);
}

/**
 * After a new deploy, a tab left open still references old content-hashed
 * chunk filenames that no longer exist on the server, so any code-split
 * import 404s. Reload once (session-guarded to avoid a refresh loop) to
 * pick up the new build instead of leaving the user on a broken page.
 */
export default function ChunkErrorHandler() {
    useEffect(() => {
        const reloadOnce = () => {
            if (sessionStorage.getItem(RELOAD_FLAG)) return;
            sessionStorage.setItem(RELOAD_FLAG, '1');
            window.location.reload();
        };

        const onError = (event: ErrorEvent) => {
            if (isChunkLoadError(event.message)) reloadOnce();
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            if (isChunkLoadError(event.reason?.message ?? event.reason)) reloadOnce();
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);

    return null;
}
