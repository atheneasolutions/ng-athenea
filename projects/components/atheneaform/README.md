# form-component

Llibreria Angular per mostrar formularis/qüestionaris interactius mitjançant el component `<ath-form>`.

## Índex

- [Tecnologies](#tecnologies)
- [Instal·lació](#installació)
- [Ús](#ús)
- [Desenvolupament](#desenvolupament)
  - [Generar nou codi](#generar-nou-codi)
  - [Generar una nova versió](#generar-una-nova-versió)
- [Migració de la v4 a la v5](#migració-de-la-v4-a-la-v5)
- [API del component `ath-form`](#api-del-component-ath-form)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
- [Tipus i interfícies](#tipus-i-interfícies)
  - [`Question`](#question)
  - [`Type`](#type)
  - [`IntComparatorConditionals`](#intcomparatorconditionals)
  - [`Lang`](#lang)
  - [`Multilang`](#multilang)
  - [`BloodPreasure`](#bloodpreasure)
  - [`Info`](#info)
  - [`Preview`](#preview)
  - [`Zone`](#zone)
- [Llicència](#llicència)

## Tecnologies

- **Angular** 17
- **Ionic** 6
- **Swiper** 14

## Instal·lació

```bash
npm install @atheneasolutions/form-component
```

> Assegura't que el teu projecte compleix els requisits de versions indicats a l'apartat de tecnologies (Angular 17, Ionic 6 i Swiper 14).

## Ús

Importa el component al teu mòdul o component standalone i utilitza'l a la plantilla:

```html
<ath-form
  [id]="'formulari-satisfaccio'"
  [answersId]="'usuari-123'"
  [questions]="questions"
  [lang]="'ca'"
  [preview]="preview"
  [end]="end"
  [canAnswer]="true"
  [availableDate]="availableDate"
  [useLocalStorage]="true"
  (sendSurvey)="onSendSurvey($event)"
></ath-form>
```

```ts
onSendSurvey(event: any) {
  console.log('Respostes rebudes:', event);
}
```

## Desenvolupament

Aquesta llibreria s'ha generat amb [Angular CLI](https://github.com/angular/angular-cli).

### Generar nou codi

Per generar un nou component, directiva, pipe, servei, etc. dins la llibreria, cal indicar el projecte amb `--project`:

```bash
ng generate component nom-component --project atheneaform
```

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module --project atheneaform
```

> ⚠️ No oblidis afegir `--project atheneaform`, ja que sinó l'element es generarà al projecte per defecte de l'`angular.json`.

### Generar una nova versió

1. Actualitza el número de versió al `package.json` de la llibreria seguint [Semantic Versioning](https://semver.org/lang/ca/).
2. Compila la llibreria:

   ```bash
   ng build @components/atheneaform
   ```

   El resultat de la compilació es genera a la carpeta `dist/`.
3. Publica la nova versió:

   ```bash
   cd dist/components/atheneaform
   npm publish
   ```

## Migració de la v4 a la v5

La versió 5 introdueix canvis en l'ús de Swiper (ara basat en Swiper Element) que requereixen actualitzar el projecte on s'utilitza la llibreria.

### 1. Canvi al paquet `form-component`

Ja no fem servir el paquet `swiper-form-component`. Ara cal instal·lar el paquet `form-component`:

```bash
npm uninstall @atheneasolutions/swiper-form-component
```

```bash
npm install @atheneasolutions/form-component
```

### 2. Actualització del paquet `swiper`

Cal actualitzar el paquet `swiper` a l'última versió (mínim la 14):
 
```bash
npm install swiper@14
```

### 3. Actualització d'imports

Cal modificar els imports al compoent antic

```diff
- import { AtheneaformComponent } from "@atheneasolutions/swiper-form-component";
+ import { AtheneaformComponent } from "@atheneasolutions/form-component";
```

### 4. Canvi de selector del component

El component ja no s'inicialitza amb `<atheneaform>`, ara cal utilitzar `<ath-form>`:

```diff
- <atheneaform></atheneaform>
+ <ath-form></ath-form>
```

També cal actualitzar els estils css
```diff
- atheneaform { .. }
+ ath-form { .. }
```

### 5. Registre dels elements de Swiper

Cal afegir el següent codi a l'arxiu `main.ts` de l'aplicació per registrar els custom elements de Swiper:

```ts
import { register } from 'swiper/element/bundle';
register();
```

### 6. Actualització dels imports de CSS

Els imports dels estils de Swiper canvien, ja que ara s'utilitza la versió basada en *web components* (`swiper/element`):

```diff
- @import "swiper/scss";
- @import "swiper/scss/navigation";
- @import "swiper/scss/pagination";
+ @import 'swiper/element/css/navigation';
+ @import 'swiper/element/css/pagination';
+ @import 'swiper/element/css/scrollbar';
```

## API del component `ath-form`

### Inputs

| Propietat | Tipus | Per defecte | Descripció |
|---|---|---|---|
| `questions` | `Question[]` | `[]` | Array de preguntes que es mostraran al formulari. |
| `lang` | `Lang` (`'ca'` \| `'es'` \| `'en'`) | `'ca'` | Idioma del qüestionari. |
| `preview` | `Preview \| null` | `null` | Si es defineix, s'utilitza com a primera diapositiva del formulari. |
| `end` | `Multilang \| null` | `null` | Paràgraf multiidioma que es mostra a la darrera diapositiva, per sota del text de confirmació d'enviament de les respostes. |
| `canAnswer` | `boolean` | `true` | Determina si el formulari es pot contestar. Si és `false`, només es mostra la primera diapositiva. |
| `availableDate` | `Date \| null` | `null` | Data informativa des de la qual el formulari estarà disponible per contestar. |
| `answersId` | `string` | — | Identificador utilitzat per associar les respostes contestades a l'emmagatzematge local del dispositiu (quan `useLocalStorage` és `true`). |
| `id` | `string` | — | Identificador del formulari. |
| `useLocalStorage` | `boolean` | `true` | Indica si les respostes contestades es guarden a l'emmagatzematge local del dispositiu. |

### Outputs

| Event | Tipus | Descripció |
|---|---|---|
| `sendSurvey` | `EventEmitter<any>` | S'emet quan l'usuari prem el botó d'enviar les respostes. Retorna totes les respostes contestades juntament amb l'`id` del formulari. |

## Tipus i interfícies

### `Question`

Cada element de l'array `questions` representa una pregunta del formulari.

| Propietat | Tipus | Descripció |
|---|---|---|
| `id` | `string` | Identificador de la pregunta. |
| `tag` | `string \| null` | Etiqueta identificativa de la pregunta. |
| `order` | `number \| string` | Ordre de la pregunta dins del formulari. |
| `label` | `Multilang` | Enunciat de la pregunta en els tres idiomes. |
| `value` | `string \| number \| BloodPreasure \| null` | Valor (resposta) de la pregunta. |
| `type` | `Type` | Tipus de pregunta (vegeu [`Type`](#type)). |
| `options` | `Record<string, Multilang> \| string \| Array<any> \| null` | Opcions disponibles per a preguntes de selecció, entre d'altres. |
| `main_tag` | `string \| null` | Etiqueta principal associada a la pregunta. |
| `escala` | `string \| null` | Escala associada, aplicable a preguntes de tipus `scale`. |
| `caract_form` | `string \| null` | Característica addicional del formulari associada a la pregunta. |
| `optional` | `boolean` | Indica si la pregunta és opcional. |
| `info` | `Info \| null` | Informació addicional (subtítol i descripció) que es pot mostrar amb la pregunta. |
| `units` | `string \| null` | Unitats de la resposta (p. ex. per a preguntes numèriques). |
| `max_questions` | `number \| null` | Nombre màxim de respostes permeses (per a preguntes de tipus múltiple). |
| `min_questions` | `number \| null` | Nombre mínim de respostes requerides (per a preguntes de tipus múltiple). |
| `headform` | `string \| null` | Referència a una capçalera o formulari relacionat. |
| `depends_on` | `string \| null` | Id d'una altra pregunta de la qual depèn aquesta (visibilitat condicional). |
| `group_name` | `string \| null` | Nom del grup al qual pertany la pregunta. |
| `int_comparator_question` | `string \| null` | Id de la pregunta amb el valor de la qual es compara (condicions dependents). |
| `int_comparator_condition` | `IntComparatorConditionals \| null` | Condició de comparació (`greater_than`, `less_than`, `equal`). |
| `int_comparator_value` | `number \| null` | Valor numèric amb què es compara. |
| `unit_type` | `string \| null` | Tipus d'unitat (per a preguntes de tipus `unit`). |
| `unit_min` | `number \| null` | Valor mínim permès per a la unitat. |
| `unit_max` | `number \| null` | Valor màxim permès per a la unitat. |

### `Type`

Tipus de pregunta que determina com es renderitza al formulari:

```ts
type Type =
  | 'number'
  | 'select'
  | 'text'
  | 'pain'
  | 'csi_multiple'
  | 'mult'
  | 'info'
  | 'select_mood'
  | 'input_num'
  | 'pain_location'
  | 'blood_glucose'
  | 'blood_pressure'
  | 'heart_rate'
  | 'scale'
  | 'thermometer'
  | 'unit';
```

### `IntComparatorConditionals`

Condicions disponibles per comparar el valor d'una pregunta amb una altra, utilitzat conjuntament amb `int_comparator_question`, `int_comparator_condition` i `int_comparator_value` de `Question`:

```ts
type IntComparatorConditionals =
  | 'greater_than'
  | 'less_than'
  | 'equal';
```

### `Lang`

Idiomes suportats pel component, utilitzats a l'input `lang`:

```ts
type Lang = 'ca' | 'es' | 'en';
```

### `Multilang`

Text disponible en els tres idiomes suportats. S'utilitza a `label` de `Question`, a `end`, i dins de `Info`.

| Propietat | Tipus | Descripció |
|---|---|---|
| `ca` | `string` | Text en català. |
| `es` | `string` | Text en castellà. |
| `en` | `string` | Text en anglès. |

### `BloodPreasure`

Valor de resposta per a preguntes de tipus `blood_pressure`.

| Propietat | Tipus | Descripció |
|---|---|---|
| `sys_value` | `string` | Valor de la pressió sistòlica. |
| `dia_value` | `string` | Valor de la pressió diastòlica. |
| `bpm_value` | `string` | Valor de les pulsacions per minut. |

### `Info`

Informació addicional que es pot associar a una pregunta.

| Propietat | Tipus | Descripció |
|---|---|---|
| `subtitle` | `Multilang` | Subtítol multiidioma. |
| `desc_html` | `Multilang` | Descripció en format HTML, multiidioma. |

### `Preview`

Contingut de la primera diapositiva del formulari, definit a l'input `preview`.

| Propietat | Tipus | Descripció |
|---|---|---|
| `title` | `string \| null` | Títol de la diapositiva de presentació. |
| `subtitle` | `string \| null` | Subtítol de la diapositiva de presentació. |
| `desc_html` | `string \| null` | Descripció en format HTML. |
| `button` | `string` | Text del botó per iniciar el formulari. |

### `Zone`

Representa una zona (per exemple, per a preguntes de tipus `pain_location`).

| Propietat | Tipus | Descripció |
|---|---|---|
| `code` | `string` | Codi identificatiu de la zona. |
| `ordinary_name` | `Multilang` | Nom habitual de la zona, multiidioma. |
| `formal_name` | `Multilang` | Nom formal de la zona, multiidioma. |

## Llicència

Aquesta llibreria és **privada** i d'ús exclusiu per als membres de l'organització. No es distribueix públicament i no compta amb una llicència de codi obert.

Queda prohibit l'ús, la còpia o la distribució fora de l'organització sense autorització prèvia.
