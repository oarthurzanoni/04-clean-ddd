import { makeQuestion } from "test/factories/makeQuestion";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlug } from "./get-question-by-slug";

let questionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlug;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlug(questionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
    });

    questionsRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: "example-question",
    });

    expect(question.id).toBeTruthy();
    expect(questionsRepository.items[0].id).toEqual(question.id);
  });
});
