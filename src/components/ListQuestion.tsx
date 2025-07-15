import React from "react";

interface Question {
  id: number;
  question: string;
  code?: string;
  difficulty: string;
}

interface ListQuestionProps {
  questions: Question[];
  selectedQuestion: Question | null;
  setSelectedQuestion: (q: Question) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "hard":
      return "text-orange-600";
    default:
      return "text-gray-500";
  }
};

const ListQuestion: React.FC<ListQuestionProps> = ({
  questions,
  selectedQuestion,
  setSelectedQuestion,
}) => {
  return (
    <div className="w-1/4 border-r p-4 overflow-y-auto bg-gray-50 h-screen">
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      <ul>
        {questions.map((q) => (
          <li
            key={q.id}
            className={`mb-2 p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedQuestion?.id === q.id ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setSelectedQuestion(q)}
          >
            {q.question}
            <span
              className={`ml-2 text-xs font-semibold ${getDifficultyColor(
                q.difficulty
              )}`}
            >
              [{q.difficulty}]
            </span>
            {q.code && (
              <div className="mt-2 font-mono text-xs text-gray-500 bg-gray-200 rounded px-1">
                [{q.code}]
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListQuestion;
