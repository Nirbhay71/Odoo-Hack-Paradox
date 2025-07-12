import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HelpCircle, Tags, FileText } from 'lucide-react';
import axios from 'axios';

export const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await axios.post('/api/questions', {
        title,
        content,
        tags: tagsArray
      });

      navigate(`/question/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Redirecting to login...</div>;
  }

  return (
    <div className="ask-question">
      <div className="ask-question-header">
        <h1>
          <HelpCircle className="page-icon" />
          Ask a Question
        </h1>
        <p>Get help from the community by asking a clear, detailed question.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="ask-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            <FileText className="form-icon" />
            Question Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            placeholder="What's your programming question? Be specific."
          />
          <small className="form-help">
            Be specific and imagine you're asking a question to another person
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            <FileText className="form-icon" />
            Question Details
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="form-textarea"
            placeholder="Provide all the details. What did you try? What were you expecting? What actually happened?"
          />
          <small className="form-help">
            Include all the information needed to answer your question
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="form-label">
            <Tags className="form-icon" />
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input"
            placeholder="javascript, react, node.js (comma-separated)"
          />
          <small className="form-help">
            Add up to 5 tags to describe what your question is about
          </small>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Posting Question...' : 'Post Question'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};