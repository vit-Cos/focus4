import classNames from "classnames";
import {MouseEvent, MouseEventHandler, ReactNode, useCallback, useRef} from "react";

import {CSSProp, useTheme} from "@focus4/styling";

import {Radio} from "./radio";

import radioCss, {RadioCss} from "../__style__/radio.css";
export {radioCss, RadioCss};

/** Props du Radio. */
export interface RadioButtonProps {
    /** @internal */
    checked?: boolean;
    className?: string;
    /** Children to pass through the component. */
    children?: ReactNode;
    /** If true, the radio shown as disabled and cannot be modified. */
    disabled?: boolean;
    /** Text label to attach next to the radio element. */
    label?: ReactNode;
    /** The id of the field to set in the input radio. */
    id?: string;
    /** The name of the field to set in the input radio. */
    name?: string;
    /** @internal */
    onChange?: (value: boolean, event: MouseEvent<HTMLInputElement>) => void;
    onMouseEnter?: MouseEventHandler<HTMLLabelElement>;
    onMouseLeave?: MouseEventHandler<HTMLLabelElement>;
    theme?: CSSProp<RadioCss>;
    /** Valeur. */
    value: string;
}

export function RadioButton({
    checked = false,
    children,
    className = "",
    disabled = false,
    label,
    id,
    onChange,
    onMouseEnter,
    onMouseLeave,
    name,
    theme: pTheme
}: RadioButtonProps) {
    const theme = useTheme("RTRadio", radioCss, pTheme);
    const inputNode = useRef<HTMLInputElement | null>(null);

    const handleToggle = useCallback(
        (event: MouseEvent<HTMLInputElement>) => {
            if (event.pageX !== 0 && event.pageY !== 0) {
                inputNode.current?.blur();
            }
            if (!disabled && onChange) {
                onChange(!checked, event);
            }
        },
        [disabled, onChange, checked]
    );

    return (
        <label
            className={classNames(theme.field({disabled}), className)}
            data-react-toolbox="radio"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <input
                ref={inputNode}
                checked={checked}
                className={theme.input()}
                disabled={disabled}
                id={id}
                name={name}
                onClick={handleToggle}
                readOnly
                type="radio"
            />
            <Radio checked={checked} disabled={disabled} rippleTheme={{ripple: theme.ripple()}} theme={theme} />
            {label ? (
                <span className={theme.text()} data-react-toolbox="label">
                    {label}
                </span>
            ) : null}
            {children}
        </label>
    );
}
