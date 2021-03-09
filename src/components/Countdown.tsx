import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContex';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown () {
    
    const {
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
    } = useContext(CountdownContext)
    
    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            {hasFinished ? (
                 <button
                    disabled
                    className={styles.countdownButton} //concatenando duas strings
                 >
                    Ciclo encerrado
                </button>
            ) : (
                <>
                    { isActive ? (
                        <button 
                            type="button"
                            className={`${styles.countdownButton} ${styles.countdownButtonActive}`} //concatenando duas strings
                            onClick={resetCountdown}
                            >
                            Abandonar o ciclo
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className={styles.countdownButton}
                            onClick={startCountdown}
                            >
                            Iniciar o ciclo
                        </button>
                    )}
                </> // o <> </> (fragment) foi utilizado nesse caso pois é necessário um elemento antes de ser colocado o código JS. A div supre essa necessidade, mas se torna inútil. O fragment não é exibido, pois não existe
            ) }
        </div>
    );
}