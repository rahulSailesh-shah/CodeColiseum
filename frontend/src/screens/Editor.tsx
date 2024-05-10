import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export const EditorScreen = () => {
    const [code, setCode] = useState<string | undefined>("");
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const debouncedCode = useDebouncedValue(code);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setSocket(socket);
        socket.onopen = () => {
            console.log("Connected to server");
            socket?.send(
                JSON.stringify({
                    type: "init_contest",
                })
            );
        };
    }, []);

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
        console.log(code);
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
        </>
    );
};
