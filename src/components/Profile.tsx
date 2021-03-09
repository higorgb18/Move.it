import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContex';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const {level} = useContext(ChallengesContext);

    return(
        <div className={styles.profileContainer}>
            <img src="https://github.com/higorgb18.png" alt="Higor"/>
            <div>
                <strong>Higor Brandão</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}    
                </p>
            </div>
        </div>
    );
}