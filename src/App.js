import Homepage from './components/home/Homepage';

function getLoginUrl() {
  const configuredUrl = process.env.REACT_APP_LOGIN_URL;
  if (configuredUrl) return configuredUrl;

  const { hostname, port } = window.location;
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '3000') {
    return 'http://localhost:3000/login';
  }

  return '/login';
}

export default function App() {
  const openLogin = () => {
    window.location.href = getLoginUrl();
  };

  return <Homepage onLogin={openLogin} />;
}
