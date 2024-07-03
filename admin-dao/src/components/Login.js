import React from 'react';
import { ExtensionLoginButton, WebWalletLoginButton, WalletConnectLoginButton, LedgerLoginButton } from '@multiversx/sdk-dapp/UI';
import './Login.css';

const Login = () => {
  console.log('Login component rendered');

  return (
    <div className="login">
      <h1>Connect to your wallet!</h1>
      <ExtensionLoginButton
        callbackRoute="/admin"
        buttonClassName="extension-login"
        loginButtonText="Login with Extension"
      />
      <WebWalletLoginButton
        callbackRoute="/admin"
        buttonClassName="web-wallet-login"
        loginButtonText="Login with Web Wallet"
      />
      <WalletConnectLoginButton
        callbackRoute="/admin"
        buttonClassName="wallet-connect-login"
        loginButtonText="Login with WalletConnect"
      />
      <LedgerLoginButton
        callbackRoute="/admin"
        buttonClassName="ledger-login"
        loginButtonText="Login with Ledger"
      />
    </div>
  );
};

export default Login;



