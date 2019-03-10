import React, { useEffect } from 'react';

function usePageVisibility(onHidden: () => void, onVisible: () => void) {
    const visibilityChange = 'visibilitychange';

    function onVisibilityChange() {
        if (document.hidden) {
            onHidden();
        } else {
            onVisible();
        }
    }

    useEffect(() => {
        document.addEventListener(visibilityChange, () => onVisibilityChange());

        return function clean() {
            document.removeEventListener(visibilityChange, () => onVisibilityChange());
        };
    }, []);
}

export default usePageVisibility;
