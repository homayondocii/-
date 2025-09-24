
import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { askFinancialAssistant } from '../../services/geminiService';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface FinancialAssistantProps {
    contextData: string;
}

export const FinancialAssistant: React.FC<FinancialAssistantProps> = ({ contextData }) => {
    const { t } = useLocalization();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await askFinancialAssistant(input, contextData);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: 'An error occurred. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-500 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {t('financialAssistant')}
            </h3>
            <div className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start mb-3">
                        <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                           <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('askMe')}
                    className="flex-1 p-2 border border-gray-300 rounded-s-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-e-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800"
                >
                    {t('send')}
                </button>
            </div>
        </div>
    );
};
