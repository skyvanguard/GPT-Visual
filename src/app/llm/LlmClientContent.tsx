'use client';

import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';
import { Header } from '@/src/homepage/Header';
import { Glossary } from '@/src/llm/components/Glossary';
import { ExampleSelector } from '@/src/llm/components/ExampleSelector';

export default function LlmClientContent() {
    return <>
        <Header title="GPT-Visual">
            <InfoButton />
        </Header>
        <LayerView />
        <Glossary />
        <ExampleSelector />
        <div id="portal-container"></div>
    </>;
}
