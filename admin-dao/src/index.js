import React from 'react';
import { createRoot } from 'react-dom/client';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import App from './App.js';
import './index.css';

const container = document.getElementById('root');
console.log(container);
const root = createRoot(container);

root.render(
  <DappProvider
    environment="devnet"
    customNetworkConfig={{ name: 'customConfig', walletConnectV2ProjectId: 'ac72cb58951a383822c6e91aab11505c' }}
  >
    <App />
    <SignTransactionsModals />
  </DappProvider>
);
