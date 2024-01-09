import { makeQuestion } from "test/factories/makeQuestion";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository
    );
  });

  it("should be able to comment on a question", async () => {
    const question = makeQuestion();

    await questionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentário teste",
    });

    expect(questionCommentsRepository.items[0].content).toEqual(
      "Comentário teste"
    );
  });
});
