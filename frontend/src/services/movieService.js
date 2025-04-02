import apiClient from './api';
import { server } from '../config'; //import server từ config.js
//tạo service để lấy dữ liệu từ API
const movieService = {
    getAllMovies: async () => {//lấy tất cả phim
        try{
            const response = await apiClient.get('/movies')//gọi API để lấy tất cả phim
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error('Lỗi khi lấy tất cả phim:', error);
            throw error;
        }
    },
    getRecommendMovies: async () => {//lấy phim đề xuất
        try{
            const response = await apiClient.get('/movies/recommend') //gọi API để lấy phim đề xuất
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error('Lỗi khi lấy phim đề xuất:', error);
            throw error;
        }
    },
    getNewMovies: async () => {//lấy phim mới
        try{
            const response = await apiClient.get('/movies/new')//gọi API để lấy phim mới
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error('Lỗi khi lấy phim mới:', error);
            throw error;
        }
    },
    getMovieDetail: async (id) => {//lấy chi tiết phim
        try{
            const response = await apiClient.get(`${server}/movies/${id}`)//gọi API để lấy chi tiết phim
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error(`Lỗi khi lấy chi tiết phim với id ${id}:`, error);
            throw error;
        }
    },
    getGenres: async () => {//lấy danh sách thể loại
        try {
            const response = await apiClient.get('/genres');//sửa lại endpoint cho đúng
            return response.data; //trả về dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thể loại:', error);
            throw error;
        }
    }
}

export default movieService;
