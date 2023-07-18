import { expect, test } from "vitest";
import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  },
};

test("create an answer", async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

  const answer = await answerQuestion.execute({
    content: "Nova resposta",
    instructorId: "1",
    questionId: "1",
  });

  expect(answer.content).toEqual("Nova resposta");
  expect(answer).toEqual(
    expect.objectContaining({
      id: expect.any(String),
    })
  );
});
