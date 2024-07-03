import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useNavigate } from 'react-router-dom';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account';
import { useIdleTimer} from '@multiversx/sdk-dapp/web';
import { logout } from '@multiversx/sdk-dapp/utils';
import useActiveLotteries from './hooks/useActiveLotteries';
import './DAOMemberDashboard.css';

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

const DAOMemberDashboard = () => {
    const { address } = useGetAccountInfo();
    const { isLoggedIn } = useGetLoginInfo();
    const { lotteries, loading, error } = useActiveLotteries(address);
    console.log('DAOMemberDashboard component rendered');
    const sessionExpired = useSessionCheck();
  
    const [lotteryName, setLotteryName] = useState('');
    const tokenIdentifier = "ALXCOIN-308d90";
    const tokenAmount = new BigNumber(1).shiftedBy(18);
  
    useEffect(() => {
      if (isLoggedIn) {
        refreshAccount();
      }
    }, [isLoggedIn]);
  
    const padHex = (str) => str.length % 2 ? `0${str}` : str;
    const toHex = (str) => Buffer.from(str, 'utf8').toString('hex');
  
    const handleBuyTicket = async () => {
      const transactionData = [
        padHex(toHex('buy_ticket')),
        padHex(toHex(lotteryName))
      ].join('@');

      const esdtTransferData = [
        `ESDTTransfer@${padHex(toHex(tokenIdentifier))}@${padHex(tokenAmount.toString(16))}`,
        transactionData
      ].join('@');
  
      const transaction = {
        sender: address,
        receiver: 'erd1qqqqqqqqqqqqqpgqhdc2aqx208zlwl7wr9rvg0awexl4hk53vwqqt9fsac',
        gasLimit: '5000000',
        value: '0',
        data: esdtTransferData,
      };
  
      const { sessionId, error } = await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: 'Processing transaction',
          errorMessage: 'An error occurred during the transaction',
          successMessage: 'Ticket bought successfully'
        }
      });
  
      if (error) {
        console.error('Transaction error:', error);
      } else {
        console.log('Transaction sessionId:', sessionId);
      }
    };

    const handleClaimRewards = async () => {
        const transactionData = ['claimRewards', padHex(toHex(tokenIdentifier))].join('@');
    
        const transaction = {
          value: '0',
          data: transactionData,
          receiver: 'erd1qqqqqqqqqqqqqpgqnzjjeygr897tnfgvyfcl4tvsc4ycmqrnvwqqd8jdvt',
          gasLimit: '5000000',
        };
    
        const { sessionId, error } = await sendTransactions({
          transactions: [transaction],
          transactionsDisplayInfo: {
            processingMessage: 'Processing transaction',
            errorMessage: 'An error occurred during the transaction',
            successMessage: 'Rewards claimed successfully',
          },
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
  
    const isBuyTicketDisabled = !lotteryName;
  
    if (!isLoggedIn) {
      return <div>Please log in to access the DAO member dashboard.</div>;
    }
  
    if (sessionExpired) {
      return <div>Session expired. Please log in again.</div>;
    }
  
    return (
      <div className="member-dashboard">
        <h1>DAO Member Dashboard</h1>
        <p>Logged in as: {address}</p>
        <button onClick={handleLogout}>Logout</button>
        <div className="member-actions">
          <div className="member-action">
            <h2>Buy Ticket</h2>
            <select value={lotteryName} onChange={(e) => setLotteryName(e.target.value)} disabled={loading || error}>
              <option value="">Select Lottery</option>
              {loading && <option>Loading...</option>}
              {error && <option>Error loading lotteries</option>}
              {!loading && !error && lotteries.map((lottery, index) => (
                <option key={index} value={lottery}>{lottery}</option>
              ))}
            </select>
            <button onClick={handleBuyTicket} disabled={isBuyTicketDisabled}>Buy Ticket</button>
          </div>
          <div className="member-action">
            <h2>Claim Rewards</h2>
            <button onClick={handleClaimRewards}>Claim Rewards</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DAOMemberDashboard;
  