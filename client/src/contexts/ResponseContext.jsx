// src/contexts/ResponseContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const ResponseContext = createContext(null);

export const ResponseProvider = ({ children }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Only fetch responses if user is logged in
  useEffect(() => {
    let mounted = true;

    const fetchResponses = async () => {
      if (!user) {
        setResponses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/responses');
        if (mounted) {
          setResponses(response.data);
          setError(null);
        }
      } catch (err) {
        if (mounted && err.code !== 'ECONNABORTED') {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResponses();

    return () => {
      mounted = false;
    };
  }, [user]);

  const saveResponse = async (content, type) => {
    try {
      const response = await api.post('/responses', { content, type });
      setResponses(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteResponse = async (responseId) => {
    try {
      await api.delete(`/responses/${responseId}`);
      setResponses(prev => prev.filter(r => r._id !== responseId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    responses,
    loading,
    error,
    saveResponse,
    deleteResponse
  };

  return (
    <ResponseContext.Provider value={value}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponses = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponses must be used within a ResponseProvider');
  }
  return context;
};