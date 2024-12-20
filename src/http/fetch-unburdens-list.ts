import axios from "axios";

type FetchUnburdensListParams = {
  page: number;
  take?: number;
};

export async function fetchUnburdensList({
  page,
  take,
}: FetchUnburdensListParams) {
  const response = await axios.get(`/api/v1/unburden`, {
    withCredentials: true,
    params: { page },
  });

  return response.data;
}
