import Head from 'next/head';

import { GetServerSideProps } from 'next';
import React from "react";
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import styles from '../styles/pages/Home.module.css';
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesProvider } from '../contexts/ChallengesContex';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  return (
    <ChallengesProvider 
    level={props.level} 
    currentExperience={props.currentExperience}
    challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Moveit</title>
        </Head>
      <ExperienceBar />

      <CountdownProvider>
      <section>
        <div>
          <Profile />
          <CompletedChallenges />
          <Countdown />
        </div>
        <div>
          <ChallengeBox />
        </div>
      </section>
      </CountdownProvider>
    </div>
  </ChallengesProvider>
  )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const {
    level,
    currentExperience,
    challengesCompleted
  } = ctx.req.cookies;
  
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    }
  }
} //manipula os dados do servidor Next(Node.js) pro cliente da camada front-end(react)
  //nesse método, o Next faz a chamada api e pega os dados já prontos pro componentes, mostrando os dados em tela