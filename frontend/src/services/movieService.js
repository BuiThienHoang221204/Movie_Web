import apiClient from './api';

//tạo service để lấy dữ liệu từ API
const movieService = {
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
            const response = await apiClient.get(`/movies/${id}`)//gọi API để lấy chi tiết phim
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error(`Lỗi khi lấy chi tiết phim với id ${id}:`, error);
            throw error;
        }
    },
    getAllMovies: async () => {//lấy tất cả phim
        try{
            const response = await apiClient.get(`/movies/all`)//gọi API để lấy tất cả phim
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error('Lỗi khi lấy tất cả phim:', error);
            throw error;
        }
    },
}

export default movieService;
