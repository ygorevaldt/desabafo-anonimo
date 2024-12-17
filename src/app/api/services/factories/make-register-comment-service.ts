import { PrismaCommentRepository } from "@/app/api/repositories/comment/prisma-comment.repository";
import { RegisterCommentService } from "@/app/api/services/register-comment.service";

export function makeRegisterCommentService() {
  const commentRepository = new PrismaCommentRepository();
  const service = new RegisterCommentService(commentRepository);

  return service;
}
