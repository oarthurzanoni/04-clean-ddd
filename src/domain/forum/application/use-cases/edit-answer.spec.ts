import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";

let answersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(answersRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await answersRepository.create(newAnswer);

    await sut.execute({
      answerId: "answer-1",
      authorId: "author-1",
      content: "Conteúdo teste",
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });
  });

  it("should not be able to edit a answer from a diffent author", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await answersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        answerId: "answer-2",
        authorId: "author-1",
        content: "Conteúdo teste",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
