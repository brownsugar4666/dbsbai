import React, { createContext, useContext, useState, type ReactNode } from 'react';
import SplashScreen from '../components/SplashScreen';

interface SplashContextType {
    hasSeenSplash: boolean;
    dismissSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

const SPLASH_STORAGE_KEY = 'bharatvote_splash_seen';

interface SplashProviderProps {
    children: ReactNode;
}

export const SplashProvider: React.FC<SplashProviderProps> = ({ children }) => {
    // Check if user has already seen splash in this session
    const [hasSeenSplash, setHasSeenSplash] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(SPLASH_STORAGE_KEY) === 'true';
        }
        return false;
    });

    const [isExiting, setIsExiting] = useState(false);
    const [showSplash, setShowSplash] = useState(!hasSeenSplash);

    const dismissSplash = () => {
        setIsExiting(true);

        // Wait for fade-out animation to complete
        setTimeout(() => {
            setShowSplash(false);
            setHasSeenSplash(true);

            // Store in session storage so splash doesn't show again during navigation
            if (typeof window !== 'undefined') {
                sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
            }
        }, 700); // Match the CSS transition duration
    };

    const contextValue: SplashContextType = {
        hasSeenSplash,
        dismissSplash,
    };

    return (
        <SplashContext.Provider value={contextValue}>
            {showSplash && (
                <SplashScreen onEnter={dismissSplash} isExiting={isExiting} />
            )}

            {/* Main app content - hidden behind splash initially */}
            <div
                className={`
          transition-opacity duration-500
          ${showSplash ? 'opacity-0' : 'opacity-100'}
        `}
                aria-hidden={showSplash}
            >
                {children}
            </div>
        </SplashContext.Provider>
    );
};

export const useSplash = (): SplashContextType => {
    const context = useContext(SplashContext);
    if (context === undefined) {
        throw new Error('useSplash must be used within a SplashProvider');
    }
    return context;
};

export default SplashProvider;
