import type { OnMount } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import React, { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = "",
  language = "javascript",
  className,
}) => {
  const [code, setCode] = useState<string>(initialValue);
  const codeRef = useRef<string>(initialValue);
  const [result, setResult] = useState<string>("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);

  const runCode = () => {
    const codeToRun = codeRef.current;
    let logOutput = "";
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logOutput += args.map(String).join(" ") + "\n";
    };
    try {
      // eslint-disable-next-line no-eval
      const output = eval(codeToRun);
      let resultText = logOutput;
      if (output !== undefined) {
        resultText += (logOutput ? "\n" : "") + `Return: ${String(output)}`;
      }
      setResult(resultText.trim());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResult(
          (logOutput ? logOutput + "\n" : "") + "Error: " + err.message
        );
      } else {
        setResult((logOutput ? logOutput + "\n" : "") + "Unknown error");
      }
    } finally {
      console.log = originalLog;
    }
  };

  const handleEditorMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        console.log("Ctrl+Enter pressed in Monaco");
        runCode();
      }
    );
  };

  // Global fallback for Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        console.log("Ctrl+Enter pressed globally");
        runCode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [code]);

  return (
    <div
      className={`flex flex-grow flex-col w-full pb-16 ${className ?? ""}`}
      style={{ minHeight: 0 }}
    >
      <div className="flex-none">
        <MonacoEditor
          height="60vh"
          defaultLanguage={language}
          value={code}
          onChange={(val) => {
            setCode(val ?? "");
            codeRef.current = val ?? "";
          }}
          theme="vs-dark"
          options={{ fontSize: 16, minimap: { enabled: false } }}
          onMount={handleEditorMount}
        />
      </div>
      <div className="flex-1 overflow-auto bg-stone-900 text-white p-2 rounded w-full mt-2">
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Press <b>Ctrl + Enter</b> to run your code
      </div>
    </div>
  );
};

export default CodeEditor;
