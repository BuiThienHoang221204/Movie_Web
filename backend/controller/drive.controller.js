const { connectGoogleDrive } = require("../config/auth/drive.config")

const getFilms = async (req, res) => {
    try {
        const drive = connectGoogleDrive();
        const title = req.params.title;
        
        const response = await drive.files.list({
            q: `name contains '${title}' and trashed = false`,
            pageSize: 20,
            fields: 'files(id, name, webViewLink, webContentLink, mimeType, thumbnailLink, size)',
        });
        
        const films = response.data.files;
        
        if (films && films.length > 0) {
            res.status(200).json({ success: true, data: films });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy film nào' });
        }
    } catch (error) {
        console.error('Error fetching films:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi lấy danh sách film', 
            error: error.message 
        });
    }
}

module.exports = { getFilms }
