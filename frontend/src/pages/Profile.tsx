import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { User, Calendar, Award, MessageCircle, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface UserProfile {
  id: string;
  username: string;
  name?: string;
  reputation: number;
  createdAt: string;
  _count: {
    questions: number;
    answers: number;
  };
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  createdAt: string;
  _count: {
    answers: number;
    votes: number;
  };
}

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  question: {
    id: string;
    title: string;
  };
  _count: {
    votes: number;
  };
}

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = React.useState<'questions' | 'answers'>('questions');

  const { data: user, isLoading: userLoading } = useQuery<UserProfile>(
    ['user', userId],
    async () => {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    }
  );

  const { data: questionsData, isLoading: questionsLoading } = useQuery<{
    questions: Question[];
    pagination: any;
  }>(
    ['userQuestions', userId],
    async () => {
      const response = await axios.get(`/api/users/${userId}/questions`);
      return response.data;
    },
    { enabled: activeTab === 'questions' }
  );

  const { data: answersData, isLoading: answersLoading } = useQuery<{
    answers: Answer[];
    pagination: any;
  }>(
    ['userAnswers', userId],
    async () => {
      const response = await axios.get(`/api/users/${userId}/answers`);
      return response.data;
    },
    { enabled: activeTab === 'answers' }
  );

  if (userLoading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <User className="avatar-icon" />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name || user.username}</h1>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-stats">
            <div className="stat">
              <Award className="stat-icon" />
              <span className="stat-value">{user.reputation}</span>
              <span className="stat-label">reputation</span>
            </div>
            <div className="stat">
              <HelpCircle className="stat-icon" />
              <span className="stat-value">{user._count.questions}</span>
              <span className="stat-label">questions</span>
            </div>
            <div className="stat">
              <MessageCircle className="stat-icon" />
              <span className="stat-value">{user._count.answers}</span>
              <span className="stat-label">answers</span>
            </div>
            <div className="stat">
              <Calendar className="stat-icon" />
              <span className="stat-value">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </span>
              <span className="stat-label">joined</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions ({user._count.questions})
          </button>
          <button
            className={`tab-button ${activeTab === 'answers' ? 'active' : ''}`}
            onClick={() => setActiveTab('answers')}
          >
            Answers ({user._count.answers})
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === 'questions' && (
            <div className="questions-tab">
              {questionsLoading ? (
                <div className="loading">Loading questions...</div>
              ) : questionsData?.questions.length === 0 ? (
                <div className="empty-state">
                  <p>No questions yet.</p>
                </div>
              ) : (
                <div className="questions-list">
                  {questionsData?.questions.map(question => (
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
                        <div className="question-tags">
                          {question.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                        <div className="question-meta">
                          <span className="question-time">
                            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="answers-tab">
              {answersLoading ? (
                <div className="loading">Loading answers...</div>
              ) : answersData?.answers.length === 0 ? (
                <div className="empty-state">
                  <p>No answers yet.</p>
                </div>
              ) : (
                <div className="answers-list">
                  {answersData?.answers.map(answer => (
                    <div key={answer.id} className="answer-card">
                      <div className="answer-stats">
                        <div className="stat">
                          <span className="stat-number">{answer._count.votes}</span>
                          <span className="stat-label">votes</span>
                        </div>
                        {answer.isAccepted && (
                          <div className="accepted-indicator">
                            <span className="accepted-text">Accepted</span>
                          </div>
                        )}
                      </div>
                      <div className="answer-content">
                        <div className="answer-question">
                          <Link to={`/question/${answer.question.id}`}>
                            {answer.question.title}
                          </Link>
                        </div>
                        <p className="answer-excerpt">
                          {answer.content.length > 200 
                            ? `${answer.content.substring(0, 200)}...` 
                            : answer.content}
                        </p>
                        <div className="answer-meta">
                          <span className="answer-time">
                            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};