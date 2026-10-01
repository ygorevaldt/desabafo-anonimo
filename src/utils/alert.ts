import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    title: "notification-service-title",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export async function successAlert(message: string) {
  await toast.fire({
    icon: "success",
    title: message,
  });
}

export async function errorAlert(message: string) {
  await toast.fire({
    icon: "error",
    title: message,
  });
}

export async function infoAlert(message: string) {
  await toast.fire({
    icon: "info",
    title: message,
  });
}

export async function confirmReportAlert(): Promise<boolean> {
  const result = await Swal.fire({
    title: "Denunciar conteúdo?",
    text: "Se você acredita que este desabafo viola as regras da comunidade (ódio, ameaça, apologia a crimes), clique em confirmar.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f43f5e",
    cancelButtonColor: "#71717a",
    confirmButtonText: "Sim, denunciar",
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
}

export async function rateLimitAlert(retryAfterSeconds?: number) {
  const waitMessage = retryAfterSeconds
    ? `Aguarde ${retryAfterSeconds} segundos antes de tentar novamente.`
    : "Aguarde alguns instantes antes de tentar novamente.";

  await toast.fire({
    icon: "warning",
    title: `Muitas requisições. ${waitMessage}`,
    timer: 5000,
  });
}

export async function serviceUnavailableAlert() {
  await toast.fire({
    icon: "info",
    title:
      "O serviço está se estabilizando no momento. Tente novamente em instantes.",
    timer: 5000,
  });
}
