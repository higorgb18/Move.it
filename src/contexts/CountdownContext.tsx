import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContex";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}


export const CountdownContext = createContext({} as CountdownContextData)
let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({children}: CountdownProviderProps) { //({}: ...) => propriedade = CountdownProviderProps
    const {startNewChallenge} = useContext(ChallengesContext);

    const [time, setTime] = useState(25*60); //25 minutos em segundos
    const [isActive, setIsActive] = useState(false); //armazena se o countdown está acontecendo ou está parado
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(25*60);
    }

    useEffect(() => {                 //(O que eu quero executar, quando eu quero executar)
        if(isActive && time > 0){
            countdownTimeout = setTimeout(() =>{
                setTime(time-1);
            }, 1000)
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time]) //reduz cada vez que o time muda. Enquanto isActive = true, o contador continua

        return (    
            <CountdownContext.Provider value={{
                minutes,
                seconds,
                hasFinished,
                isActive,
                startCountdown,
                resetCountdown,
            }}>
                {children}
            </CountdownContext.Provider>
        ) 
}