import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout/DefaultLayout'
import routes from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from './redux/authSlice';
import axiosInstance from './config/axios';
import { server } from './config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get(`${server}/auth/status`);
        if (response.data.user) {
          dispatch(setUser(response.data.user));
          dispatch(setAccessToken(response.data.accessToken));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <>
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
    </>
  )
}

export default App
