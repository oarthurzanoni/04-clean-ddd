import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswerssRequest {
  page: number;
  questionId: string;
}

interface FetchQuestionAnswerssResponse {
  answers: Answer[];
}

export class FetchQuestionAnswerssUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswerssRequest): Promise<FetchQuestionAnswerssResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return {
      answers,
    };
  }
}
