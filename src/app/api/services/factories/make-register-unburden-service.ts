import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { PrismaCommentRepository } from "@/app/api/repositories/comment/prisma-comment.repository";
import { RegisterUnburdenService } from "../register-unburden.service";

export function makeRegisterUnburdenService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const commentRepository = new PrismaCommentRepository();
  const usecase = new RegisterUnburdenService(
    unburdenRepository,
    commentRepository
  );

  return usecase;
}
