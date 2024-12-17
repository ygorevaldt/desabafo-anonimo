import { NextRequest, NextResponse } from "next/server";
import { makeRegisterCommentService } from "@/app/api/services/factories/make-register-comment-service";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { registerCommentBodySchema } from "../schemas/register-comment-body.schema";
import { HttpStatusCode } from "../../constants/http-status-code";
import { CommentResponseDto } from "../dtos/comment-response.dto";
import { fetchCommentsParamsSchema } from "../schemas/fetch-comments-params.schema";
import { makeListCommentService } from "../../services/factories/make-list-comment-service";

export async function POST(request: NextRequest) {
  const registerCommentService = makeRegisterCommentService();

  try {
    const requestBodyJson = await request.json();
    const body = registerCommentBodySchema.parse(requestBodyJson);

    const { comment } = await registerCommentService.execute({
      unburdenId: body.unburden_id,
      content: body.content,
    });

    const response = new CommentResponseDto(comment);
    return NextResponse.json(response, {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function GET(request: NextRequest) {
  const listCommentService = makeListCommentService();

  try {
    const { searchParams } = request.nextUrl;

    const params = fetchCommentsParamsSchema.parse({
      unburden_id: searchParams.get("unburden_id"),
    });

    const response = await listCommentService.execute({
      unburdenId: params.unburden_id,
    });

    const comments = response.comments.map(
      (comment) => new CommentResponseDto(comment),
    );

    return NextResponse.json({ comments });
  } catch (error) {
    return handleRequestError(error);
  }
}
