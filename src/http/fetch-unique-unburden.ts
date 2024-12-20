import axios from "axios";

export async function fetchUniqueUnburden(unburdenId: string) {
  const response = await axios.get(`/api/v1/unburden/${unburdenId}`, {
    withCredentials: true,
  });
  const { unburden } = response.data;
  return unburden;
}
