export interface AthQuestion {
  id: string;
  type: string;
  order: number;
  tag: string | null;
  label: {
    es: string;
    ca: string;
    en: string;
  };
  value: any;
  options: Record<string, { es: string; ca: string; en: string }> | null;
  main_tag: string | null;
  escala: string | null;
  caract_form: string | null;
  optional: boolean;
  info: {
    subtitle: {
      es: string;
      ca: string;
      en: string;
    };
    desc_html: {
      es: string;
      ca: string;
      en: string;
    };
  } | null;
  units: string | null;
  min_questions: number | null;
  max_questions: number | null;
  headform: string | null;
  depends_on: string | null;
  group_name: string | null;
}
