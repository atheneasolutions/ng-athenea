import { FormData } from "./formData.interface";

export interface Enviament {
    id?: string;
    enviament_date?: Date;
    password?: string;
    forms_data?: FormData;
    user_id?: string;
}


export interface CheckEnviament {
    enviamentId?: string;
    index?: number;
    password?: string;
    role?: string;
    expirated?: boolean;
}
  