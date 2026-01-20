'use client';

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// Neural network logo component
const NeuralLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        viewBox="0 0 512 512"
        className={`w-8 h-8 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
        </defs>
        <polygon
            points="256,56 416,136 416,296 256,376 96,296 96,136"
            fill="url(#logoGradient)"
            stroke="#818cf8"
            strokeWidth="8"
        />
        <circle cx="256" cy="216" r="32" fill="#22d3ee" opacity="0.9" />
        <circle cx="256" cy="216" r="16" fill="#ffffff" opacity="0.8" />
        <line x1="256" y1="56" x2="256" y2="184" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        <line x1="96" y1="216" x2="224" y2="216" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        <line x1="288" y1="216" x2="416" y2="216" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        <line x1="256" y1="248" x2="256" y2="376" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
    </svg>
);

export const Header: React.FC<{
    title?: React.ReactNode;
    children?: React.ReactNode;
    variant?: 'default' | 'homepage';
}> = ({ title, children, variant = 'default' }) => {
    const isHomepage = variant === 'homepage';

    return (
        <header className={`
            flex justify-between items-center px-4 md:px-6 py-3
            ${isHomepage ? 'bg-transparent absolute top-0 left-0 right-0 z-50' : 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-800'}
            text-white h-[3.5rem] flex-shrink-0
        `}>
            <div className="flex items-center gap-3">
                {children}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <NeuralLogo />
                    <span className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        GPT-Visual
                    </span>
                </Link>
            </div>

            {title && !isHomepage && (
                <div className="text-base sm:text-lg md:text-xl truncate px-4 text-slate-300">
                    {title}
                </div>
            )}

            <nav className="flex items-center gap-4">
                <Link
                    href="/viz"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                    Demo
                </Link>
                <a
                    href="https://github.com/niconiahi/llm-viz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                    <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                    <span className="hidden sm:inline">GitHub</span>
                </a>
            </nav>
        </header>
    );
};

export { NeuralLogo };
