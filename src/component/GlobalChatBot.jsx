import React, { useState } from 'react'
import Chatview from './Chatview'
import './GlobalChatBot.css'

const GlobalChatBot = () => {
    const [chatOpen, setChatOpen] = useState(false)


    return (
        <>
            {/* Floating Chat Button */}
            <button
                className="floating-chat-btn"
                onClick={() => setChatOpen(prev => !prev)}
                title="Chat with us"
            >
                {chatOpen ? (
                    /* Close X icon when open */
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                ) : (
                    /* Chat bubble icon when closed */
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                        <circle cx="8" cy="12" r="1.2" fill="#4f8ef7" />
                        <circle cx="12" cy="12" r="1.2" fill="#4f8ef7" />
                        <circle cx="16" cy="12" r="1.2" fill="#4f8ef7" />
                    </svg>
                )}
            </button>

            {/* Notification dot when closed */}
            {!chatOpen && <span className="chat-notification-dot" />}

            {/* Chatview drawer */}
            <Chatview isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
    )
}

export default GlobalChatBot
