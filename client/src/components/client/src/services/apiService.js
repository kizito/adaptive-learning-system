const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Logging

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.post('/api/explain-concept', async (req, res) => {
  try {
    const { question, courseId, unitId } = req.body;
    
    // Get course content from database
    // For prototype, we use mock data
    const courseContent = getMockCourseContent(courseId, unitId);
    
    // Create context from course materials
    const contextPrompt = `
      You are an AI tutor for the course "${courseContent.courseName}".
      
      Key concepts in this course include:
      ${courseContent.keyTopics.map(topic => `
        - ${topic.name}: ${topic.description}
      `).join('\n')}
      
      Current unit: ${courseContent.currentUnit.name}
      
      Provide a clear, concise explanation of the concept. Use simple language
      appropriate for students. Focus only on explaining the concept, not on
      completing assignments for the student.
    `;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: contextPrompt
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 500
    });
    
    // Return explanation
    res.json({
      questionId: Date.now().toString(),
      explanation: completion.choices[0].message.content,
      confidence: 0.9 // Mock confidence score
    });
  } catch (error) {
    console.error("Error explaining concept:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

app.get('/api/practice-questions/:unitId', (req, res) => {
  try {
    const { unitId } = req.params;
    
    // In a real app, this would fetch from a database
    // For prototype, we use mock data
    const questions = getMockPracticeQuestions(unitId);
    
    res.json(questions);
  } catch (error) {
    console.error("Error fetching practice questions:", error);
    res.status(500).json({ error: "Failed to fetch practice questions" });
  }
});

app.post('/api/practice-answers', (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;
    
    // In a real app, this would check against a database
    // For prototype, we use mock data
    const questionData = getMockQuestionById(questionId);
    
    const isCorrect = questionData && selectedAnswer === questionData.correctAnswer;
    
    res.json({
      isCorrect,
      correctAnswer: questionData ? questionData.correctAnswer : null,
      explanation: questionData ? questionData.explanation : null
    });
  } catch (error) {
    console.error("Error processing practice answer:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  try {
    const { eventName, eventData } = req.body;
    
    // In a real app, this would save to a database
    console.log(`[Analytics] Event: ${eventName}`, eventData);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error logging analytics:", error);
    res.status(500).json({ error: "Failed to log analytics" });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Mock data functions
function getMockCourseContent(courseId, unitId) {
  return {
    courseName: "Introduction to Biology",
    courseId: "BIO101",
    currentUnit: {
      id: "unit1",
      name: "Cell Structure"
    },
    keyTopics: [
      {
        name: "Cell Membrane",
        description: "The protective barrier around cells that regulates what enters and exits."
      },
      {
        name: "Nucleus",
        description: "The control center of the cell containing genetic material."
      },
      {
        name: "Mitochon
