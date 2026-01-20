'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useProgramState } from '../Sidebar';
import s from './SettingsPanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimes, faMoon, faSun, faPlay, faPause, faFastForward, faKeyboard, faExpand, faCompress, faFire, faWind } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { flowParticleSystem } from './FlowParticles';

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2];

export function SettingsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const progState = useProgramState();

    const [speedIndex, setSpeedIndex] = useState(2); // Default: 1x

    useEffect(() => {
        if (progState?.walkthrough) {
            progState.walkthrough.speed = SPEED_OPTIONS[speedIndex];
        }
    }, [speedIndex, progState]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleSpeedChange = (delta: number) => {
        setSpeedIndex(prev => Math.max(0, Math.min(SPEED_OPTIONS.length - 1, prev + delta)));
    };

    return (
        <>
            <button
                className={s.settingsButton}
                onClick={() => setIsOpen(true)}
                title="Configuración"
                aria-label="Abrir configuración"
            >
                <FontAwesomeIcon icon={faCog} />
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <div className={s.header}>
                            <h3>Configuración</h3>
                            <button onClick={() => setIsOpen(false)} aria-label="Cerrar">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className={s.section}>
                            <h4>Apariencia</h4>
                            <div className={s.row}>
                                <span>Tema</span>
                                <button
                                    className={s.themeToggle}
                                    onClick={toggleTheme}
                                    aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                                >
                                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                                    <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>
                                </button>
                            </div>
                            <div className={s.row}>
                                <span>Pantalla completa</span>
                                <button
                                    className={s.themeToggle}
                                    onClick={toggleFullscreen}
                                    aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                                >
                                    <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                                    <span>{isFullscreen ? 'Salir' : 'Activar'}</span>
                                </button>
                            </div>
                        </div>

                        <div className={s.section}>
                            <h4>Animación</h4>
                            <div className={s.row}>
                                <span>Velocidad</span>
                                <div className={s.speedControl}>
                                    <button onClick={() => handleSpeedChange(-1)} disabled={speedIndex === 0}>-</button>
                                    <span className={s.speedValue}>{SPEED_OPTIONS[speedIndex]}x</span>
                                    <button onClick={() => handleSpeedChange(1)} disabled={speedIndex === SPEED_OPTIONS.length - 1}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className={s.section}>
                            <h4>Visualización</h4>
                            <div className={s.row}>
                                <span>
                                    <FontAwesomeIcon icon={faFire} style={{ marginRight: 8 }} />
                                    Mapa de calor
                                </span>
                                <button
                                    className={clsx(s.toggle, progState?.display.heatMapEnabled && s.active)}
                                    onClick={() => {
                                        if (progState) {
                                            progState.display.heatMapEnabled = !progState.display.heatMapEnabled;
                                            progState.markDirty();
                                        }
                                    }}
                                    aria-label="Activar/desactivar mapa de calor"
                                />
                            </div>
                            {progState?.display.heatMapEnabled && (
                                <div className={s.sliderRow}>
                                    <span className={s.sliderLabel}>Intensidad</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progState.display.heatMapIntensity * 100}
                                        onChange={(e) => {
                                            progState.display.heatMapIntensity = parseInt(e.target.value) / 100;
                                            progState.markDirty();
                                        }}
                                        className={s.slider}
                                    />
                                    <span className={s.sliderValue}>{Math.round(progState.display.heatMapIntensity * 100)}%</span>
                                </div>
                            )}

                            <div className={s.row}>
                                <span>
                                    <FontAwesomeIcon icon={faWind} style={{ marginRight: 8 }} />
                                    Flujo de datos
                                </span>
                                <button
                                    className={clsx(s.toggle, progState?.display.flowAnimationEnabled && s.active)}
                                    onClick={() => {
                                        if (progState) {
                                            progState.display.flowAnimationEnabled = !progState.display.flowAnimationEnabled;
                                            if (!progState.display.flowAnimationEnabled) {
                                                flowParticleSystem.reset();
                                            }
                                            progState.markDirty();
                                        }
                                    }}
                                    aria-label="Activar/desactivar animación de flujo"
                                />
                            </div>
                        </div>

                        <div className={s.section}>
                            <h4>Atajos de teclado</h4>
                            <div className={s.shortcuts}>
                                <div className={s.shortcut}>
                                    <kbd>Espacio</kbd>
                                    <span>Pausar/Continuar</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>←</kbd> <kbd>→</kbd>
                                    <span>Navegar secciones</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
                                    <span>Mover cámara</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>Q</kbd> <kbd>E</kbd>
                                    <span>Zoom in/out</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>R</kbd>
                                    <span>Expandir vista</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>F</kbd>
                                    <span>Enfocar</span>
                                </div>
                                <div className={s.shortcut}>
                                    <kbd>Esc</kbd>
                                    <span>Cerrar paneles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
