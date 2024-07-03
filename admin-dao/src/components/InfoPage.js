import React from 'react';
import TokenHolders from './TokenHolders';
import ActiveLotteries from './ActiveLotteries';
import './InfoPage.css';
import EndedLotteries from './EndedLotteries';

const InfoPage = () => {
  return (
    <div className="info-page">
      <div className="info-page-title">
        Information Page
      </div>
      <div className="info-section">
        <div className="paragraph">
            <h2>Welcome to Alexandra's DAO! Here are the rules:</h2>
            <ul>
            <li>A DAO is a Decentralized Autonomous Organization. It is designed to bring a new, more open and democratic management structure to collaborative projects in web3. This DAO offers its members the chance to participate in lotteries, where they can win prizes consisting of big token amounts, but every holder receives an amount of the DAO's token from the prize pool, as a reward for being a member.</li>
            <li>To be a member of the DAO, you have to be a token holder. This means that you have to own any amount of ALXCOIN in your MultiversX wallet.</li>
            <li>To participate in a lottery, you have to buy at least one ticket. For every lottery, the ticket's price is 1 ALXCOIN, and you can purchase one lottery ticket at a time.</li>
            <li>After the deadline of the lottery is due, the DAO's admin will activate the winner determination, which will result in 3 winning tickets. The first one wins the owner of the ticket 40% of the pool prize, the second one 20%, and the third one 10%. The winners will be automatically sent their prizes. The rest of 30% of the pool prize will be distributed among all of the DAO's members, when the admin decides, according to the amount of ALXCOIN they are holding. They can claim their prizes from their dashboard.</li>
            <li>Now that you know the rules of the game, good luck! May the odds be in your favor!</li>
            </ul>
        </div>
      </div>
      <div className="info-section">
        <TokenHolders />
      </div>
      <div className="info-section">
        <ActiveLotteries />
      </div>
      <div className="info-section">
        <EndedLotteries />
      </div>
    </div>
  );
};

export default InfoPage;
