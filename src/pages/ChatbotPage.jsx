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
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    height: 100% !important;
                }
                #root {
                    background: transparent !important;
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    min-height: 100% !important;
                    height: 100% !important;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                }
                /* Override fixed positioning for embedded iframe mode */
                .chatbot-container.embedded-mode {
                    position: relative !important;
                    bottom: auto !important;
                    right: auto !important;
                    width: 100% !important;
                    height: 100% !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    border-radius: 0 !important;
                    transform: none !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                }
                `}
            </style>

            {/* In embedded mode, the chatbot is permanently open and controlled by the host iframe */}
            <Chatview isOpen={true} isEmbedded={true} onClose={() => {}} />
        </>
    )
}

export default ChatbotPage