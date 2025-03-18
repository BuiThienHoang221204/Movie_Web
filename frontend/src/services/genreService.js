import apiClient from './api';

//tạo service để lấy dữ liệu từ API
const movieService = {
    getAllGenres: async () => {//lấy tất cả thể loại
        try{
            const response = await apiClient.get(`/genres/all`) //gọi API để lấy tất cả thể loại
            return response.data; //trả về dữ liệu từ API
        }catch(error){
            console.error('Lỗi khi lấy tất cả thể loại:', error);
            throw error;
        }
    },
}

export default movieService;
