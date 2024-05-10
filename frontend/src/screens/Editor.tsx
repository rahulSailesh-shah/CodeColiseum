import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useCodeStore, useSocketStore } from "../store";

export const EditorScreen = () => {
    const { setCode, code } = useCodeStore((state) => state);
    const socket = useSocketStore((state) => state.socket);

    const debouncedCode = useDebouncedValue(code);

    useEffect(() => {
        socket?.send(
            JSON.stringify({
                type: "code_change",
                payload: {
                    code: debouncedCode,
                },
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedCode]);

    const submitCode = () => {
        socket?.send(
            JSON.stringify({
                type: "code_submit",
                payload: {
                    code,
                    codeID: "93",
                },
            })
        );
    };

    const initContest = () => {
        console.log("Init contest");
        socket?.send(
            JSON.stringify({
                type: "init_contest",
            })
        );
    };

    return (
        <>
            <Editor
                options={{
                    minimap: {
                        enabled: false,
                    },
                }}
                height='75vh'
                theme='vs-dark'
                language='javascript'
                value={code}
                onChange={(value) => setCode(value)}
            />

            <Button onClick={submitCode}>Submit</Button>
            <Button onClick={initContest}>Start</Button>
        </>
    );
};
