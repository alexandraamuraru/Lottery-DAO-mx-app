import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import Login from './components/Login.js';
import DAOMemberDashboard from './components/DAOMemberDashboard.js';
import InfoPage from './components/InfoPage.js';
import ActiveLotteries from './components/ActiveLotteries.js';
import TokenHolders from './components/TokenHolders.js';
import './App.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Alexandra's DAO</h1>
      <Link to="/unlock">
        <button>Login</button>
      </Link>
      <Link to="/member">
        <button>DAO Member Dashboard</button>
      </Link>
      <Link to="/info">
        <button>View Info Page</button>
      </Link>
    </div>
  );
};

const App = () => {

  console.log("rendered");
  const routes = [
    {
      path: "/member",
      title: "DAO Member Dashboard",
      component: DAOMemberDashboard,
      authenticatedRoute: true
    },
    {
      path: '/info',
      title: 'Info Page',
      component: InfoPage,
      authenticatedRoute: true
    },
    {
      path: '/active-lotteries',
      title: 'Active Lotteries',
      component: ActiveLotteries,
      authenticatedRoute: true
    },
    {
      path: '/token-holders',
      title: 'Token Holders',
      component: TokenHolders,
      authenticatedRoute: true
    }
  ];

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unlock" element={<Login />} />
        <Route
          path="*"
          element={
            <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
              <Routes>
                <Route path="/member" element={<DAOMemberDashboard />} />
                <Route path="/info" element={<InfoPage />} />
              </Routes>
            </AuthenticatedRoutesWrapper>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
