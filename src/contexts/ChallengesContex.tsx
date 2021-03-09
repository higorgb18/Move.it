import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';


interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps { //pra fazer tipagem de children
    children: ReactNode; //ReactNode aceita qualquer elemento children como filho
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
    children,
    ...rest //pega todo o resto que não foi usado (level, currentExperience e challengesCompleted)
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1); //usa rest.level, se não existir, usa 1
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2 ) //(usado em rpg) - level + 1 => próx level | *4 => fator de experiencia (deixa mais difícil ou fácil) | 2 => cálculo em potência dois

    useEffect(() => {
        Notification.requestPermission();
    }, []) //sideeffect/ efeito colateral; O segundo parametro é um array vazio, ou seja, a primeira função vai ser executada uma única vez assim que o componente for exibido em tela.

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]); //disparar uma função sempre que alguma informação mudar [level. cE, cC]

    function levelUp() {
      setLevel(level + 1);
      setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
       const randomChallengeIndex = Math.floor(Math.random() * challenges.length) //Math.floor arredonda pra baixo (número inteiro). Math.random gera um número aleatório entre 0 e 1, o * challenges.length é feito para multiplicar esse valor pelo número de desafios e assim gerar uma nova lista de valores randomicos.
       const challenge = challenges[randomChallengeIndex];

       setActiveChallenge(challenge)

       new Audio('/notification.mp3').play()

       if (Notification.permission === 'granted') {
           new Notification('Novo desafio 🎉', {
               body: `Valendo ${challenge.amount} xp!`,
               icon: '/catjam.gif'
           })
       }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const {amount} = activeChallenge;
        let finalExperience = currentExperience + amount;
        
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted+1);
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level,
                currentExperience,
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}

// o contexts serve para fazer a ligação entre os códigos. Como a aplicação está dividida por funcionalidade, seria difícl realizar essa interação entre os códigos, como por exemplo o disparo de desafios quando o contador chega a zero. É uma forma de ter acesso à informação de diversos lugares.


