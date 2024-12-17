import { PrismaCommentRepository } from "@/app/api/repositories/comment/prisma-comment.repository";
import { ListCommentService } from "../list-comment.service";

export function makeListCommentService() {
  const commentRepository = new PrismaCommentRepository();
  const service = new ListCommentService(commentRepository);

  return service;
}
