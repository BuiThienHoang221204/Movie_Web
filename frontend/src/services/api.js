import axios from 'axios';

import { server } from '../config'; //import server từ config.js

//thiết lập mặt định cho axios
const apiClient = axios.create({
    baseURL: `${server}/api/v1`, //URL cơ sở dữ liệu của backend
    headers:{//thêm header cho request
        'Content-Type': 'application/json', //định dạng dữ liệu gửi đi là json
        'Accept': 'application/json', //định dạng dữ liệu nhận về là json
    },
    timeout: 20000, //thời gian chờ request là 10s
});

//Interceptor được sử dụng để chặn và xử lý request hoặc response trước khi chúng được gửi đến server
//Interceptor request
apiClient.interceptors.request.use(
    config => { //config là cấu hình của request
        const token = localStorage.getItem('authToken') //lấy giá trị key authToken từ local storage
        if(token){
            config.headers.Authorization = `Bearer ${token}` //thêm token vào header của request
        }
        return config; //trả về cấu hình đã được cập nhật
    },
    error => {
        return Promise.reject(error); //trả về lỗi nếu có lỗi xảy ra
    }
)

//Interceptor response
apiClient.interceptors.response.use(
    response => {
        return response; //trả về response từ server
    },
    error => {
        //xử lí lỗi response
        if(error.response){
            console.log('API lỗi: ', error.response.data);

            //xử lí lỗi 401
            if(error.response.status === 401){
                localStorage.removeItem('authToken'); //xóa token khỏi local storage (đăng nhập lại hoặc refresh token)
            }
        }else if (error.request){ //lỗi khi không nhận được response từ server
            console.error('Network Error:', error.request)
        }else{
            //lỗi khi thiết lập request
            console.error('Error:', error.message)
        }
        return Promise.reject(error); 
    }
)
export default apiClient;
