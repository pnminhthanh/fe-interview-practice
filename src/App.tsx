import { useState } from "react";
import "./App.css";
import CodeEditor from "./components/CodeEditor";
import ListQuestion from "./components/ListQuestion";
import questions from "./data/questions.json";

interface Question {
  id: number;
  question: string;
  difficulty: string;
}

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    questions[0]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: List of Questions */}
      <ListQuestion
        questions={questions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
      />
      {/* Right: Code Editor */}
      <div className="w-3/4 h-screen flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-2">
          {selectedQuestion?.question}
        </h2>
        <div className="flex-1 flex flex-col min-h-0">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default App;
