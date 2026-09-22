import { Question } from "../models/Question.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswer, subjects, difficulties } =
    req.body;
  if (
    !questionText ||
    !options ||
    !correctAnswer ||
    !subjects ||
    !difficulties
  ) {
    throw new ApiError(401, "all fields are require");
  }
  if (!Array.isArray(options) || options.length !== 4) {
    throw new ApiError(400, "options array m nhi h ");
  }

  if (!options.includes(correctAnswer)) {
    throw new ApiError(404, "correct answer h hi nhi isme ");
  }
  const question = await Question.create({
    questionText,
    options,
    correctAnswer,
    subjects,
    difficulties,
  });

  if (!question) {
    throw new ApiError(404, "question nhi bna");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, question, "questions bn gya"));
});

const generateMockTest = asyncHandler(async (req, res) => {
  const questions = await Question.aggregate([
    {
      $facet: {
        dsaQuestions: [
          { $match: { subject: "DSA" } },
          { $sample: { size: 15 } },
          { $project: { correctAnswer: 0 } },
        ],
        osQuestion: [
          { $match: { subject: "OS" } },
          { $sample: { size: 15 } },
          { $project: { correctAnswer: 0 } },
        ],
        aptiQuestion: [
          { $match: { subject: "APTI" } },
          { $sample: { size: 20 } },
          { $project: { correctAnswer: 0 } },
        ],
        dbmsQuestion: [
          { $match: { subject: "DBMS" } },
          { $sample: { size: 10 } },
          { $project: { correctAnswer: 0 } },
        ],
        coaQuestion: [
          { $match: { subject: "COA" } },
          { $sample: { size: 10 } },
          { $project: { correctAnswer: 0 } },
        ],
        oopsQuestion: [
          { $match: { subject: "OOPS" } },
          { $sample: { size: 10 } },
          { $project: { correctAnswer: 0 } },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Mocktest are ready"));
});

const submitTest = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    throw new ApiError(400, "invalid submission data");
  }
  const arrayofIds = answers.map((answer) => answer.questionId);
  const answerkey = await Question.find({
    _id: { $in: arrayofIds },
  });
  if (!answerkey) {
    throw new ApiError(404, "there is no id like this");
  }

  let totalScore = 0;
  let correctAnswer = 0;
  let incorrectAnswer = 0;
  let unattempted = 0;

  answers.forEach((studentAnswer) => {
    const actualQuestion = answerkey.find(
      (q) => q._id.toString() === studentAnswer.questionId,
    );

    if (!actualQuestion) return;

    if (!studentAnswer.selectedOption) {
      unattempted++;
    } else if (studentAnswer.selectedOption === actualQuestion.correctAnswer) {
      totalScore += 4;
      correctAnswer++;
    } else {
      totalScore -= 1;
      incorrectAnswer++;
    }
  });

  const resultLoad = {
    totalScore,
    correctAnswer,
    incorrectAnswer,
    unattempted,
    totalQuestions: answers.length,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, resultLoad, "test graded succesfully"));
});

export { createQuestion, 
generateMockTest,
submitTest,
};
