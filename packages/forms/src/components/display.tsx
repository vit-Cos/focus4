import {useObserver} from "mobx-react";
import {useEffect, useMemo, useState} from "react";

import {ReferenceList} from "@focus4/stores";
import {CSSProp, useTheme} from "@focus4/styling";

import displayCss, {DisplayCss} from "./__style__/display.css";
export {displayCss, DisplayCss};

/** Props du composant d'affichage. */
export interface DisplayProps {
    /** Formatteur. */
    formatter?: (value: any) => string;
    /** Service de résolution de code. */
    keyResolver?: (key: any) => Promise<string>;
    /** CSS. */
    theme?: CSSProp<DisplayCss>;
    /** Valeur à afficher. */
    value?: any;
    /** Liste des valeurs de référence. */
    values?: ReferenceList;
}

/** Composant d'affichage par défaut, gère la résolution de la valeur par liste de référence ou par service. */
export function Display({formatter = x => x, keyResolver, theme: pTheme, value: pValue, values}: DisplayProps) {
    const [value, setValue] = useState<any>();
    const theme = useTheme("display", displayCss, pTheme);

    useEffect(() => {
        if (pValue !== value) {
            if (pValue !== undefined && keyResolver) {
                keyResolver(pValue).then(res => setValue(res ?? pValue));
            } else {
                setValue(pValue);
            }
        }
    }, [pValue, keyResolver]);

    const vals = useMemo(() => (Array.isArray(value) ? value : [value]), [value]);
    return useObserver(() => (
        <div className={theme.display()} data-focus="display">
            {vals.map(v => formatter(values?.getLabel(v) ?? v)).join(", ")}
        </div>
    ));
}
