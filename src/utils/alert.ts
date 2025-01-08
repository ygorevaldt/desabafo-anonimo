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
