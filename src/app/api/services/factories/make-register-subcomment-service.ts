import { PrismaCommentRepository } from "@/app/api/repositories/comment/prisma-comment.repository";
import { RegisterSubcommentService } from "@/app/api/services/register-subcomment.service";

export function makeRegisterSubcommentService() {
  const commentRepository = new PrismaCommentRepository();
  const service = new RegisterSubcommentService(commentRepository);

  return service;
}
