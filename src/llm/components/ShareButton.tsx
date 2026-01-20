'use client';

import React, { useState } from 'react';
import s from './ShareButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';

export function ShareButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = 'GPT-Visual: Visualización 3D interactiva de modelos de lenguaje';
    const shareText = 'Explora cómo funcionan los LLM con esta increíble visualización 3D interactiva';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            setIsOpen(true);
        }
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: faTwitter,
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: faLinkedin,
            color: '#0A66C2',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: faFacebook,
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        }
    ];

    return (
        <div className={s.container}>
            <button className={s.shareButton} onClick={handleNativeShare} title="Compartir">
                <FontAwesomeIcon icon={faShare} />
            </button>

            {isOpen && (
                <>
                    <div className={s.backdrop} onClick={() => setIsOpen(false)} />
                    <div className={s.dropdown}>
                        <div className={s.header}>Compartir</div>

                        <div className={s.socialButtons}>
                            {shareLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={s.socialButton}
                                    style={{ '--btn-color': link.color } as any}
                                    title={`Compartir en ${link.name}`}
                                >
                                    <FontAwesomeIcon icon={link.icon} />
                                </a>
                            ))}
                        </div>

                        <div className={s.divider} />

                        <button className={s.copyButton} onClick={handleCopyLink}>
                            <FontAwesomeIcon icon={copied ? faCheck : faLink} />
                            <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
