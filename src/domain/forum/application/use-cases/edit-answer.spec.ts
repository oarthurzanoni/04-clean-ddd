import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let answersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository
    );
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await answersRepository.create(newAnswer);

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      answerId: "answer-1",
      authorId: "author-1",
      content: "Conteúdo teste",
      attachmentIds: ["1", "3"],
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID("1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID("3"),
      }),
    ]);
  });

  it("should not be able to edit a answer from a diffent author", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await answersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: "answer-2",
      authorId: "author-1",
      content: "Conteúdo teste",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
