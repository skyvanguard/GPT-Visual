'use client';

import React from "react";
import { Header } from "./Header";
import {
    Hero,
    Features,
    DemoPreview,
    HowItWorks,
    CallToAction,
    Footer
} from "./sections";

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Header with transparent background for hero */}
            <Header variant="homepage" />

            {/* Main content */}
            <main>
                <Hero />
                <Features />
                <DemoPreview />
                <HowItWorks />
                <CallToAction />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
