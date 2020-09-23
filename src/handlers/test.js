let data = [
  {
    responseOption: [
      {
        id: "4f1c55d7-5048-4bd7-929e-64038396fa5d",
        text: "Yes",
      },
      {
        id: "0dc50919-0c9d-44e2-b311-a4adf365b36b",
        text: "No",
      },
    ],
    questionType: "SINGLE-CHOICE",
    statusActive: true,
    sequenceNumber: 2,
    questionText: "Are you a vegetarian?",
    questionId: "e6479923-c02e-4a21-85d8-9e204670f44d",
  },
  {
    responseOption: [
      {
        id: "3b223899-46b6-4003-9dc6-50a11570f24e",
        text: "Red",
      },
      {
        id: "995c717f-6c93-4306-bdd7-6a03525c9fb3",
        text: "Blue",
      },
      {
        id: "340666cf-24eb-4b47-8d0f-83d3595bfee6",
        text: "Green",
      },
      {
        id: "7c5abd90-5c61-4b73-a4a2-eb0a977be899",
        text: "Other",
      },
    ],
    questionType: "SINGLE-CHOICE",
    statusActive: true,
    sequenceNumber: 1,
    questionText: "What is your favorite color?",
    questionId: "eee9b5f7-8abd-4973-8a11-1b09701f423e",
  },
  {
    responseOption: [
      {
        id: "857bfe26-a35d-46b3-b56d-310bdb08b1d1",
        text: "Florida",
      },
      {
        id: "e6a873e7-afa6-45ed-b6da-c8748f7422d7",
        text: "Indiana",
      },
      {
        id: "4b7243c9-508b-4ffb-95b4-5f220aebe1af",
        text: "Alaska",
      },
      {
        id: "bbb6b732-e4cb-4693-b8d3-eb1e90a0a168",
        text: "Arizona",
      },
      {
        id: "e35a9e92-515d-459c-820c-121b507e4482",
        text: "Delaware",
      },
      {
        id: "323e7bad-8788-4441-bcb3-76e2e924cb23",
        text: "Other",
      },
    ],
    questionType: "DROPDOWN",
    statusActive: true,
    sequenceNumber: 4,
    questionText: "Which state you live in?",
    questionId: "a77bf84c-1b54-4017-b0f5-0f21ad169abc",
  },
  {
    responseOption: [
      {
        id: "2dc31217-bcd0-44f7-b717-2fcf3a75fd17",
        text: "Piza",
      },
      {
        id: "5a038b66-e266-44ae-a6ba-ad8621810449",
        text: "Burger",
      },
      {
        id: "459fbd27-02be-4f39-ad24-779e90ee127a",
        text: "Pasta",
      },
      {
        id: "118f9494-9da1-452a-a702-d719cf378960",
        text: "Other",
      },
    ],
    questionType: "MULTIPLE-CHOICE",
    statusActive: true,
    sequenceNumber: 3,
    questionText: "What are your favorite foods?",
    questionId: "4cd41336-c8df-4841-89a1-3ac437030e94",
  },
  {
    questionType: "INPUT",
    statusActive: true,
    sequenceNumber: 5,
    questionText: "What is your spouse's name?",
    questionId: "273c4e68-308e-4534-afac-1f4cd5ca4bcb",
    textSize: 50,
  },
];

function findSequence(id) {
  let question;
  question = data.find((question) => question.sequenceNumber === id);

  return question;
}

console.log(findSequence(5));

import React, { useState } from "react";

export default function App() {
  const questions = async () => {
    try {
      //const response = await fetch(url);
      const jsonQuestions = await axios(url);
      //const jsonQuestions = await response.json();
      console.log(jsonQuestions.data);

      //setQuestionsData(jsonQuestions.data);
      return jsonQuestions;
    } catch (error) {
      console.log("error:", error);
    }
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };
  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].questionText}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answerOptions.map((answerOption) => (
              <button
                onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
