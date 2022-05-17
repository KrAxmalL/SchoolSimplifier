import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/public/Login';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';
import './App.css';
import { useSelector } from 'react-redux';
import { getHomePageForUser } from './utils/navigation';

function App() {
  const roles = useSelector(state => state.auth.roles);

  return (
    <div className="App">
      <Routes>
        <Route path='/' exact element={<Navigate redirect to={getHomePageForUser(roles)} />}></Route>
        <Route path='/login' exact element={<Login />}></Route>
        <Route path='/unauthorized' exact element={<Unauthorized />}></Route>

        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
