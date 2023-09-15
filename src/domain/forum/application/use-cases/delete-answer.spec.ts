import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/makeAnswer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";

let answersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(answersRepository);
  });

  it("should be able to delete a answer by id", async () => {
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
    });

    expect(answersRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from a diffent author", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await answersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        answerId: "answer-1",
        authorId: "author-2",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
