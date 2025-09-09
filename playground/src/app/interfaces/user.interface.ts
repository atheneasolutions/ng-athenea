import { Familiar } from "./familiar.interface";

export interface User {
    id?: string;
    added_at?: Date;
    logged_out_at?: Date | null;
    last_connection?: Date;
    password?: string;
    name?: string;
    surname?: string;
    dateborn?: Date;
    sex?: string; 
    dateuci?: Date;
    uuid?: string;
    typeuuid?: string;
    validated_at?: Date | null;
    lang?: Language;
    familiars?: Familiar[];
    hospital?: string;
    commethod?: string;
    typecommethod?: string;
    validatedby?: string;
    active?: boolean;
    hasapp?: boolean;
    wantapp?: boolean;
    idstudy?: string;
    ventilacion?: string;
    delirium?: string;
    escolaridad?: string;
}
export class Language {
    type?: string;
    value?: string;
}
  