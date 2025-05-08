# Adaptive Learning System

An intelligent teaching assistant that makes learning more responsive, personalized, and data-driven without adding extra work for teachers.

![Adaptive Learning Demo](./docs/images/adaptive-learning-demo.png)

## 🌟 Overview

This prototype demonstrates a Microsoft Teams-integrated adaptive learning system that provides:

- 24/7 AI-powered concept explanations based on course materials
- Personalized practice questions with adaptive difficulty
- Real-time feedback and progress tracking
- Seamless integration with Microsoft Teams

The system is designed to validate the core functionality of an adaptive learning platform in classroom environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Microsoft 365 developer account
- OpenAI API key (for AI explanations)

### Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/adaptive-learning-system.git
cd adaptive-learning-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your OpenAI API key and Microsoft credentials
```

4. Start the development server
```bash
npm run dev
```

5. Package the Microsoft Teams app
```bash
npm run package
```

## 📱 Features

### For Students
- **Concept Explainer**: Ask questions about course concepts and receive clear, contextual explanations
- **Practice Questions**: Test knowledge with adaptive multiple-choice questions
- **Progress Tracking**: Monitor understanding and improvement over time

### Technical Capabilities
- Microsoft Teams integration
- OpenAI-powered explanations
- Context-aware responses based on course content
- Basic analytics for measuring student engagement

## 🧪 Classroom Testing

This prototype is specifically designed for classroom validation with these testing goals:

1. Measure student engagement with AI-powered learning assistance
2. Evaluate the effectiveness of personalized concept explanations
3. Gather usage data to inform future development

### Testing Protocol

1. Deploy to a single classroom (15-30 students)
2. Pre-load course content for a specific unit
3. Introduce students to the tool (5-10 minute orientation)
4. Allow usage during study/review sessions
5. Collect usage analytics and student feedback

## 📊 Architecture

The system follows a modern, scalable architecture:

```
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│   Teams Frontend    │◄────►│   Express Backend   │
│                     │      │                     │
└─────────────────────┘      └──────────┬──────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │                     │
                              │    OpenAI API       │
                              │                     │
                              └─────────────────────┘
```

## 📂 Project Structure

```
adaptive-learning-system/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Main application pages
│   │   └── hooks/           # Custom React hooks
├── server/                  # Express backend
│   ├── api/                 # API routes
│   ├── services/            # Business logic
│   └── models/              # Data models
├── teams-app/               # Microsoft Teams app manifest
├── docs/                    # Documentation
└── README.md                # Project documentation
```

## 📈 Roadmap

- **Phase 1**: MVP classroom validation
- **Phase 2**: Teacher dashboard and analytics
- **Phase 3**: Advanced personalization and curriculum management
- **Phase 4**: Enterprise-grade deployment and scaling

## 🤝 Contributing

We welcome contributions to this project! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

For questions or collaboration opportunities, please contact [your.email@example.com](mailto:your.email@example.com).
