import React, { useState, useEffect } from 'react';
import { 
  Flex, Box, Text, RadioGroup, Button, 
  ProgressBar, Card, Alert
} from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import { getPracticeQuestions } from '../services/apiService';
import { trackEvent } from '../services/analyticsService';

const PracticeQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseContext, setCourseContext] = useState(null);
  
  useEffect(() => {
    // Initialize Teams SDK
    microsoftTeams.initialize();
    
    // Get course context from Teams context
    microsoftTeams.getContext(async (context) => {
      // In a real implementation, we would fetch course data based on Teams context
      const mockCourseContext = {
        courseName: "Introduction to Biology",
        courseId: "BIO101",
        currentUnit: "Cell Structure",
        unitId: "unit1"
      };
      
      setCourseContext(mockCourseContext);
      
      try {
        // Fetch questions for the current unit
        setLoading(true);
        const questionsData = await getPracticeQuestions(mockCourseContext.unitId);
        setQuestions(questionsData);
        
        // Track practice session start
        trackEvent('practice_session_started', {
          courseId: mockCourseContext.courseId,
          unitId: mockCourseContext.unitId,
          questionCount: questionsData.length
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    });
  }, []);
  
  const handleAnswerSelect = (e, data) => {
    setSelectedAnswer(parseInt(data.value));
  };
  
  const handleSubmit = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Show feedback
    setFeedback({
      isCorrect,
      message: isCorrect 
        ? "Correct! Well done." 
        : `Incorrect. The right answer is: ${currentQ.options[currentQ.correctAnswer]}`
    });
    
    // Track answer submission
    trackEvent('practice_answer_submitted', {
      questionId: currentQ.id,
      isCorrect,
      selectedAnswer,
      correctAnswer: currentQ.correctAnswer,
      timeSpent: 0 // In a real app, we would track time spent on question
    });
    
    // Wait 2 seconds then advance to next question or show completion
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        setCompleted(true);
        
        // Track practice session completion
        trackEvent('practice_session_completed', {
          score,
          totalQuestions: questions.length,
          percentageCorrect: Math.round((score + (isCorrect ? 1 : 0)) * 100 / questions.length)
        });
      }
    }, 2000);
  };
  
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setCompleted(false);
    setScore(0);
    
    // Track practice restart
    trackEvent('practice_session_restarted', {
      previousScore: score,
      totalQuestions: questions.length
    });
  };
  
  if (loading) {
    return (
      <Flex fill column hAlign="center" vAlign="center" padding="padding.large">
        <Text content="Loading practice questions..." />
      </Flex>
    );
  }
  
  if (questions.length === 0) {
    return (
      <Flex fill column hAlign="center" vAlign="center" padding="padding.large">
        <Alert 
          header="No questions available" 
          content="There are no practice questions available for this unit yet."
          warning
        />
      </Flex>
    );
  }
  
  if (completed) {
    const percentage = Math.round(score * 100 / questions.length);
    
    return (
      <Flex fill column hAlign="center" vAlign="center" padding="padding.large" gap="gap.medium">
        <Card fluid padding="padding.large">
          <Flex column gap="gap.medium" hAlign="center">
            <Text size="larger" weight="bold" content="Practice Complete!" />
            
            <Box styles={{ width: '100%' }}>
              <Text content={`You scored ${score} out of ${questions.length}`} align="center" />
              <ProgressBar 
                value={percentage} 
                color={percentage >= 70 ? "green" : percentage >= 50 ? "yellow" : "red"}
                styles={{ marginTop: '10px' }}
              />
            </Box>
            
            <Text 
              content={
                percentage >= 80 ? "Excellent! You've mastered this material." :
                percentage >= 60 ? "Good job! You're on the right track." :
                "Keep practicing! Review the concepts and try again."
              }
              align="center"
            />
            
            <Button primary content="Practice Again" onClick={restartQuiz} />
          </Flex>
        </Card>
      </Flex>
    );
  }
  
  const currentQ = questions[currentQuestion];
  
  return (
    <Flex column padding="padding.medium" gap="gap.small" fill>
      {courseContext && (
        <Box>
          <Text size="large" weight="semibold">Course: {courseContext.courseName}</Text>
          <Text>Current Unit: {courseContext.currentUnit}</Text>
        </Box>
      )}
      
      <Box>
        <Flex space="between" vAlign="center">
          <Text content={`Question ${currentQuestion + 1} of ${questions.length}`} />
          <Text content={`Score: ${score}/${currentQuestion}`} weight="semibold" hidden={currentQuestion === 0} />
        </Flex>
        <ProgressBar 
          value={(currentQuestion / questions.length) * 100} 
          styles={{ marginTop: '10px' }}
        />
      </Box>
      
      <Card fluid padding="padding.large">
        <Flex column gap="gap.large">
          <Text size="large" weight="semibold" content={currentQ.text} />
          
          <RadioGroup 
            vertical
            items={currentQ.options.map((option, index) => ({
              key: index,
              label: option,
              value: index.toString(),
              disabled: feedback !== null
            }))}
            value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
            onChange={handleAnswerSelect}
          />
          
          {feedback && (
            <Alert
              header={feedback.isCorrect ? "Correct!" : "Incorrect"}
              content={feedback.message}
              success={feedback.isCorrect}
              danger={!feedback.isCorrect}
            />
          )}
          
          <Button 
            primary 
            content="Submit Answer" 
            onClick={handleSubmit}
            disabled={selectedAnswer === null || feedback !== null}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

export default PracticeQuestions;
