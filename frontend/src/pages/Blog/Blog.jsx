import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaComment, FaSearch } from 'react-icons/fa';
import './Blog.css';
import images from '../../assets/img';

function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Dữ liệu mẫu cho blog
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 phim hay nhất năm 2023 bạn không thể bỏ lỡ',
      excerpt: 'Những bộ phim đáng xem nhất năm 2023 với những cảnh quay đẹp mắt và cốt truyện hấp dẫn...',
      content: 'Nội dung chi tiết về top 10 phim hay nhất 2023...',
      image: images.banner1 || 'https://images.unsplash.com/photo-1616530940355-351fabd9524b',
      author: 'Minh Tuấn',
      date: '15/11/2023',
      category: 'Đánh giá phim',
      comments: 45
    },
    {
      id: 2,
      title: 'Phân tích chi tiết về cái kết của Oppenheimer',
      excerpt: 'Bộ phim Oppenheimer của Christopher Nolan đã để lại nhiều câu hỏi với cái kết đầy suy ngẫm...',
      content: 'Nội dung phân tích về cái kết của Oppenheimer...',
      image: images.banner2 || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
      author: 'Thanh Hà',
      date: '28/10/2023',
      category: 'Phân tích phim',
      comments: 32
    },
    {
      id: 3,
      title: 'Lịch chiếu phim bom tấn 2024 - Chuẩn bị bùng nổ với loạt phim Marvel mới',
      excerpt: 'Năm 2024 hứa hẹn sẽ là một năm bùng nổ của điện ảnh với hàng loạt bom tấn được lên lịch ra mắt...',
      content: 'Thông tin chi tiết về lịch chiếu phim 2024...',
      image: images.banner3 || 'https://images.unsplash.com/photo-1635805737707-575885ab0820',
      author: 'Hoàng Long',
      date: '05/12/2023',
      category: 'Tin tức điện ảnh',
      comments: 18
    },
    {
      id: 4,
      title: 'Hậu trường thú vị của bộ phim "The Batman" mà ít ai biết',
      excerpt: 'Những câu chuyện hậu trường thú vị và những khó khăn trong quá trình sản xuất bộ phim The Batman...',
      content: 'Chi tiết về hậu trường The Batman...',
      image: images.ImgMovie || 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f',
      author: 'Thùy Linh',
      date: '20/09/2023',
      category: 'Hậu trường',
      comments: 27
    },
    {
      id: 5,
      title: 'Những xu hướng phim ảnh mới nổi trong năm 2023',
      excerpt: 'Điểm qua những xu hướng phim ảnh đang thịnh hành và được khán giả yêu thích trong năm 2023...',
      content: 'Chi tiết về các xu hướng phim ảnh 2023...',
      image: images.banner2 || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
      author: 'Anh Tú',
      date: '03/08/2023',
      category: 'Xu hướng',
      comments: 36
    },
    {
      id: 6,
      title: 'Cách Nolan tạo nên những tác phẩm kinh điển - Từ Inception đến Oppenheimer',
      excerpt: 'Đi sâu vào phong cách đạo diễn độc đáo của Christopher Nolan và cách ông tạo nên những kiệt tác điện ảnh...',
      content: 'Phân tích phong cách đạo diễn của Christopher Nolan...',
      image: images.banner1 || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1',
      author: 'Minh Khải',
      date: '17/11/2023',
      category: 'Phân tích phim',
      comments: 52
    }
  ];

  const categories = [
    'Tất cả',
    'Đánh giá phim',
    'Phân tích phim',
    'Tin tức điện ảnh',
    'Hậu trường',
    'Xu hướng'
  ];

  // Lọc bài viết theo category và search term
  useEffect(() => {
    const results = blogPosts.filter(post => {
      const matchCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
      const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
    
    setFilteredPosts(results);
  }, [searchTerm, activeCategory]);

  return (
    <>
      <div className="blog-container">
        <div className="blog-header">
          <div className="blog-header-content">
            <h1>Blog Phim</h1>
            <p>Tin tức, đánh giá và phân tích phim mới nhất</p>
          </div>
        </div>
        
        <div className="blog-main">
          <div className="blog-sidebar">
            <div className="blog-search">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            
            <div className="blog-categories">
              <h3>Danh mục</h3>
              <ul>
                {categories.map(category => (
                  <li 
                    key={category}
                    className={activeCategory === category ? 'active' : ''}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="blog-recent">
              <h3>Bài viết gần đây</h3>
              <ul>
                {blogPosts.slice(0, 3).map(post => (
                  <li key={post.id}>
                    <Link to={`/blog/${post.id}`}>
                      <img src={post.image} alt={post.title} />
                      <div>
                        <h4>{post.title}</h4>
                        <p>{post.date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="blog-content">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div className="blog-post" key={post.id}>
                  <div className="blog-post-image">
                    <Link to={`/blog/${post.id}`}>
                      <img src={post.image} alt={post.title} onError={(e) => { e.target.src = images.ImgMovie }} />
                    </Link>
                  </div>
                  <div className="blog-post-info">
                    <span className="blog-post-category">{post.category}</span>
                    <h2 className="blog-post-title">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                    <div className="blog-post-meta">
                      <span><FaUser /> {post.author}</span>
                      <span><FaCalendarAlt /> {post.date}</span>
                      <span><FaComment /> {post.comments} bình luận</span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="read-more">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>Không tìm thấy bài viết nào phù hợp</h3>
                <p>Vui lòng thử với từ khóa khác hoặc chọn danh mục khác</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;