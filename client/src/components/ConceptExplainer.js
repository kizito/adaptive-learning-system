import React, { useState, useEffect } from 'react';
import { Spinner, Text, Button, Input, Card, Flex, Box } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import { getConceptExplanation } from '../services/apiService';
import { trackEvent } from '../services/analyticsService';

const ConceptExplainer = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseContext, setCourseContext] = useState(null);
  
  useEffect(() => {
    // Initialize Teams SDK
    microsoftTeams.initialize();
    
    // Get course context from Teams context
    microsoftTeams.getContext((context) => {
      // In a real implementation, we would fetch course data based on Teams context
      // For prototype, we use mock data
      setCourseContext({
        courseName: "Introduction to Biology",
        courseId: "BIO101",
        units: [
          { id: "unit1", name: "Cell Structure", active: true },
          { id: "unit2", name: "Photosynthesis", active: false },
        ]
      });
    });
    
    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content: "Hi there! I'm your learning assistant for Introduction to Biology. What concept would you like me to explain?"
      }
    ]);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user question to chat
    const userMessage = { role: "user", content: question };
    setMessages([...messages, userMessage]);
    
    // Track question for analytics
    trackEvent('concept_question_asked', {
      question,
      courseId: courseContext?.courseId,
      timestamp: new Date().toISOString()
    });
    
    // Clear input and show loading
    setQuestion('');
    setLoading(true);
    
    try {
      // Call API to get explanation
      const response = await getConceptExplanation(question, courseContext);
      
      // Add AI response to chat
      const aiMessage = { role: "assistant", content: response.explanation };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      // Track successful response
      trackEvent('concept_explanation_received', {
        questionId: response.questionId,
        responseLength: response.explanation.length,
        confidence: response.confidence
      });
      
    } catch (error) {
      console.error("Error getting explanation:", error);
      
      // Add error message to chat
      const errorMessage = { 
        role: "assistant", 
        content: "I'm sorry, I couldn't process your question right now. Please try again later." 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      // Track error
      trackEvent('concept_explanation_error', {
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Suggested questions the student can ask
  const suggestedQuestions = [
    "What is a cell membrane?",
    "How does photosynthesis work?",
    "What is the function of mitochondria?",
    "Explain the difference between prokaryotic and eukaryotic cells."
  ];
  
  const handleSuggestedQuestion = (q) => {
    setQuestion(q);
  };
  
  return (
    <Flex column className="concept-explainer" padding="padding.medium" gap="gap.small" fill>
      {courseContext && (
        <Box>
          <Text size="large" weight="semibold">Course: {courseContext.courseName}</Text>
          <Text>Current Unit: {courseContext.units.find(u => u.active)?.name}</Text>
        </Box>
      )}
      
      <Card fluid padding="padding.medium" styles={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Flex column gap="gap.small" className="chat-messages">
          {messages.map((msg, index) => (
            <Box 
              key={index}
              className={`message ${msg.role}`}
              padding="padding.medium"
              styles={{
                backgroundColor: msg.role === 'assistant' ? '#f0f0f0' : '#e6f2ff',
                borderRadius: '8px',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'assistant' ? 'auto' : '0',
                maxWidth: '80%'
              }}
            >
              <Text content={msg.content} />
            </Box>
          ))}
          
          {loading && (
            <Box padding="padding.medium">
              <Flex vAlign="center" gap="gap.small">
                <Spinner size="small" label="Thinking..." labelPosition="end" />
              </Flex>
            </Box>
          )}
        </Flex>
      </Card>
      
      <form onSubmit={handleSubmit}>
        <Flex gap="gap.small">
          <Input 
            fluid
            placeholder="Ask about a course concept..."
            value={question}
            onChange={(e, data) => setQuestion(data.value)}
            disabled={loading}
          />
          <Button 
            primary 
            content="Ask" 
            type="submit" 
            disabled={loading || !question.trim()} 
            loading={loading}
          />
        </Flex>
      </form>
      
      {messages.length <= 2 && (
        <Box className="suggested-questions">
          <Text size="small" weight="semibold">Try asking about:</Text>
          <Flex wrap gap="gap.small" padding="padding.medium">
            {suggestedQuestions.map((q, i) => (
              <Button 
                key={i}
                content={q}
                size="small"
                onClick={() => handleSuggestedQuestion(q)}
              />
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default ConceptExplainer;
