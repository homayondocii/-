
import React, { createContext, useContext, ReactNode } from 'react';
import { LOCALIZATION_STRINGS } from '../constants';
import { Language } from '../types';

interface LocalizationContextType {
    language: Language;
    t: (key: keyof typeof LOCALIZATION_STRINGS.fa) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ language: Language; children: ReactNode }> = ({ language, children }) => {
    const t = (key: keyof typeof LOCALIZATION_STRINGS.fa): string => {
        return LOCALIZATION_STRINGS[language][key] || key;
    };

    return (
        <LocalizationContext.Provider value={{ language, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = (): LocalizationContextType => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
