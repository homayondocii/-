import React, { useState } from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { getFinancialAdvice, isGeminiConfigured } from '../../services/geminiService';

interface FinancialAssistantProps {
    contextData: string;
}

export const FinancialAssistant: React.FC<FinancialAssistantProps> = ({ contextData }) => {
    const { t } = useLocalization();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const configured = isGeminiConfigured();

    const handleAsk = async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnswer('');
        try {
            const result = await getFinancialAdvice(contextData, question);
            setAnswer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{t('financialAssistant')}</h3>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[6rem]">
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {answer || t('assistantWelcome')}
                    </p>
                    {isLoading && (
                        <div className="flex items-center justify-center pt-4">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Analyzing...</span>
                        </div>
                    )}
                     {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
                </div>
                {configured ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAsk()}
                            placeholder={t('askFinancialQuestion')}
                            className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAsk}
                            disabled={isLoading || !question.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? t('search') : t('ask')}
                        </button>
                    </div>
                ) : (
                     <div className="p-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg dark:bg-gray-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700" role="alert">
                      <span className="font-medium">{t('assistantConfigNeeded')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};