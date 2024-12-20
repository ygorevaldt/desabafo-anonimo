import axios from "axios";

export async function fetchUnburdenComments(unburdenId: string) {
  const response = await axios.get(`/api/v1/comment`, {
    params: {
      unburden_id: unburdenId,
    },
    withCredentials: true,
  });

  const { comments } = response.data;
  return comments;
}
