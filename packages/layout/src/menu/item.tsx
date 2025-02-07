import {AnimatePresence, motion} from "framer-motion";
import {action, toJS} from "mobx";
import {useLocalObservable, useObserver} from "mobx-react";
import {MouseEvent as RMouseEvent, useCallback, useContext, useEffect, useRef} from "react";

import {CSSProp, getDefaultTransition, useTheme} from "@focus4/styling";
import {Button, ButtonCss, ButtonProps, IconButton, IconButtonCss, IconButtonProps, RippleProps} from "@focus4/toolbox";

import {MenuContext} from "./context";
import {MainMenuList} from "./list";
import {mainMenuCss, MainMenuCss} from "./style";

/** Props du MenuItem. */
export interface MainMenuItemProps extends Omit<ButtonProps & IconButtonProps & RippleProps, "theme"> {
    /** La route associée, pour comparaison avec la route active. */
    route?: string;
    /** CSS. */
    theme?: CSSProp<MainMenuCss>;
}

/** Elément de menu. */
export function MainMenuItem({label, icon, onClick, route, children, theme: pTheme, ...otherProps}: MainMenuItemProps) {
    const theme = useTheme<MainMenuCss>("mainMenu", mainMenuCss, pTheme);
    const context = useContext(MenuContext);
    const state = useLocalObservable(() => ({hasSubMenu: false, top: 0, left: 0}));

    const li = useRef<HTMLLIElement>(null);
    const panel = useRef<HTMLDivElement>(null);

    const onItemClick = useCallback(
        action((event: RMouseEvent<HTMLButtonElement | HTMLLinkElement>) => {
            if (children) {
                const liRect = li.current!.getBoundingClientRect();
                state.hasSubMenu = !state.hasSubMenu;
                state.top = liRect.top;
                state.left = liRect.left + liRect.width;
            }
            if (onClick) {
                onClick(event);
                context.closePanel();
            }
        }),
        []
    );

    const onDocumentClick = useCallback((e: MouseEvent) => {
        if (panel.current && li.current) {
            if (!panel.current.contains(e.target as Node) && !li.current.contains(e.target as Node)) {
                state.hasSubMenu = false;
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mouseup", onDocumentClick);
        return () => document.removeEventListener("mouseup", onDocumentClick);
    }, []);

    return useObserver(() => (
        <>
            <li ref={li} className={theme.item({active: route === context.activeRoute, opened: state.hasSubMenu})}>
                {label ? (
                    <Button
                        {...otherProps}
                        icon={icon}
                        label={label}
                        onClick={onItemClick}
                        theme={theme as unknown as CSSProp<ButtonCss>}
                    />
                ) : (
                    <IconButton
                        {...otherProps}
                        icon={icon}
                        onClick={onItemClick}
                        rippleTheme={theme}
                        theme={theme as unknown as CSSProp<IconButtonCss>}
                    />
                )}
            </li>
            {context.renderSubMenu(
                <AnimatePresence>
                    {state.hasSubMenu ? (
                        <motion.div
                            ref={panel}
                            animate="visible"
                            className={theme.panel()}
                            exit="hidden"
                            initial="hidden"
                            style={toJS(state)}
                            transition={getDefaultTransition()}
                            variants={{
                                visible: {
                                    width: "auto",
                                    opacity: 1
                                },
                                hidden: {
                                    width: 0,
                                    opacity: 0.7
                                }
                            }}
                        >
                            <MainMenuList
                                activeRoute={context.activeRoute}
                                closePanel={() => (state.hasSubMenu = false)}
                                theme={theme}
                            >
                                {children}
                            </MainMenuList>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            )}
        </>
    ));
}
