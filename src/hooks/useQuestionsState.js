import { useState } from "react";

export default function useQuestionsState(initialQuestions = []) {
  const [questions, setQuestions] = useState(initialQuestions);

  function resetQuestions(nextQuestions = []) {
    setQuestions(nextQuestions);
  }

  function addQuestion(type) {
    const base = {
      id: Date.now() + Math.random(),
      type,
      question: "",
      description: "",
      isRequired: type === "radio" || false,
      options: [],
    };
    if (type === "radio") {
      base.options = ["Yes", "No"];
      base.deduction = 0;
    }
    if (type === "checkbox") {
      base.options = [{ label: "", deduction: 0, icon: "" }];
    }
    if (type === "dropdown") {
      base.options = ["New Option"];
      base.deduction = 0;
    }
    setQuestions((prev) => [...prev, base]);
  }

  function updateQuestion(questionIndex, key, value) {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex ? { ...question, [key]: value } : question,
      ),
    );
  }

  function removeQuestion(questionIndex) {
    setQuestions((prev) => prev.filter((_, i) => i !== questionIndex));
  }

  function addOption(questionIndex) {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex) return question;
        const option =
          question.type === "radio" || question.type === "dropdown"
            ? "New Option"
            : { label: "", deduction: 0, icon: "" };
        return { ...question, options: [...question.options, option] };
      }),
    );
  }

  function updateOption(questionIndex, optionIndex, key, value) {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex) return question;
        const options = question.options.map((option, j) => {
          if (j !== optionIndex) return option;
          if (question.type === "radio" || question.type === "dropdown") {
            return value;
          }
          return { ...option, [key]: value };
        });
        return { ...question, options };
      }),
    );
  }

  function removeOption(questionIndex, optionIndex) {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex) return question;
        const options = question.options.filter((_, j) => j !== optionIndex);
        return { ...question, options: options.length ? options : question.options };
      }),
    );
  }

  return {
    questions,
    resetQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
  };
}
