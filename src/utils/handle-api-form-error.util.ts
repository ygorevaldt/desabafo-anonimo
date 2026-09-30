import axios from "axios";
import { errorAlert } from "./alert";

export type ApiFormErrorOptions = {
  unauthorizedMessage?: string;
  badRequestFallback?: string;
  defaultMessage?: string;
};

export function handleApiFormError(
  error: unknown,
  options: ApiFormErrorOptions = {},
): void {
  const {
    unauthorizedMessage = "Não foi possível publicar. O conteúdo viola as diretrizes de acolhimento e segurança.",
    badRequestFallback = "Preencha os campos corretamente.",
    defaultMessage = "Serviço temporariamente indisponível. Tente novamente em alguns minutos.",
  } = options;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      errorAlert(unauthorizedMessage);
      return;
    }

    if (status === 400) {
      const customMessage =
        error.response?.data?.issues?.[0]?.message ||
        error.response?.data?.message ||
        badRequestFallback;
      errorAlert(customMessage);
      return;
    }
  }

  errorAlert(defaultMessage);
  console.error("Erro na requisição da API:", error);
}
