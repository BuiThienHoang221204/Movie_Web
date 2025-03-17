import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout/DefaultLayout'
import routes from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from './redux/authSlice';
import axiosInstance from './config/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('auth/status');

      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        dispatch(setAccessToken(response.data.accessToken));
        console.log(response.data.user);
      }

    } catch (error) {
      if (error.response.status === 401) {
        dispatch(setUser(null));
        dispatch(setAccessToken(null));
      }
    }
  };

  useEffect(() => {
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
