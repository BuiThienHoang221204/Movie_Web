import config from '../config';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import LoginLayout from '../layout/LoginLayout/LoginLayout';
import WatchMovie from '../pages/WatchMovie/WatchMovie';
import Blog from '../pages/Blog/Blog';
import {AllRecomment} from '../pages/components';
import Filter from '../pages/Filter/Filter';
import UserProfile from '../pages/components/UserProfile';
import UserInfo from '../pages/components/UserInfo';

const routes = [
    {
        path: config.home,
        component: Home,
    },
    {
        path: config.login,
        component: Login,
        layout: LoginLayout,
    },
    {
        path: config.signup,
        component: Signup,
        layout: LoginLayout,
    },
    {
        path: config.watchDetail,
        component: WatchMovie,
    },
    {
        path: config.blog,
        component: Blog,
    },
    {
        path: config.allRecomment,
        component: AllRecomment,
    },
    {
        path: config.filter,
        component: Filter,
    },
    {
        path: '/profile',
        component: UserProfile,
    },
    {
        path: '/user-info',
        component: UserInfo,
    }
];

export default routes;