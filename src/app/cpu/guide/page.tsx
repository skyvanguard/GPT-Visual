
import React from 'react';
import { IGuideEntry, guideEntries } from '@/src/cpu/guide/GuideIndex';
import Link from 'next/link';

export const metadata = {
  title: 'Simulación de CPU',
  description: 'Explorando el funcionamiento interno de una CPU, con una visualización interactiva.',
};

export default function Page() {

    return <>
        <div>
            {guideEntries.map(x => {
                return <IndexEntry key={x.id} entry={x} />;
            })}
        </div>
        <div id="portal-container"></div>
    </>;
}

const IndexEntry: React.FC<{
    entry: IGuideEntry;
}> = ({ entry }) => {

    return <div>
        <Link href={'guide/' + entry.path}>{entry.name}</Link>
    </div>;
};
