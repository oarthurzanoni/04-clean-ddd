import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository
    );
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    await questionsRepository.create(newQuestion);

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      questionId: "question-1",
      authorId: "author-1",
      content: "Conteúdo teste",
      title: "Pergunta teste",
      attachmentIds: ["1", "3"],
    });

    expect(questionsRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
      title: "Pergunta teste",
    });
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2
    );
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID("1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID("3"),
      }),
    ]);
  });

  it("should not be able to edit a question from a diffent author", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    await questionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-2",
      authorId: "author-1",
      content: "Conteúdo teste",
      title: "Pergunta teste",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
