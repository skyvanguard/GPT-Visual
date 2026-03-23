'use client';

import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';
import { Header } from '@/src/homepage/Header';
import { Glossary } from '@/src/llm/components/Glossary';
import { ExampleSelector } from '@/src/llm/components/ExampleSelector';

export default function VizClientContent() {
    return <>
        <Header title="Visualizacion 3D">
            <InfoButton />
        </Header>
        <LayerView />
        <Glossary />
        <ExampleSelector />
        <div id="portal-container"></div>
    </>;
}
