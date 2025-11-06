import React, { useState, useEffect } from 'react';

const FarmerCommunicationPage = () => {
  const [posts, setPosts] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [userName, setUserName] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch user info and posts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const userResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success) {
            setUserName(userData.user.name);
            setCurrentUserId(userData.user.id);
          }
        }

        // Get posts
        const postsResponse = await fetch(`${API_BASE_URL}/community`, {
          credentials: 'include'
        });
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          if (postsData.success) {
            setPosts(postsData.posts);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load community posts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f9f0',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#2d7a2d',
      color: 'white',
      padding: '30px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1000px',
      margin: '0 auto'
    },
    title: {
      fontSize: '2.5em',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    subtitle: {
      color: '#b8e6b8',
      fontSize: '1.1em'
    },
    mainContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 20px'
    },
    userSection: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '25px',
      marginBottom: '30px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '25px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e0e0e0'
    },
    userIcon: {
      width: '30px',
      height: '30px',
      backgroundColor: '#2d7a2d',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px'
    },
    questionForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    textarea: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical',
      minHeight: '100px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    button: {
      backgroundColor: '#2d7a2d',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      alignSelf: 'flex-start',
      transition: 'background-color 0.3s'
    },
    postCard: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '25px',
      overflow: 'hidden'
    },
    postHeader: {
      backgroundColor: '#e8f5e8',
      padding: '20px',
      borderBottom: '1px solid #d0d0d0'
    },
    postHeaderContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    authorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    avatar: {
      width: '50px',
      height: '50px',
      backgroundColor: '#2d7a2d',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    authorDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    authorName: {
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#333'
    },
    timestamp: {
      color: '#666',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    deleteButton: {
      background: 'none',
      border: 'none',
      color: '#dc3545',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '4px',
      fontSize: '18px',
      transition: 'color 0.3s'
    },
    postContent: {
      padding: '25px'
    },
    questionText: {
      fontSize: '18px',
      color: '#333',
      marginBottom: '20px',
      lineHeight: '1.6'
    },
    repliesSection: {
      marginBottom: '20px'
    },
    repliesHeader: {
      fontWeight: 'bold',
      color: '#555',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e0e0e0'
    },
    reply: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px'
    },
    replyHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px'
    },
    replyAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    replyAvatar: {
      width: '35px',
      height: '35px',
      backgroundColor: '#007bff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    replyContent: {
      color: '#333',
      marginLeft: '45px'
    },
    replyForm: {
      borderTop: '1px solid #e0e0e0',
      paddingTop: '20px',
      display: 'flex',
      gap: '15px'
    },
    replyTextarea: {
      flex: 1,
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical',
      minHeight: '80px',
      outline: 'none'
    },
    replyButton: {
      backgroundColor: '#2d7a2d',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      height: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '64px',
      color: '#ccc',
      marginBottom: '20px'
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 24) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: newQuestion })
      });

      if (!response.ok) throw new Error('Failed to post question');
      const data = await response.json();
      
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewQuestion('');
        setError('');
      }
    } catch (err) {
      console.error('Error posting question:', err);
      setError('Failed to post question');
    }
  };

  const handleReply = async (postId) => {
    const replyText = replyTexts[postId];
    if (!replyText?.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/community/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: replyText })
      });

      if (!response.ok) throw new Error('Failed to post reply');
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.map(post => 
          post._id === postId ? data.post : post
        ));
        setReplyTexts({ ...replyTexts, [postId]: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Failed to post reply');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete post');
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.filter(post => post._id !== postId));
        setError('');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/${postId}/replies/${replyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete reply');
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, replies: post.replies.filter(reply => reply._id !== replyId) }
            : post
        ));
        setError('');
      }
    } catch (err) {
      console.error('Error deleting reply:', err);
      setError('Failed to delete reply');
    }
  };

  const updateReplyText = (postId, text) => {
    setReplyTexts({ ...replyTexts, [postId]: text });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            💬 Farmer Community Forum
          </h1>
          <p style={styles.subtitle}>Connect, share knowledge, and help fellow farmers</p>
        </div>
      </div>

      <div style={styles.mainContent}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* User Section */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userIcon}>👤</div>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
              Logged in as: {userName || 'Loading...'}
            </span>
          </div>
          
          {/* Post New Question */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>
              Ask a Question
            </h3>
            <div style={styles.questionForm}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to ask the farming community?"
                style={styles.textarea}
              />
              <button
                onClick={handlePostQuestion}
                style={styles.button}
              >
                📤 Post Question
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
            Loading posts...
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <div key={post._id} style={styles.postCard}>
                {/* Post Header */}
                <div style={styles.postHeader}>
                  <div style={styles.postHeaderContent}>
                    <div style={styles.authorInfo}>
                      <div style={styles.avatar}>
                        {post.authorName?.charAt(0) || 'U'}
                      </div>
                      <div style={styles.authorDetails}>
                        <div style={styles.authorName}>{post.authorName}</div>
                        <div style={styles.timestamp}>
                          🕒 {formatTime(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    {post.authorId?.toString() === currentUserId?.toString() && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        style={styles.deleteButton}
                        title="Delete your question"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div style={styles.postContent}>
                  <p style={styles.questionText}>{post.question}</p>

                  {/* Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div style={styles.repliesSection}>
                      <h4 style={styles.repliesHeader}>
                        Replies ({post.replies.length})
                      </h4>
                      {post.replies.map(reply => (
                        <div key={reply._id} style={styles.reply}>
                          <div style={styles.replyHeader}>
                            <div style={styles.replyAuthor}>
                              <div style={styles.replyAvatar}>
                                {reply.authorName?.charAt(0) || 'U'}
                              </div>
                              <span style={{ fontWeight: 'bold', color: '#555' }}>
                                {reply.authorName}
                              </span>
                              <span style={{ color: '#888', fontSize: '12px' }}>
                                {formatTime(reply.createdAt)}
                              </span>
                            </div>
                            {reply.authorId?.toString() === currentUserId?.toString() && (
                              <button
                                onClick={() => handleDeleteReply(post._id, reply._id)}
                                style={{ ...styles.deleteButton, fontSize: '16px' }}
                                title="Delete your reply"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                          <p style={styles.replyContent}>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div style={styles.replyForm}>
                    <textarea
                      value={replyTexts[post._id] || ''}
                      onChange={(e) => updateReplyText(post._id, e.target.value)}
                      placeholder="Share your knowledge and help this farmer..."
                      style={styles.replyTextarea}
                    />
                    <button
                      onClick={() => handleReply(post._id)}
                      style={styles.replyButton}
                    >
                      📤 Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
              No questions yet
            </h3>
            <p style={{ color: '#888' }}>
              Be the first to ask a question and start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerCommunicationPage;
