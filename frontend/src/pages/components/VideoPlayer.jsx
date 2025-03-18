import React, { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  
  // Tự động ẩn controls sau một khoảng thời gian
  let controlsTimeout;
  
  useEffect(() => {
    // Kiểm tra xem URL có phải là YouTube không
    const isYouTube = videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com');
    setIsYouTubeVideo(isYouTube);
    
    if (isYouTube) {
      // Trích xuất ID video từ URL YouTube
      let videoId = '';
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('youtu.be/')[1];
      } else if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      }
      setYoutubeVideoId(videoId);
      return; // Không cần thiết lập các sự kiện cho video thông thường
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    // Tự động phát video khi component được mount
    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
      video.play().catch(err => console.log('Autoplay prevented:', err));
      setIsPlaying(true);
    });
    
    // Cập nhật thời gian hiện tại
    video.addEventListener('timeupdate', updateProgress);
    
    // Xử lý khi video kết thúc
    video.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    
    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => {});
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', () => {});
      }
      clearTimeout(controlsTimeout);
    };
  }, [videoUrl]);
  
  const updateProgress = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setCurrentTime(video.currentTime);
    const progressPercent = (video.currentTime / video.duration) * 100;
    if (progressRef.current) {
      progressRef.current.style.width = `${progressPercent}%`;
    }
  };
  
  const togglePlay = () => {
    if (isYouTubeVideo) {
      // Xử lý play/pause cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  };
  
  const toggleMute = () => {
    if (isYouTubeVideo) {
      // Xử lý mute/unmute cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };
  
  const handleVolumeChange = (e) => {
    if (isYouTubeVideo) {
      // Xử lý volume cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const value = e.target.value;
    setVolume(value);
    
    const video = videoRef.current;
    if (video) {
      video.volume = value;
      setIsMuted(value === 0);
    }
    
    resetControlsTimeout();
  };
  
  const handleProgressClick = (e) => {
    if (isYouTubeVideo) {
      // Xử lý seek cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    video.currentTime = newTime;
    resetControlsTimeout();
  };
  
  const skipForward = () => {
    if (isYouTubeVideo) {
      // Xử lý skip cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const video = videoRef.current;
    if (video) {
      video.currentTime += 10;
    }
    resetControlsTimeout();
  };
  
  const skipBackward = () => {
    if (isYouTubeVideo) {
      // Xử lý skip cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const video = videoRef.current;
    if (video) {
      video.currentTime -= 10;
    }
    resetControlsTimeout();
  };
  
  const toggleFullScreen = () => {
    if (isYouTubeVideo) {
      // Xử lý fullscreen cho YouTube sẽ được thực hiện qua iframe API
      return;
    }
    
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;
    
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
    
    resetControlsTimeout();
  };
  
  const resetControlsTimeout = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  const handleMouseMove = () => {
    resetControlsTimeout();
  };
  
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  };
  
  return (
    <div 
      className="video-player-container" 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {isYouTubeVideo ? (
        <iframe
          className="youtube-player"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&muted=1&controls=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video 
          ref={videoRef} 
          src={videoUrl} 
          className="video-player"
          onClick={togglePlay}
        />
      )}
      
      {!isYouTubeVideo && (
        <div className={`video-controls ${showControls ? 'show' : 'hide'}`}>
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-bar">
              <div className="progress" ref={progressRef}></div>
            </div>
          </div>
          
          <div className="controls-main">
            <div className="controls-left">
              <button className="control-button" onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <button className="control-button" onClick={skipBackward}>
                <BiSkipPrevious /> 10s
              </button>
              
              <button className="control-button" onClick={skipForward}>
                <BiSkipNext /> 10s
              </button>
              
              <div className="volume-container">
                <button className="control-button" onClick={toggleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="controls-right">
              <button className="control-button" onClick={toggleFullScreen}>
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 