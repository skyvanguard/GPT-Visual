import React from 'react';
import { CPUMain } from '@/src/cpu/CpuMain';
import { Header } from '@/src/homepage/Header';

export const metadata = {
  title: 'Simulación de CPU',
  description: 'Explorando el funcionamiento interno de una CPU, con una visualización interactiva.',
};

export default function Page() {
    return <>
        <CPUMain />
        <div id="portal-container"></div>
    </>;
}
