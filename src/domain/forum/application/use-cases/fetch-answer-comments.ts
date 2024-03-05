import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsRequest {
  page: number;
  answerId: string;
}

interface FetchAnswerCommentsResponse {
  answerComments: AnswerComment[];
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return {
      answerComments,
    };
  }
}
