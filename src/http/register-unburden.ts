import axios from "axios";

type RegisterUnburdenParams = {
  title: string;
  content: string;
};

export async function registerUnburden(data: RegisterUnburdenParams) {
  const response = await axios({
    method: "POST",
    url: "/api/v1/unburden",
    data,
  });

  return response.data;
}
