'use client';

import React from 'react';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createContext, useContext, useEffect } from 'react';
import { assignImm } from '@/src/utils/data';
import { KeyboardOrder, useGlobalKeyboard } from '@/src/utils/keyboard';
import { useLocalStorageState } from '@/src/utils/localstorage';
import { ModalWindow } from '@/src/utils/Portal';
import s from './WelcomePopup.module.scss';
import { TocDiagram } from './components/TocDiagram';
import { Subscriptions, useSubscriptions } from '../utils/hooks';

interface IWelcomePopupLS {
    visible: boolean;
    hasSeenWelcome: boolean;
}

function hydrateWelcomePopupLS(a?: Partial<IWelcomePopupLS>) {
    // Solo mostrar el popup si el usuario nunca lo ha visto
    const hasSeenWelcome = a?.hasSeenWelcome ?? false;
    return {
        visible: !hasSeenWelcome, // Mostrar solo si es la primera visita
        hasSeenWelcome,
    };
}

export const WelcomePopup: React.FC<{}> = () => {
    let ctx = useContext(WelcomeContext);
    useSubscriptions(ctx.subscriptions);
    let [welcomeState, setWelcomeState] = useLocalStorageState('welcome-popup', hydrateWelcomePopupLS);

    useGlobalKeyboard(KeyboardOrder.Modal, ev => {

        if (ev.key === 'Escape') {
            hide();
        }

        ev.stopPropagation();
    });

    useEffect(() => {
        if (ctx.forceVisible) {
            ctx.forceVisible = false;
            setWelcomeState(a => assignImm(a, { visible: true }));
        }
    }, [ctx, setWelcomeState, ctx.forceVisible]);

    function hide() {
        setWelcomeState(a => assignImm(a, { visible: false, hasSeenWelcome: true }));
    }

    if (!welcomeState.visible) {
        return null;
    }

    return <ModalWindow className={s.modalWindow} backdropClassName={s.modalWindowBackdrop} onBackdropClick={hide}>
        <div className={s.header}>
            <div className={s.title}>¡Bienvenido!</div>
        </div>
        <div className={s.body}>
            {/* <div className={s.image}>
                <Image src={IntroImage} alt={"LLM diagram"} />
            </div> */}
            <div style={{ width: 600, flex: '0 0 auto' }}>
                <TocDiagram activePhase={null} onEnterPhase={hide} />
            </div>
            <div className={s.text}>
                <p>Esta es una visualización 3D interactiva de un Modelo de Lenguaje Grande (LLM),
                    del tipo que impulsa GPT-3 y ChatGPT.</p>
                <p>Mostramos un modelo muy pequeño del mismo diseño, para ayudarte a entender cómo
                    funcionan estos modelos.</p>
                <p>Además de ser interactivo, proporcionamos un recorrido guiado del modelo
                    mostrando el proceso paso a paso de cómo funciona, con cada suma, multiplicación y
                    operación matemática descrita.</p>
            </div>
        </div>
        <div className={s.footer}>
            <button className={s.button} onClick={hide}>Comenzar</button>
        </div>
    </ModalWindow>;
};

class WelcomeManager {
    subscriptions = new Subscriptions();
    forceVisible = false;
    showWelcomeDialog() {
        this.forceVisible = true;
        this.subscriptions.notify();
    }
}

let WelcomeContext = createContext(new WelcomeManager());

export const InfoButton: React.FC<{}> = () => {
    let ctx = useContext(WelcomeContext);

    return <button
        onClick={() => ctx.showWelcomeDialog()}
        className={s.infoBtn}
        aria-label="Mostrar información y ayuda"
        title="Ayuda"
    >
        <FontAwesomeIcon icon={faCircleQuestion} />
    </button>;
};
