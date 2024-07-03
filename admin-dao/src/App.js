import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import InfoPage from './components/InfoPage';
import ActiveLotteries from './components/ActiveLotteries';
import TokenHolders from './components/TokenHolders';
import './App.css';
import EndedLotteries from './components/hooks/useEndedLotteries';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Alexandra's DAO</h1>
      <Link to="/unlock">
        <button>Login</button>
      </Link>
      <Link to="/admin">
        <button>Admin Dashboard</button>
      </Link>
      <Link to="/info">
        <button>View Info Page</button>
      </Link>
    </div>
  );
};

const App = () => {
  console.log('rendered');
  const routes = [
    {
      path: '/admin',
      title: 'Admin Dashboard',
      component: AdminDashboard,
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
    },
    {
      path: '/ended-lotteries',
      title: 'Ended Lotteries',
      component: EndedLotteries,
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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/active-lotteries" element={<ActiveLotteries />} />
                <Route path="/token-holders" element={<TokenHolders />} />
                <Route path="/ended-lotteries" element={<EndedLotteries />} />
              </Routes>
            </AuthenticatedRoutesWrapper>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
