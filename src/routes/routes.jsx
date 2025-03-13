import config from '../config';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import EmtyLayout from '../layout/EmtyLayout/EmtyLayout';

const routes = [
    {
        path: config.home,
        component: Home,
    },
    {
        path : config.login,
        component: Login,
        layout: EmtyLayout, // Sử dụng EmtyLayout khi không có layout 
    }
];
export default routes;