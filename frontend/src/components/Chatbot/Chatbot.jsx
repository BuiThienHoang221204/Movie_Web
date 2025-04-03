import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';
import { useMovies } from '../../pages/components/MovieContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Khôi phục lịch sử chat từ sessionStorage thay vì localStorage
    const savedMessages = sessionStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(() => {
    // Kiểm tra xem đã chào trong phiên này chưa
    return sessionStorage.getItem('hasGreeted') === 'true';
  });
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(() => {
    return sessionStorage.getItem('hasShownPopup') === 'true';
  });
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  
  const { movies, genres } = useMovies();

  // Mapping thể loại Tiếng Việt - Tiếng Anh
  const genreMapping = {
    'hành động': 'action',
    'phiêu lưu': 'adventure',
    'hoạt hình': 'animation',
    'hài': 'comedy',
    'hài hước': 'comedy',
    'tội phạm': 'crime',
    'tài liệu': 'documentary',
    'chính kịch': 'drama',
    'gia đình': 'family',
    'giả tưởng': 'fantasy',
    'lịch sử': 'history',
    'kinh dị': 'horror',
    'nhạc': 'music',
    'âm nhạc': 'music',
    'bí ẩn': 'mystery',
    'lãng mạn': 'romance',
    'tình cảm': 'romance',
    'khoa học viễn tưởng': 'science fiction',
    'viễn tưởng': 'science fiction',
    'khoa học': 'science fiction',
    'tv movie': 'tv movie',
    'kinh điển': 'thriller',
    'chiến tranh': 'war',
    'cao bồi': 'western'
  };

  // Hàm chuyển đổi tên thể loại từ tiếng Việt sang tiếng Anh
  const getEnglishGenreName = (vietnameseName) => {
    const normalized = vietnameseName.toLowerCase().trim();
    return genreMapping[normalized] || normalized;
  };

  // Hàm lấy tên thể loại tiếng Việt từ ID
  const getGenreNameById = (genreId) => {
    const genre = genres.find(g => g.id === genreId);
    if (!genre) return '';
    
    // Chuyển đổi tên thể loại từ tiếng Anh sang tiếng Việt
    const englishName = genre.name.toLowerCase();
    for (const [vietName, engName] of Object.entries(genreMapping)) {
      if (engName === englishName) {
        return vietName.charAt(0).toUpperCase() + vietName.slice(1);
      }
    }
    return genre.name;
  };

  // Hàm lấy danh sách thể loại của phim
  const getMovieGenres = (movie) => {
    if (!movie.genre) return [];
    return movie.genre.map(id => getGenreNameById(id));
  };

  // Danh sách phim gợi ý mẫu (bạn có thể thay thế bằng API thực tế)
  const movieSuggestions = movies.sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Các từ khóa phản hồi tích cực
  const positiveResponses = [
    'có', 'ok', 'oke', 'được', 'yes', 'đồng ý', 'muốn', 'xem', 'cho xem',
    'đi xem', 'okay', 'uhm', 'ừ', 'uk', 'đúng', 'chắc chắn', 'tất nhiên'
  ];

  // Thêm state để theo dõi trạng thái tìm kiếm
  const [searchState, setSearchState] = useState({
    isSearching: false,
    searchType: null, // 'genre', 'name' hoặc 'year'
    searchQuery: null, // Lưu trữ truy vấn tìm kiếm
  });

  // Lưu lịch sử chat vào sessionStorage khi có thay đổi
  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Hàm lấy lời chào dựa trên thời gian
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Các tùy chọn nhanh
  const quickOptions = [
    { id: 'hot', text: '🎬 Đề xuất phim hot', icon: '🔥' },
    { id: 'search', text: 'Tìm kiếm phim', icon: '🔎' },
    { id: 'genre', text: 'Xem theo thể loại', icon: '📑' },
    { id: 'year', text: 'Xem theo năm', icon: '📅' }
  ];

  // Quick options khi không tìm thấy kết quả
  const noResultOptions = [
    { id: 'retry', text: 'Tìm lại', icon: '🔄' },
    { id: 'menu', text: 'Quay lại menu', icon: '📋' }
  ];

  // Xử lý lời chào cho mỗi phiên truy cập mới
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setTimeout(() => {
        const greetingMessages = [
          {
            text: `${getTimeBasedGreeting()}! Tôi là trợ lý chatbot. 👋`,
            isUser: false,
            timestamp: new Date()
          },
          {
            text: "Tôi có thể giúp bạn tìm kiếm phim yêu thích. Bạn muốn làm gì?",
            isUser: false,
            timestamp: new Date(Date.now() + 500),
            showQuickOptions: true
          }
        ];
        
        setMessages(greetingMessages);
        sessionStorage.setItem('hasGreeted', 'true');
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollHeight = messagesContainerRef.current.scrollHeight;
      const height = messagesContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      messagesContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    }
  };

  // Handle click outside chatbot
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleMovieResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    if (currentMovie && positiveResponses.some(response => input.includes(response))) {
      // Thêm tin nhắn xác nhận
      const confirmMessage = {
        text: `Tuyệt vời! Tôi sẽ chuyển bạn đến trang xem phim "${currentMovie.title}" ngay bây giờ.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmMessage]);

      // Delay một chút trước khi chuyển hướng
      setTimeout(() => {
        // Chuyển hướng đến trang xem phim
        navigate(`/watch/${currentMovie.id}`);
        // Đóng chatbot
        handleClose();
      }, 1500);

      // Reset currentMovie
      setCurrentMovie(null);
    } else if (currentMovie) {
      // Nếu câu trả lời không phải là positive
      const suggestOtherMessage = {
        text: 'Bạn muốn xem phim khác? Tôi có thể gợi ý một số phim khác cho bạn.',
        isUser: false,
        timestamp: new Date(),
        showSuggestions: true
      };
      setMessages(prev => [...prev, suggestOtherMessage]);
      setCurrentMovie(null);
    }
  };

  const handleMovieSuggestionClick = (movie) => {
    setCurrentMovie(movie);
    setSearchState({ isSearching: false, searchType: null, searchQuery: null });
    
    const userMessage = { 
      text: `Tôi muốn xem thông tin về phim ${movie.title}`,
      isUser: true,
      timestamp: new Date()
    };
    
    // Lấy năm phát hành từ movie object (giả định có trường year hoặc releaseDate)
    const movieYear = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "Không rõ");
    
    const botResponse = {
      text: `Đây là thông tin về phim ${movie.title}:\nThể loại: ${getMovieGenres(movie).split(", ")}\nNăm phát hành: ${movieYear}\nĐánh giá: ${movie.rating.toFixed(1)}/10\nBạn có muốn xem phim này không?`,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setShowSuggestions(false);
  };

  // Xử lý khi người dùng chọn loại tìm kiếm
  const handleSearchTypeSelection = (type) => {
    let responseText = '';
    switch (type) {
      case '1':
        responseText = 'Vui lòng nhập tên phim bạn muốn tìm:';
        setSearchState({ isSearching: true, searchType: 'title' });
        break;
      case '2':
        responseText = 'Vui lòng nhập thể loại phim bạn muốn tìm:';
        setSearchState({ isSearching: true, searchType: 'genre' });
        break;
      case '3':
        responseText = 'Vui lòng nhập năm phát hành:';
        setSearchState({ isSearching: true, searchType: 'year' });
        break;
      default:
        return;
    }

    const botResponse = {
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botResponse]);
  };

  // Xử lý tin nhắn từ người dùng
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Kiểm tra nếu đang trong quá trình tìm kiếm
    if (searchState.isSearching) {
      let searchResults = [];
      let responseText = '';

      switch (searchState.searchType) {
        case 'title': {
          searchResults = searchMoviesByKeyword(input);
          responseText = searchResults.length > 0 
            ? 'Đây là các phim phù hợp với tên bạn tìm:'
            : 'Không tìm thấy phim nào có tên tương tự.';
          break;
        }

        case 'genre': {
          // Chuyển đổi input sang tên thể loại tiếng Anh
          const englishGenreName = getEnglishGenreName(input);
          const matchedGenre = Object.entries(genreMapping).find(([viet]) => 
            viet.includes(input.toLowerCase()) || input.toLowerCase().includes(viet)
          );
          
          if (matchedGenre || englishGenreName) {
            const genreId = genres.find(g => 
              g.name.toLowerCase() === (matchedGenre ? matchedGenre[1] : englishGenreName)
            )?.id;
            
            if (genreId) {
              searchResults = movies
                .filter(movie => movie.genre_ids && movie.genre_ids.includes(genreId))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5);
            }
          }
          
          responseText = searchResults.length > 0 
            ? `Đây là các phim thể loại ${matchedGenre ? matchedGenre[0] : input}:`
            : `Không tìm thấy phim thuộc thể loại ${input}.`;
          break;
        }

        case 'year': {
          const year = parseInt(input);
          if (!isNaN(year)) {
            searchResults = movies
              .filter(movie => {
                // Kiểm tra năm từ cả year và releaseDate
                const movieYear = movie.year || (movie.releaseDate && new Date(movie.releaseDate).getFullYear());
                return movieYear === year;
              })
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5);
          }
          responseText = !isNaN(year) 
            ? (searchResults.length > 0 
              ? `Đây là các phim phát hành năm ${year}:`
              : `Không tìm thấy phim nào phát hành năm ${year}.`)
            : 'Vui lòng nhập năm hợp lệ (ví dụ: 2023)';
          break;
        }
      }

      const botResponse = {
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        showMovies: searchResults.length > 0 ? searchResults : null,
        showNoResultOptions: searchResults.length === 0
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        if (searchResults.length > 0) {
          setSearchState({ isSearching: false, searchType: null });
        }
      }, 500);
      return;
    }

    // Xử lý các pattern tìm kiếm trực tiếp
    const genrePattern = /phim\s+([a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+)/i;
    const yearPattern = /phim.*?(\d{4})|(\d{4}).*?phim/i;
    let searchResults = [];
    
    if (input.toLowerCase() === 'tìm kiếm phim') {
      const botResponse = {
        text: 'Bạn muốn tìm phim theo:\n1. Tên phim\n2. Thể loại\n3. Năm phát hành\nHãy nhập số tương ứng hoặc gõ từ khóa tìm kiếm.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    // Check if input is a search type selection
    if (['1', '2', '3'].includes(input)) {
      handleSearchTypeSelection(input);
      return;
    }

    // Existing direct search patterns
    const genreMatch = input.match(genrePattern);
    const yearMatch = input.match(yearPattern);

    if (genreMatch) {
      // Existing genre match logic
    } else if (yearMatch) {
      const year = parseInt(yearMatch[1] || yearMatch[2]);
      if (!isNaN(year)) {
        searchResults = movies
          .filter(movie => {
            const movieYear = movie.year || (movie.releaseDate && new Date(movie.releaseDate).getFullYear());
            return movieYear === year;
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);

        const botResponse = {
          text: searchResults.length > 0 
            ? `Đây là các phim phát hành năm ${year}:`
            : `Không tìm thấy phim nào phát hành năm ${year}.`,
          isUser: false,
          timestamp: new Date(),
          showMovies: searchResults.length > 0 ? searchResults : null,
          showNoResultOptions: searchResults.length === 0
        };
        setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
        return;
      }
    } else {
      // Default to keyword search
      searchResults = searchMoviesByKeyword(input);
      if (searchResults.length > 0) {
        const botResponse = {
          text: "Đây là các phim phù hợp với tìm kiếm của bạn:",
          isUser: false,
          timestamp: new Date(),
          showMovies: searchResults
        };
        setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
      } else {
        const botResponse = {
          text: "Không tìm thấy phim phù hợp. Bạn có thể thử tìm kiếm theo:\n1. Tên phim\n2. Thể loại\n3. Năm phát hành",
          isUser: false,
          timestamp: new Date(),
          showNoResultOptions: true
        };
        setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
      }
    }
  };

  // Hàm tìm kiếm phim theo từ khóa
  const searchMoviesByKeyword = (keyword) => {
    const searchTerm = keyword.toLowerCase().trim();
    return movies
      .filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre && movie.genre.some(genreId => {
          const genreName = getGenreNameById(genreId);
          return genreName.toLowerCase().includes(searchTerm);
        });
        const yearMatch = movie.year && movie.year.toString().includes(searchTerm);
        return titleMatch || genreMatch || yearMatch;
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  };

  // Hiển thị danh sách phim tìm được
  const MovieSuggestionsList = ({ movies }) => {
    if (!movies || movies.length === 0) return null;
    
    return (
      <div className="movie-suggestions">
        {movies.map((movie, idx) => (
          <div
            key={idx}
            className="movie-suggestion-item"
            onClick={() => handleMovieSuggestionClick(movie)}
          >
            <span className="movie-title">{movie.title}</span>
            <span className="movie-rating">⭐ {movie.rating.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Thêm quick replies cho câu hỏi xem phim
  const QuickReplies = () => {
    if (!currentMovie) return null;

    return (
      <div className="quick-replies">
        <button onClick={() => handleQuickReply('Có, tôi muốn xem')}>
          Có, xem ngay
        </button>
        <button onClick={() => handleQuickReply('Không, tìm phim khác')}>
          Tìm phim khác
        </button>
      </div>
    );
  };

  const handleQuickReply = (reply) => {
    const userMessage = {
      text: reply,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    handleMovieResponse(reply);
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  // Xử lý hiển thị popup sau khi vào trang
  useEffect(() => {
    if (!hasShownPopup && !isOpen) {
      const popupTimer = setTimeout(() => {
        setShowPopup(true);
        // Tự động ẩn popup sau 5 giây
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
        sessionStorage.setItem('hasShownPopup', 'true');
        setHasShownPopup(true);
      }, 2000); // Hiển thị popup sau 2 giây vào trang

      return () => clearTimeout(popupTimer);
    }
  }, [hasShownPopup, isOpen]);

  // Xử lý click vào popup
  const handlePopupClick = () => {
    setShowPopup(false);
    setIsOpen(true);
  };

  // Xử lý khi chọn tùy chọn nhanh
  const handleQuickOption = (option) => {
    const userMessage = {
      text: option.text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    switch (option.id) {
      case 'hot':
        setTimeout(() => {
          const hotMovies = movies.sort((a, b) => b.rating - a.rating).slice(0, 5);
          const botResponse = {
            text: "Đây là 5 phim hot nhất hiện tại:",
            isUser: false,
            timestamp: new Date(),
            showMovies: hotMovies
          };
          setMessages(prev => [...prev, botResponse]);
        }, 500);
        break;

      case 'search':
        setTimeout(() => {
          const botResponse = {
            text: "Bạn muốn tìm phim theo:\n1. Tên phim\n2. Thể loại\n3. Năm phát hành\nHãy nhập số tương ứng hoặc gõ từ khóa tìm kiếm.",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 500);
        break;

      case 'genre':
        setTimeout(() => {
          const botResponse = {
            text: "Bạn muốn xem thể loại phim gì? (Ví dụ: Hành động, Tình cảm, Kinh dị, Hoạt hình, Hài,...)",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setSearchState({ isSearching: true, searchType: 'genre', searchQuery: null });
        }, 500);
        break;

      case 'year':
        setTimeout(() => {
          const botResponse = {
            text: "Bạn muốn tìm phim phát hành năm nào? Hãy nhập năm phát hành (ví dụ: 2023).",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setSearchState({ isSearching: true, searchType: 'year', searchQuery: null });
        }, 500);
        break;
    }
  };

  // Xóa lịch sử chat
  const clearChatHistory = () => {
    setMessages([]);
    setHasGreeted(false);
    sessionStorage.removeItem('chatHistory');
    sessionStorage.removeItem('hasGreeted');
  };

  // Liên hệ trực tiếp
  const handleDirectContact = () => {
    const supportMessage = {
      text: "Đang kết nối bạn với nhân viên hỗ trợ trực tiếp...",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, supportMessage]);
  };

  // Thêm hàm xử lý cho no result options
  const handleNoResultOption = (option) => {
    const userMessage = {
      text: option.text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    if (option.id === 'retry') {
      const currentSearchType = searchState.searchType;
      let promptText = '';
      
      switch (currentSearchType) {
        case 'name':
          promptText = "Hãy nhập tên phim khác bạn muốn tìm:";
          break;
        case 'genre':
          promptText = "Hãy nhập thể loại phim khác (Ví dụ: Hành động, Tình cảm, Kinh dị,...):";
          break;
        case 'year':
          promptText = "Hãy nhập năm phát hành khác (Ví dụ: 2023):";
          break;
        default:
          promptText = "Bạn muốn tìm kiếm gì?";
      }

      const botResponse = {
        text: promptText,
        isUser: false,
        timestamp: new Date()
      };
      setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
    } else if (option.id === 'menu') {
      setSearchState({ isSearching: false, searchType: null });
      const botResponse = {
        text: "Bạn muốn làm gì?",
        isUser: false,
        timestamp: new Date(),
        showQuickOptions: true
      };
      setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
    }
  };

  return (
    <div className="chatbot-container" ref={chatbotRef}>
      {/* Popup Message */}
      {showPopup && !isOpen && (
        <div className="chatbot-popup" onClick={handlePopupClick}>
          <div className="popup-content">
            <div className="popup-message">
              👋 Xin chào! Tôi có thể giúp bạn tìm phim hay không?
            </div>
            <div className="popup-close" onClick={(e) => {
              e.stopPropagation();
              setShowPopup(false);
            }}>
              ✕
            </div>
          </div>
          <div className="popup-arrow"></div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button 
        className={`chatbot-toggle ${showPopup ? 'has-popup' : ''}`}
        onClick={toggleChat}
        title={isOpen ? "Đóng chat" : "Mở chat hỗ trợ"}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className={`chatbot-window ${isClosing ? 'closing' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">🤖</span>
              <span>Movie Assistant</span>
            </div>
            <div className="header-actions">
              <button 
                className="header-btn"
                onClick={handleDirectContact}
                title="Liên hệ trực tiếp"
              >
                🎧
              </button>
              <button 
                className="header-btn"
                onClick={clearChatHistory}
                title="Xóa lịch sử chat"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="chatbot-messages" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content" style={{whiteSpace: 'pre-line'}}>{message.text}</div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                {message.showQuickOptions && (
                  <div className="quick-options">
                    {quickOptions.map(option => (
                      <button
                        key={option.id}
                        className="quick-option-btn"
                        onClick={() => handleQuickOption(option)}
                      >
                        <span className="option-icon">{option.icon}</span>
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
                {message.showNoResultOptions && (
                  <div className="quick-options">
                    {noResultOptions.map(option => (
                      <button
                        key={option.id}
                        className="quick-option-btn"
                        onClick={() => handleNoResultOption(option)}
                      >
                        <span className="option-icon">{option.icon}</span>
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
                {message.showSuggestions && showSuggestions && (
                  <div className="movie-suggestions">
                    {movieSuggestions.map((movie, idx) => (
                      <div
                        key={idx}
                        className="movie-suggestion-item"
                        onClick={() => handleMovieSuggestionClick(movie)}
                      >
                        <span className="movie-title">{movie.title}</span>
                        <span className="movie-rating">⭐ {movie.rating.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {message.showMovies && (
                  <MovieSuggestionsList movies={message.showMovies} />
                )}
              </div>
            ))}
            {currentMovie && <QuickReplies />}
            <div ref={messagesEndRef} className="messages-end-ref" />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoFocus
            />
            <button type="submit" className="send-button" title="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" className="send-icon">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;