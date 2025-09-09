import { AthQuestion } from "./ath-question.interface";

export interface AthForm {
    id?: string;
    formId?: string;
    created_at?: Date;
    updated_at?: Date | null;
    uuid?: string;
    title?: string;
    role?: string;
    time?: number;
    order?: number;
    responder?: string;
    enviaments_patient?: number[];
    enviaments_familiar?: number[];
    questions?: AthQuestion[];
    score_type?: string;
    scores_codes?: ScoresCodes;
    scores_codes_questions?: ScoresCodesQuestion[];
    
}

export interface ScoreRange {
    min: number | null,
    max: number | null
}
export interface ScoresCodes {
    green?: ScoreRange,
    orange?: ScoreRange,
    red?: ScoreRange
}

export interface ScoresCodesQuestion {
    name?: string | null;
    id?: string | null;
    score_codes?: ScoresCodes | null;
}


