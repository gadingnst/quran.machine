/* eslint-disable @next/next/no-html-link-for-pages */

import { Fragment } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from 'styles/pages/index.module.css';

const Home: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Qur&apos;an Machine (BOT)</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles['main-content']}>
        <div className={styles['content']}>
          <p className={styles['title']}>
            Qur&apos;an Machine (BOT)
          </p>
          <p className={styles['text']}>
            <a href="https://github.com/sutanlab/quran-machine">Source Code</a>
          </p>
          <p className={styles['text']}>
            <a href="https://instagram.com/quran.machine">Instagram Account</a>
          </p>
          <p className={styles['copyright']}>
            Copyright @ <a href="https://gading.dev" target="_blank" rel="noreferrer">gading.dev</a>
          </p>
        </div>
      </main>
    </Fragment>
  );
};

export default Home;