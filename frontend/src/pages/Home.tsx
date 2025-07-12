import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
    reputation: number;
  };
  _count: {
    answers: number;
    votes: number;
  };
  votes?: { value: number }[];
}

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const { data, isLoading, error } = useQuery<{
    questions: Question[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>(['questions', searchTerm, selectedTag], async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedTag) params.append('tag', selectedTag);
    
    const response = await axios.get(`/api/questions?${params}`);
    return response.data;
  });

  if (isLoading) return <div className="loading">Loading questions...</div>;
  if (error) return <div className="error">Error loading questions</div>;

  return (
    <div className="home">
      <div className="home-header">
        <h1>Recent Questions</h1>
        <Link to="/ask" className="ask-button">
          Ask Question
        </Link>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="questions-list">
        {data?.questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="question-stats">
              <div className="stat">
                <span className="stat-number">{question._count.votes}</span>
                <span className="stat-label">votes</span>
              </div>
              <div className="stat">
                <span className="stat-number">{question._count.answers}</span>
                <span className="stat-label">answers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{question.views}</span>
                <span className="stat-label">views</span>
              </div>
            </div>

            <div className="question-content">
              <h3 className="question-title">
                <Link to={`/question/${question.id}`}>{question.title}</Link>
              </h3>
              <p className="question-excerpt">
                {question.content.length > 200 
                  ? `${question.content.substring(0, 200)}...` 
                  : question.content}
              </p>
              <div className="question-tags">
                {question.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`tag ${selectedTag === tag ? 'tag-selected' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="question-meta">
                <span className="question-author">
                  asked by{' '}
                  <Link to={`/profile/${question.author.id}`}>
                    {question.author.username}
                  </Link>
                </span>
                <span className="question-time">
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.questions.length === 0 && (
        <div className="no-questions">
          <p>No questions found. Be the first to ask a question!</p>
          <Link to="/ask" className="ask-button">
            Ask Question
          </Link>
        </div>
      )}
    </div>
  );
};