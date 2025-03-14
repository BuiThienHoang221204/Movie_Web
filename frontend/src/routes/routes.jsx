import config from '../config';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import LoginLayout from '../layout/LoginLayout/LoginLayout';

const routes = [
    {
        path: config.home,
        component: Home,
    },
    {
        path: '/login',
        component: Login,
        layout: LoginLayout,
    },
    {
        path: '/signup',
        component: Signup,
        layout: LoginLayout,
    }
];

export default routes;