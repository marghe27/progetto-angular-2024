import { toastTypes } from "../services/toast.service";


export interface ToastData {
    title:string;
    content: string;
    show?:boolean;
    type?: toastTypes;
    progressWidth?: string;
    delay?: number;

}
