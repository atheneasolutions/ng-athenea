export class BaseConstants {

    DOSEU = {
        UI: 'UI',
        MG: 'MG',
        G: 'G',
        UND: 'UND'
    }

    PHFORM = {
        JER: 'JER',
        PLUMA: 'PLUMA',
        COMP: 'COMP',
        COMP_EFERV: 'COMP EFERV',
        PARCH: 'PARCH'
    }

    ACTIV_ID = {
        'pulsi_oximeter': 'TELEMED_1',
        'tensiometer': 'TELEMED_2',
        'thermometer': 'TELEMED_3',
        'pain-register': 'TELEMED_4',
        'glucometer': 'TELEMED_5',
        'scale': 'TELEMED_6',
        'fluids': 'TELEMED_7',
        'diuresis': 'TELEMED_8',
        'deposicions': 'TELEMED_9',
        'drainages': 'TELEMED_10',
        'consciencia': 'TELEMED_11'
    }

    TASKS_TYPE = {
        THERMOMETER: 'thermometer',
        SCALE: 'scale',
        TENSIOMETER: 'tensiometer',
        GLUCOMETER: 'glucometer',
        PULSI: 'pulsi_oximeter',
        PAIN_REGISTER: 'pain-register',
        FLUIDS: 'fluids',
        DEPOSITIONS: 'deposicions',
        DIURESIS: 'diuresis',
        DRAINAGES: 'drainages',
        MEDICATION: 'medication',
        CONSCIENCIA: 'consciencia'
    }

    OBS = {
        OXYGEN_SATURATION: "OXYGEN_SATURATION",
        HEART_RATE: "HEART_RATE",
        RESPIRATORY_RATE: "RESPIRATORY_RATE",
        COMB_OS_HR: "COMB_OS_HR",
        COM_OS_HR_RR: "COM_OS_HR_RR",
        TEMPERATURE: "TEMPERATURE",
        WEIGHT: "WEIGHT",
        BLOOD_PRESSURE: "BLOOD_PRESSURE",
        COMB_BP_HR: "COMB_BP_HR",
        BLOOD_GLUCOSE: "BLOOD_GLUCOSE"
    }

    PAGES = {
        CONTACT: "contact",
        TASKS: "tasks",
        MEDICATION_PLAN: "medication_plan",
        HISTORY: "history",
        SURVEY: "survey"
    }

    PAIN_LOC = {
        GENERAL: "DOLOR_LOC_1",
        CEFALIC: "DOLOR_LOC_2",
        TORAX: "DOLOR_LOC_3",
        ABDOMEN: "DOLOR_LOC_4",
        EXTREMITIES: "DOLOR_LOC_5",
        OTHER: "DOLOR_LOC_6"
    }

    CONSCIOUSNESS_STATUS = {
        CONSCIOUS: "ESTADO_CONCIENC_1",
        AGITATED: "ESTADO_CONCIENC_4",
        SLEEPY: "ESTADO_CONCIENC_3",
        UNCONSCIOUS: "ESTADO_CONCIENC_6"
    }

    DEPOSITIONS = {
        ASPECT: {
            NORMAL: "AS_PER_ENT001",
            WITH_BLOOD: "AS_PER_ENT005",
            NO_DEPOSITION: "AS_PER_ENT012"
        },
        CONSISTENCY: {
            SOLID: "CO_HE_P_EN001",
            PASTY: "CO_HE_P_EN002",
            LIQUID: "CO_HE_P_EN003",
            NO_DEPOSITION: "CO_HE_P_EN006"
        }
    }
    DIURESIS = {
        ASPECT: {
            CLEAR: "AS_DIURESI001",
            CONCENTRATED: "AS_DIURESI002",
            WITH_FRESH_BLOOD: "AS_DIURESI004",
            WITH_BLOOD_CLOTS: "AS_DIURESI005"
        }
    }

    DRAINAGES = {
        DREN_ABD: {
            ASPECT: {
                YELLOWISH: "AS_DRE_ABD001",
                DARK_YELLOWISH: "AS_DRE_ABD002",
                CLEAR_BLOOD: "AS_DRE_ABD003",
                GREEN: "AS_DRE_ABD006"
            }
        },
        DREN_LUM: {
            ASPECT: {
                DARK_YELLOWISH: "AS_DRE_LUM002",
            }
        },
        DREN_AXI: {
            ASPECT: {
                YELLOWISH: "AS_DRE_AXI001",
                DARK_YELLOWISH: "AS_DRE_AXI002",
                GREEN: "AS_DRE_AXI005"
            }
        },
        DREN_MUS: {
            ASPECT: {
                YELLOWISH: "AS_DRE_MUS001",
                DARK_YELLOWISH: "AS_DRE_MUS002",
            }
        },
        DREN_CFA: {
            ASPECT: {
                YELLOWISH: "AS_DRE_CFA001",
                DARK_YELLOWISH: "AS_DRE_CFA002",
                GREEN: "AS_DRE_CFA005"
            }
        },
        DREN_ING: {
            ASPECT: {
                YELLOWISH: "AS_DRE_ING001",
                DARK_YELLOWISH: "AS_DRE_ING002",
                GREEN: "AS_DRE_ING005"
            }
        },
        DREN_PEL: {
            ASPECT: {
                YELLOWISH: "AS_DRE_PEL001",
                DARK_YELLOWISH: "AS_DRE_PEL002",
                GREEN: "AS_DRE_PEL005"
            }
        },
        DREN_TOR: {
            ASPECT: {
                YELLOWISH: "AS_DRE_TOR001",
                DARK_YELLOWISH: "AS_DRE_TOR002",
                GREEN: "AS_DRE_TOR005"
            }
        }
    }

    UNITS = {
        mmHg: "mmHg",
        bpm: "pul/min",
        percentage: "%SpO₂",
        rpm: "rpm",
        kg: "kg",
        celsius: "C",
        fahrenheit: "F",
        mg_dl: "mg/dL"
    }

    UNITS_LABELS = {
        "mmHg": "mmHg",
        "bpm": "bpm",
        "percentage": "percentage",
        "rpm": "rpm",
        "kg": "kg",
        "celsius": "celsius",
        "mg_dl": "mg_dl"
    }
    
    LIQUIDS_QUANTITY = {
        SMALL: 100,
        MEDIUM: 250,
        LARGE: 500
    }

    constructor() { }
}