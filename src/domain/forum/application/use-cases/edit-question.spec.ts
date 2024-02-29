import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";

let questionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(questionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    await questionsRepository.create(newQuestion);

    await sut.execute({
      questionId: "question-1",
      authorId: "author-1",
      content: "Conteúdo teste",
      title: "Pergunta teste",
    });

    expect(questionsRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
      title: "Pergunta teste",
    });
  });

  it("should not be able to edit a question from a diffent author", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    await questionsRepository.create(newQuestion);

    expect(() => {
      return sut.execute({
        questionId: "question-2",
        authorId: "author-1",
        content: "Conteúdo teste",
        title: "Pergunta teste",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
