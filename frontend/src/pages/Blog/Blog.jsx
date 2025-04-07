import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaComment, FaSearch } from 'react-icons/fa';
import './Blog.css';
import images from '../../assets/img';

function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  // Dữ liệu mẫu cho blog
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Best Movies of 2023 You Can’t Miss',
      excerpt: 'The most must-watch movies of 2023 with stunning visuals and compelling storylines...',
      content: 'Detailed content about the top 10 best movies of 2023...',
      image: images.banner1 || 'https://images.unsplash.com/photo-1616530940355-351fabd9524b',
      author: 'Minh Tuấn',
      date: '11/15/2023',
      category: 'Movie Reviews',
      comments: 45
    },
    {
      id: 2,
      title: 'A Detailed Analysis of the Ending of Oppenheimer',
      excerpt: 'Christopher Nolan’s movie Oppenheimer left many questions with its thought-provoking ending...',
      content: 'Content analysis about the ending of Oppenheimer...',
      image: images.banner2 || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
      author: 'Thanh Hà',
      date: '10/28/2023',
      category: 'Movie Analysis',
      comments: 32
    },
    {
      id: 3,
      title: '2024 Blockbuster Movie Release Schedule - Get Ready for the New Marvel Movies',
      excerpt: '2024 promises to be an explosive year for cinema with a series of blockbuster movies scheduled for release...',
      content: 'Detailed information about the 2024 movie release schedule...',
      image: images.banner3 || 'https://images.unsplash.com/photo-1635805737707-575885ab0820',
      author: 'Hoàng Long',
      date: '12/05/2023',
      category: 'Cinema News',
      comments: 18
    },
    {
      id: 4,
      title: 'The Fascinating Behind-the-Scenes of "The Batman" That Few Know About',
      excerpt: 'Behind-the-scenes stories and the challenges during the production of The Batman...',
      content: 'Details about the behind-the-scenes of The Batman...',
      image: images.ImgMovie || 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f',
      author: 'Thùy Linh',
      date: '09/20/2023',
      category: 'Behind the Scenes',
      comments: 27
    },
    {
      id: 5,
      title: 'Emerging Movie Trends in 2023',
      excerpt: 'An overview of the popular movie trends that have captured the audience’s attention in 2023...',
      content: 'Detailed information about the movie trends of 2023...',
      image: images.banner2 || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
      author: 'Anh Tú',
      date: '08/03/2023',
      category: 'Trends',
      comments: 36
    },
    {
      id: 6,
      title: 'How Nolan Creates Masterpieces - From Inception to Oppenheimer',
      excerpt: 'A deep dive into Christopher Nolan’s unique directing style and how he creates cinematic masterpieces...',
      content: 'An analysis of Christopher Nolan’s directing style...',
      image: images.banner1 || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1',
      author: 'Minh Khải',
      date: '11/17/2023',
      category: 'Movie Analysis',
      comments: 52
    }
  ];

  const categories = [
    'All',
    'Movie Reviews',
    'Movie Analysis',
    'Cinema News',
    'Behind the Scenes',
    'Trends'
  ];

  // Lọc bài viết theo category và search term
  useEffect(() => {
    const results = blogPosts.filter(post => {
      const matchCategory = activeCategory === 'All' || post.category === activeCategory;
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
            <h1>Blog Movies</h1>
            <p>Latest movie news, reviews and analysis</p>
          </div>
        </div>

        <div className="blog-main">
          <div className="blog-sidebar">
            <div className="blog-search">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>

            <div className="blog-categories">
              <h3>Category</h3>
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
              <h3>Recent articles</h3>
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
                      <span><FaComment /> {post.comments} comments</span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="read-more">
                      Read on
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No matching posts found</h3>
                <p>Please try a different keyword or select another category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;