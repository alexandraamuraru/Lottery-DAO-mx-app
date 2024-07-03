import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account';
import { logout } from '@multiversx/sdk-dapp/utils';
import {useIdleTimer} from '@multiversx/sdk-dapp/web';
import { BigNumber } from 'bignumber.js';
import { useEndedLotteries } from './hooks/useEndedLotteries';
import './AdminDashboard.css';

const useSessionCheck = () => {
  const { address, loggedIn } = useGetAccountInfo();
  const navigate = useNavigate();
  const [sessionExpired, setSessionExpired] = useState(false);

  useIdleTimer({
    timeout: 15 * 60 * 1000, // 15 minutes
    onIdle: () => {
      if (loggedIn) {
        refreshAccount();
      } else {
        setSessionExpired(true);
        navigate('/unlock');
      }
    },
  });

  useEffect(() => {
    if (loggedIn) {
      refreshAccount();
    }
  }, [loggedIn]);

  return sessionExpired;
};

const AdminDashboard = () => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const { lotteries, loading, error } = useEndedLotteries(address);
  console.log('AdminDashboard component rendered');
  const sessionExpired = useSessionCheck();

  const [lotteryName, setLotteryName] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxEntriesPerUser, setMaxEntriesPerUser] = useState('');
  const [prizeDistribution, setPrizeDistribution] = useState('');
  const [winnerLotteryName, setWinnerLotteryName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      refreshAccount();
    }
  }, [isLoggedIn]);

  const tokenIdentifier = "ALXCOIN-308d90";
  const ticketPrice = new BigNumber(1).shiftedBy(18);

  const padHex = (str) => str.length % 2 ? `0${str}` : str;
  const toHex = (str) => Buffer.from(str, 'utf8').toString('hex');

  const handleCreateLottery = async () => {
    const transactionData = [
      'start',
      padHex(toHex(lotteryName)),
      padHex(toHex(tokenIdentifier)),
      padHex(ticketPrice.toString(16)),
      totalTickets ? padHex(new BigNumber(totalTickets).toString(16)) : '',
      deadline ? padHex(new BigNumber(deadline).toString(16)) : '',
      maxEntriesPerUser ? padHex(new BigNumber(maxEntriesPerUser).toString(16)) : '',
      prizeDistribution ? padHex(toHex(prizeDistribution)) : ''
    ].join('@');

    const transaction = {
      value: '0',
      data: transactionData,
      receiver: 'erd1qqqqqqqqqqqqqpgqhdc2aqx208zlwl7wr9rvg0awexl4hk53vwqqt9fsac',
      gasLimit: '5000000'
    };

    const { sessionId, error } = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error occurred during the transaction',
        successMessage: 'Lottery created successfully'
      }
    });

    if (error) {
      console.error('Transaction error:', error);
    } else {
      console.log('Transaction sessionId:', sessionId);
    }
  };

  const handleDetermineWinner = async () => {
    const transactionData = [
      'determine_winner',
      padHex(toHex(winnerLotteryName))
    ].join('@');

    const transaction = {
      value: '0',
      data: transactionData,
      receiver: 'erd1qqqqqqqqqqqqqpgqhdc2aqx208zlwl7wr9rvg0awexl4hk53vwqqt9fsac',
      gasLimit: '15000000',
      gasPrice: '2000000000'
    };

    const { sessionId, error } = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error occurred during the transaction',
        successMessage: 'Winner determined successfully'
      }
    });

    if (error) {
      console.error('Transaction error:', error);
    } else {
      console.log('Transaction sessionId:', sessionId);
    }
  };

  const handleDistributeRewards = async () => {
    const transactionData = [
      'distributeRewards',
      padHex(toHex(tokenIdentifier))
    ].join('@');

    const transaction = {
      value: '0',
      data: transactionData,
      receiver: 'erd1qqqqqqqqqqqqqpgqnzjjeygr897tnfgvyfcl4tvsc4ycmqrnvwqqd8jdvt',
      gasLimit: '10000000'
    };

    const { sessionId, error } = await sendTransactions({
      transactions: [transaction],
      transactionsDisplayInfo: {
        processingMessage: 'Processing transaction',
        errorMessage: 'An error occurred during the transaction',
        successMessage: 'Rewards distributed successfully'
      }
    });

    if (error) {
      console.error('Transaction error:', error);
    } else {
      console.log('Transaction sessionId:', sessionId);
    }
  };


  const handleLogout = () => {
    logout('/');
  };

  const isCreateLotteryDisabled = !lotteryName;
  const isDetermineWinnerDisabled = !winnerLotteryName;

  if (!isLoggedIn) {
    return <div>Please log in to access the admin dashboard.</div>;
  }

  if (sessionExpired) {
    return <div>Session expired. Please log in again.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Logged in as: {address}</p>
      <button onClick={handleLogout}>Logout</button>
      <div className="admin-actions">
        <div className="admin-action">
          <h2>Create Lottery</h2>
          <input type="text" placeholder="Lottery Name *" value={lotteryName} onChange={(e) => setLotteryName(e.target.value)} />
          <input type="text" placeholder="Total Tickets" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
          <input type="text" placeholder="Deadline (Unix Timestamp)" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <input type="text" placeholder="Max Entries Per User" value={maxEntriesPerUser} onChange={(e) => setMaxEntriesPerUser(e.target.value)} />
          <p className="note">Note: Total tickets default to 800, deadline defaults to 10 minutes, and prize distribution is set to 40%, 20%, 10%.</p>
          <p className="note">30% of the prize pool will be distributed to the dao members!</p>
          <button onClick={handleCreateLottery} disabled={isCreateLotteryDisabled}>Create Lottery</button>
        </div>
        <div className="admin-action">
          <h2>Determine Winner</h2>
          <select value={winnerLotteryName} onChange={(e) => setWinnerLotteryName(e.target.value)} disabled={loading || error}>
            <option value="">Select Lottery</option>
            {loading && <option>Loading...</option>}
            {error && <option>Error loading lotteries</option>}
            {!loading && !error && lotteries.map((lottery, index) => (
              <option key={index} value={lottery}>{lottery}</option>
            ))}
          </select>
          <button onClick={handleDetermineWinner} disabled={isDetermineWinnerDisabled}>Determine Winner</button>
        </div>
        <div className="admin-action">
          <h2>Distribute Rewards</h2>
          <button onClick={handleDistributeRewards}>Distribute Rewards</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
