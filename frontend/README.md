# Legal AI Advisor - Version 2.0

An intelligent AI-powered chatbot for Indian legal guidance, built with Next.js and modern web technologies.

## Features

### Version 2.0 Enhancements
- **Conversation Management**: Full message history with persistent conversations
- **Export Chats**: Download conversations as JSON for record-keeping
- **Delete Conversations**: Remove old conversations from sidebar
- **Clear Chat**: Clear current conversation with confirmation
- **Auto-Title Generation**: Conversations automatically titled from first message
- **Share Messages**: Share individual AI responses
- **Enhanced UI**: Improved sidebar with hover actions and better visual feedback

### Core Features
- **AI-Powered Legal Advice**: Get accurate information about Indian law
- **Property Law Expertise**: Guidance on house registration, property rights, and transfers
- **Succession Law**: Information about inheritance and succession procedures
- **Constitutional Knowledge**: Answers about Indian Constitution and fundamental rights
- **Source Citations**: AI responses include relevant legal sources
- **Dark Theme**: Modern dark interface optimized for readability
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Download the project** from v0.app or clone from GitHub

2. **Install dependencies**:
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**:
Create a `.env.local` file in the root directory:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

4. **Run the development server**:
\`\`\`bash
npm run dev
\`\`\`

5. **Open in browser**:
Navigate to `http://localhost:3000`

## Usage

### Starting a Conversation
1. Click "New Chat" in the sidebar to start a fresh conversation
2. Type your legal question in the input field
3. Press Enter or click the Send button

### Managing Conversations
- **View History**: All conversations appear in the left sidebar
- **Switch Conversations**: Click any conversation to view its history
- **Delete Conversation**: Hover over a conversation and click the trash icon
- **Clear Current Chat**: Click the trash icon in the header to clear messages

### Exporting Conversations
1. Click the Download icon in the header
2. Your conversation will be saved as a JSON file
3. Use this for record-keeping or sharing with legal professionals

### Copying & Sharing
- **Copy Response**: Click "Copy" on any AI response to copy to clipboard
- **Share Response**: Click "Share" to share via native share or copy to clipboard

## Technology Stack

- **Frontend**: React 19 with Next.js 16
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK with OpenAI GPT-4o-mini
- **Font**: Montserrat (Google Fonts)
- **Icons**: Lucide React

## API Integration

The chatbot connects to `/api/chat` endpoint which:
- Processes user queries using NLP
- Searches legal database for relevant information
- Generates conversational responses using AI
- Returns sources and citations

## Important Disclaimer

⚠️ **Legal Disclaimer**: This AI provides general legal information only. It is not a substitute for professional legal advice. Always consult with a qualified lawyer for:
- Specific legal cases
- Court proceedings
- Official legal documents
- Binding legal advice

## File Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main page with conversation management
│   ├── layout.tsx            # Root layout with fonts
│   ├── globals.css           # Global styles and design tokens
│   └── api/
│       └── chat/
│           └── route.ts      # Chat API endpoint
├── components/
│   ├── chat-interface.tsx    # Main chat UI
│   ├── chat-message.tsx      # Message display component
│   ├── sidebar.tsx           # Conversation sidebar
│   ├── welcome-screen.tsx    # Welcome/empty state
│   └── ui/                   # shadcn/ui components
├── public/
│   └── legal-database.json   # Legal information database
└── scripts/
    ├── scrape-legal-data.js  # Web scraping script
    └── test-legal-queries.js # Testing suite
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables
5. Click Deploy

### Deploy to Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Self-hosted servers

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Code Quality
- ESLint configured for code quality
- TypeScript for type safety
- Tailwind CSS for consistent styling

## Future Enhancements

- Multi-language support (Hindi, Tamil, etc.)
- Advanced search filters
- Conversation bookmarking
- Integration with legal databases
- User authentication and cloud sync
- Mobile app version
- Voice input support

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Visit [vercel.com/help](https://vercel.com/help)
- Check the Help & FAQ in the app

## License

This project is created with v0.app and follows the Vercel terms of service.

## Version History

### v2.0 (Current)
- Enhanced conversation management
- Export/import functionality
- Improved UI with better interactions
- Share individual messages
- Auto-title generation

### v1.0
- Initial release
- Basic chat interface
- AI-powered legal responses
- Dark theme

---

**Built with ❤️ using v0.app**
