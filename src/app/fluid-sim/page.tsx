import React from 'react';
import { FluidSimView } from '@/src/fluidsim/FluidSimView';
import Link from 'next/link';

export const metadata = {
  title: 'Simulación de Fluidos',
  description: 'Explorando simulación de fluidos en WebGPU',
};

import s from './page.module.scss';

export default function Page() {

    return <>
        <div className={s.header}>
            <div className={s.back}>
                <Link href={"/"}>&lt; Volver</Link>
            </div>
            Simulación de Fluidos
            <div></div>
        </div>
        <FluidSimView />
    </>;
}
