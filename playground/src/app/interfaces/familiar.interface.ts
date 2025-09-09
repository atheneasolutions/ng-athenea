


export interface Familiar {
    namefamiliar?: string;
    surnamefamiliar?: string;
    langfamiliar?: Language;
    password?: string;
    validated_at?: Date | null;
    dninie?: string;
    typedninie?: string;
    commethodfamiliar?: string;
    typecommethodfamiliar?: string;
    relationship?: Relationship;
    idstudy?: string;
    convive?: Convive;
    civilstate?: string;
    ocupacion?: Ocupacion;
    escolaridad?: string;
    dateborn?: Date;
    sex?: string;
}

export class Language {
    type?: string;
    value?: string;
}

export interface Relationship {
    type?: string;
    value?: string;
}

export interface Convive {
    type?: string;
    value?: string;
}

export interface Ocupacion {
    type?: string;
    value?: string;
}
  