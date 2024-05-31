import { useEffect, useState } from "react";

export const useDebouncedValue = (
    inputValue: string | undefined,
    timeOut: number = 200
) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, timeOut);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, timeOut]);

    return debouncedValue;
};
