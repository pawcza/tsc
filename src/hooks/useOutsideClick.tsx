import {MutableRefObject, useEffect} from "react";

const useOutsideClick = (ref: MutableRefObject<HTMLElement | undefined>) => {
    const handleWindowClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleWindowClick);

        return () => {
            document.removeEventListener("mousedown", handleWindowClick);
        };
    }, [ref]);
};

export default useOutsideClick;
