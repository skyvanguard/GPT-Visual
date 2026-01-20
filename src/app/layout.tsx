'use client';
import React, { useEffect } from 'react';
import s from './layout.module.scss';
import '@/styles/main.css';
import { inject } from '@vercel/analytics';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ThemeProvider } from '@/src/llm/components/ThemeContext';
config.autoAddCss = false;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
         inject();

         // Register Service Worker for PWA
         if ('serviceWorker' in navigator) {
             navigator.serviceWorker.register('/sw.js').catch(err => {
                 console.log('SW registration failed:', err);
             });
         }
    }, []);

    return <html lang="es" className={s.html}>
        <head>
            {/* Inter - UI font */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
                rel="stylesheet"
            />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#6366f1" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="GPT-Visual" />
        </head>
        <body className={s.body}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </body>
    </html>;
}
