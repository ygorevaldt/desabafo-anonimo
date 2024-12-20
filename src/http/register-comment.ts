import axios from "axios";

type RegisterCommentParams = {
  unburden_id: string;
  content: string;
};

export async function registerComment(data: RegisterCommentParams) {
  const response = await axios({
    method: "POST",
    url: "/api/v1/comment",
    data,
  });

  return response.data;
}
