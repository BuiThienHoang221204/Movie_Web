import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout/DefaultLayout'
import routes from './routes'
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setAccessToken } from './redux/authSlice';
// import Cookies from 'js-cookie';
function App() {

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const accessToken = Cookies.get('accessToken');

  //   if (accessToken) {
  //     dispatch(setAccessToken(accessToken));
  //     console.log(accessToken);
  //   }
  //   else {
  //     console.log("No access token found");
  //   }
  // }, [dispatch]);

  return (
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
  )
}

export default App
