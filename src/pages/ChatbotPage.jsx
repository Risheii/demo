import React, { useState } from 'react'
import Chatview from '../component/Chatview'

const ChatbotPage = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <style>
                {`  
                body, html {
                    background: transparent !important;
                    background-color: transparent !important;
                }
                #root {
                    background: transparent !important;
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    min-height: 0 !important;
                    width: auto !important;
                    max-width: none !important;
                }
                `}
            </style>

            <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999 }}>
                <div style={{ pointerEvents: 'auto' }}>
                    {/* Chatbot panel */}
                    <Chatview isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </div>

                {/* Floating button — always visible, toggles open/close */}
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(79,142,247,0.45)',
                        zIndex: 1000,
                        transition: 'transform 0.2s ease',
                        pointerEvents: 'auto'
                    }}
                >
                    {/* Shows X when open, chat icon when closed */}
                    {isOpen ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </>
    )
}

export default ChatbotPage