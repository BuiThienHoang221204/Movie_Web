import apiClient from './api';

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
            const response = await apiClient.get(`/movies/${id}`)//gọi API để lấy chi tiết phim
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
    },
    getWatchHistory: async (userId) => {//lấy lịch sử xem phim
        try {
            const response = await apiClient.get(`/movieHistories/${userId}`);//sửa lại endpoint cho đúng
            return response.data; //trả về dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử xem phim:', error);
            throw error;
        }
    },
    addWatchHistory: async (data) => {//thêm lịch sử xem phim
        try {
            const response = await apiClient.post('/movieHistories', data);//sửa lại endpoint cho đúng
            return response.data; //trả về dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi thêm lịch sử xem phim:', error);
            throw error;
        }
    },
    deleteWatchHistory: async (id) => {//xóa lịch sử xem phim
        try {
            const response = await apiClient.delete(`/movieHistories/${id}`);//sửa lại endpoint cho đúng
            return response.data; //trả về dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi xóa lịch sử xem phim:', error);
            throw error;
        }
    },
    updateWatchHistory: async (id, data) => {//cập nhật lịch sử xem phim
        try {
            const response = await apiClient.put(`/movieHistories/${id}`, data);//sửa lại endpoint cho đúng
            return response.data; //trả về dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi cập nhật lịch sử xem phim:', error);
            throw error;
        }
    },
    getAllWatchHistories: async () => {//lấy tất cả lịch sử xem phim
        try {
            const response = await apiClient.get('/movieHistories');//sửa lại endpoint cho đúng
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy tất cả lịch sử xem phim:', error);
            throw error;
        }
    }
}

export default movieService;
