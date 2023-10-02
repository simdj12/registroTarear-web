import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';

interface AlertOptions {
    title: string,
    text?: string,
    cancelButton?: boolean,
    cancelButtonText?: string
    confirmButtonText?: string,
    showConfirmButton?: boolean,
    icon: SweetAlertIcon,
    html?: string,
}

export function globalAlert(options: AlertOptions) {
    return Swal.fire({
        html: options.html,
        title: options.title,
        text: options.text,
        icon: options.icon,
        confirmButtonColor: 'rgb(39,73,139,1)',
        showConfirmButton: options.showConfirmButton == null ? true : options.showConfirmButton,
        confirmButtonText: options.confirmButtonText == null ? 'Aceptar' : options.confirmButtonText,
        showCancelButton: options.cancelButton,
        cancelButtonText: options.cancelButtonText,
        cancelButtonColor: '#f44336',
        heightAuto: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}