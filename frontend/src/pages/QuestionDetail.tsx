import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { ChevronUp, ChevronDown, Check, MessageCircle, Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
    reputation: number;
  };
  _count: {
    votes: number;
  };
  votes?: { value: number }[];
}

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
  answers: Answer[];
  _count: {
    votes: number;
  };
  votes?: { value: number }[];
}

export const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [answerContent, setAnswerContent] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: question, isLoading, error: queryError } = useQuery<Question>(
    ['question', id],
    async () => {
      const response = await axios.get(`/api/questions/${id}`);
      return response.data;
    }
  );

  const answerMutation = useMutation(
    async (content: string) => {
      const response = await axios.post('/api/answers', {
        content,
        questionId: id
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['question', id]);
        setAnswerContent('');
        setError('');
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || 'Failed to post answer');
      }
    }
  );

  const voteMutation = useMutation(
    async ({ type, targetId, value }: { type: 'question' | 'answer', targetId: string, value: number }) => {
      const response = await axios.post(`/api/votes/${type}/${targetId}`, { value });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['question', id]);
      }
    }
  );

  const acceptAnswerMutation = useMutation(
    async (answerId: string) => {
      const response = await axios.patch(`/api/answers/${answerId}/accept`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['question', id]);
      }
    }
  );

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    
    answerMutation.mutate(answerContent);
  };

  const handleVote = (type: 'question' | 'answer', targetId: string, value: number) => {
    if (!isAuthenticated) return;
    voteMutation.mutate({ type, targetId, value });
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!isAuthenticated || !question || question.author.id !== user?.id) return;
    acceptAnswerMutation.mutate(answerId);
  };

  if (isLoading) return <div className="loading">Loading question...</div>;
  if (queryError || !question) return <div className="error">Error loading question</div>;

  const userQuestionVote = question.votes?.[0]?.value || 0;

  return (
    <div className="question-detail">
      <div className="question-header">
        <h1>{question.title}</h1>
        <div className="question-meta">
          <span className="meta-item">
            <Calendar className="meta-icon" />
            Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </span>
          <span className="meta-item">
            <Eye className="meta-icon" />
            {question.views} views
          </span>
          <span className="meta-item">
            <MessageCircle className="meta-icon" />
            {question.answers.length} answers
          </span>
        </div>
      </div>

      <div className="question-content">
        <div className="vote-section">
          <button
            className={`vote-button ${userQuestionVote === 1 ? 'active' : ''}`}
            onClick={() => handleVote('question', question.id, 1)}
            disabled={!isAuthenticated}
          >
            <ChevronUp />
          </button>
          <span className="vote-count">{question._count.votes}</span>
          <button
            className={`vote-button ${userQuestionVote === -1 ? 'active' : ''}`}
            onClick={() => handleVote('question', question.id, -1)}
            disabled={!isAuthenticated}
          >
            <ChevronDown />
          </button>
        </div>

        <div className="content-section">
          <div className="content-body">
            <p className="content-text">{question.content}</p>
            <div className="tags">
              {question.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="author-info">
            <span className="author-text">
              asked by{' '}
              <Link to={`/profile/${question.author.id}`} className="author-link">
                {question.author.username}
              </Link>
            </span>
            <span className="author-reputation">
              {question.author.reputation} reputation
            </span>
          </div>
        </div>
      </div>

      <div className="answers-section">
        <h3 className="answers-title">
          {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
        </h3>

        {question.answers.map(answer => {
          const userAnswerVote = answer.votes?.[0]?.value || 0;
          const isQuestionAuthor = question.author.id === user?.id;

          return (
            <div key={answer.id} className={`answer ${answer.isAccepted ? 'accepted' : ''}`}>
              <div className="vote-section">
                <button
                  className={`vote-button ${userAnswerVote === 1 ? 'active' : ''}`}
                  onClick={() => handleVote('answer', answer.id, 1)}
                  disabled={!isAuthenticated}
                >
                  <ChevronUp />
                </button>
                <span className="vote-count">{answer._count.votes}</span>
                <button
                  className={`vote-button ${userAnswerVote === -1 ? 'active' : ''}`}
                  onClick={() => handleVote('answer', answer.id, -1)}
                  disabled={!isAuthenticated}
                >
                  <ChevronDown />
                </button>
                {isQuestionAuthor && (
                  <button
                    className={`accept-button ${answer.isAccepted ? 'accepted' : ''}`}
                    onClick={() => handleAcceptAnswer(answer.id)}
                    title={answer.isAccepted ? 'Accepted answer' : 'Accept this answer'}
                  >
                    <Check />
                  </button>
                )}
              </div>

              <div className="content-section">
                <div className="content-body">
                  <p className="content-text">{answer.content}</p>
                  {answer.isAccepted && (
                    <div className="accepted-badge">
                      <Check className="accepted-icon" />
                      Accepted Answer
                    </div>
                  )}
                </div>
                <div className="author-info">
                  <span className="author-text">
                    answered by{' '}
                    <Link to={`/profile/${answer.author.id}`} className="author-link">
                      {answer.author.username}
                    </Link>
                  </span>
                  <span className="answer-time">
                    {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAuthenticated && (
        <div className="answer-form-section">
          <h3>Your Answer</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmitAnswer} className="answer-form">
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              rows={8}
              className="answer-textarea"
              required
            />
            <button
              type="submit"
              disabled={answerMutation.isLoading || !answerContent.trim()}
              className="submit-button"
            >
              {answerMutation.isLoading ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        </div>
      )}

      {!isAuthenticated && (
        <div className="login-prompt">
          <p>
            <Link to="/login">Login</Link> or <Link to="/register">register</Link> to post an answer.
          </p>
        </div>
      )}
    </div>
  );
};