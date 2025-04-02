import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout/DefaultLayout'
import routes from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser, clearAccessToken } from './redux/authSlice';
import axiosInstance from './config/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MovieProvider } from './pages/components/MovieContext';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('https://hmovie.onrender.com/auth/status')
      
      dispatch(setUser(response.data.user));
      dispatch(setAccessToken(response.data.accessToken));
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(clearAccessToken());
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [dispatch]);

  return (
    <>
      <MovieProvider>
        <Router>
          <Routes>
            {routes.map((route, index) => {
              const Page = route.component;
              const Layout = route.layout || DefaultLayout;
              return (
                <Route key={index} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </MovieProvider>
    </>
  )
}

export default App
