import axios from "axios";

export async function generateIaSupportMessage(unburden: string) {
  const response = await axios({
    method: "POST",
    url: "/api/v1/ia-support",
    data: {
      content: unburden,
    },
  });
  const { support_message } = response.data;
  return support_message;
}
