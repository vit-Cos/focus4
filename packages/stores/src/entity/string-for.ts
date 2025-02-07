import i18next from "i18next";

import {ReferenceList} from "../reference";

import {EntityField, FieldEntry} from "./types";

/**
 * Récupère le texte correspondant à un champ.
 * @param field La définition de champ.
 * @param values L'éventulle liste de référence associée.
 */
export function stringFor<F extends FieldEntry>(field: EntityField<F>, values: ReferenceList = [] as any) {
    const {
        value,
        $field: {
            domain: {displayFormatter = (t: string) => i18next.t(t)}
        }
    } = field;
    const found = values.find(val => val[values.$valueKey] === value);
    const processedValue = found?.[values.$labelKey] || value;
    return displayFormatter(processedValue);
}
