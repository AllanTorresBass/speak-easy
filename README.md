# SpeakEasy 🗣️✨

**SpeakEasy** is your comprehensive English learning companion that transforms the way you master the English language. Whether you're a beginner taking your first steps or an advanced learner polishing your skills, SpeakEasy provides structured learning paths, interactive practice, and personalized content to accelerate your English proficiency.

## 🌟 Features

### 📚 **Comprehensive Learning Resources**
- **Vocabulary Lists**: 25+ curated vocabulary lists covering essential English words and phrases
- **Grammar Materials**: Complete grammar guides from basic structure to advanced concepts
- **Interview Preparation**: Specialized content for job interviews and professional communication
- **Industry-Specific Content**: Software development, UX/UI design, and project management terminology

### 🎯 **Structured Learning Paths**
- **Basic Structure**: Subject-predicate, verbs, adjectives, nouns, adverbs, conjunctions, pronouns, determiners, prepositions, clauses
- **Complex Structure**: Modifiers, comparative/superlative, present perfect, past perfect, conditionals, passive voice, indirect questions, subordinate clauses
- **Cause-Effect Relationships**: Understanding logical connections in English
- **Verb Conjugation**: Complete guide to English verb forms and tenses

### 💼 **Professional Development**
- **Interview Q&A**: Common interview questions and effective responses
- **Soft Skills**: Communication, leadership, and teamwork concepts
- **Technical Vocabulary**: Industry-specific terminology and concepts
- **Project Management**: Essential project management vocabulary and concepts

## 🚀 Getting Started

### Prerequisites
- Basic understanding of English alphabet and pronunciation
- Desire to improve English language skills
- Access to a text editor or learning platform

### Installation
```bash
# Clone the repository
git clone https://github.com/AllanTorresBass/speak-easy.git

# Navigate to the project directory
cd speak-easy

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
speak-easy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── api/               # API endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── forms/            # Form components
│   │   ├── learning/         # Learning-specific components
│   │   └── common/           # Shared components
│   ├── lib/                  # Utility libraries
│   │   ├── utils.ts          # Helper functions
│   │   ├── db.ts             # Database connection
│   │   └── query-client.ts   # React Query client
│   ├── hooks/                # Custom React hooks
│   ├── contexts/             # React contexts
│   │   ├── language-context.tsx  # Multi-language support
│   │   └── theme-context.tsx     # Dark/light mode
│   ├── types/                # TypeScript definitions
│   └── data/                 # Learning content
├── json/                     # Vocabulary and grammar data
├── md/                       # Markdown documentation
└── promova/                  # Additional learning resources
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **Database**: Neon (PostgreSQL)
- **Authentication**: NextAuth.js (planned)
- **Deployment**: Vercel-ready

## 🎯 Current Status

✅ **Phase 1 Complete**: Core Infrastructure & Landing Page
- [x] Next.js project setup with App Router
- [x] All dependencies installed and configured
- [x] shadcn/ui component library (20+ components)
- [x] TypeScript types and interfaces
- [x] Database connection (Neon PostgreSQL)
- [x] React Query client configuration
- [x] Multi-language support (EN, ES, FR, DE)
- [x] Dark/light theme system
- [x] Beautiful responsive landing page
- [x] SEO optimization and metadata

🔄 **Phase 2 In Progress**: Core Features
- [ ] Authentication system
- [ ] Dashboard layout and navigation
- [ ] Vocabulary learning interface
- [ ] Grammar lesson system
- [ ] Progress tracking
- [ ] User management

## 📖 How to Use

### 1. **Choose Your Learning Path**
- Start with basic structure if you're a beginner
- Jump to specific topics based on your needs
- Use vocabulary lists to expand your word bank

### 2. **Practice with Interactive Content**
- Work through grammar exercises
- Practice with cause-effect relationships
- Review interview questions and answers

### 3. **Track Your Progress**
- Complete vocabulary lists systematically
- Master grammar concepts before moving forward
- Practice speaking and writing with learned concepts

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 🤝 Contributing

We welcome contributions to improve SpeakEasy! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **English Language Learners** worldwide for inspiration
- **Language Teachers** for methodology insights
- **Open Source Community** for collaboration tools
- **GitHub** for hosting and version control

---

**Ready to transform your English learning experience? Start with SpeakEasy today! 🚀**

---

*Made with ❤️ for English learners worldwide*
