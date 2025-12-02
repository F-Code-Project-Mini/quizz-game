import { useEffect, useState } from "react";

export function useIsLandscape() {
    const [isLandscape, setIsLandscape] = useState(() => {
        if (typeof window === "undefined") return true;
        return window.innerWidth > window.innerHeight;
    });

    useEffect(() => {
        function handleResize() {
            setIsLandscape(window.innerWidth > window.innerHeight);
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    return isLandscape;
}
