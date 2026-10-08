# 🔬 Science Bridge AI

<div align="center">

**Bridging the language gap in science education with AI**

Empowering educators and students through intelligent bilingual science learning materials

[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.43-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-C5D9F1?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0M1RDlGMSIvPjwvc3ZnPg==)](https://orm.drizzle.team/)
[![Lucia Auth](https://img.shields.io/badge/Lucia-Auth-6366F1?logo=javascript)](https://lucia-auth.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-EA4335?logo=google)](https://deepmind.google/technologies/gemini/)

[🌐 Live Demo](https://sciencebridgeai.mncuchiinhuttt.dev) • [📧 Contact](#contact) • [🐛 Report Bug](#contributing) • [✨ Request Feature](#contributing)

</div>

---

## 📖 About The Project

**Science Bridge AI** is a revolutionary web-based platform designed to empower educators and students in bilingual science education. It directly addresses the critical challenge of teaching and learning complex scientific concepts in English when the primary curriculum is in Vietnamese.

By harnessing the power of **Google's Gemini AI**, this platform automates the creation of high-quality, context-aware educational materials. Teachers can simply upload their existing Vietnamese science documents (textbook chapters, worksheets, lecture notes), and the AI instantly generates a comprehensive suite of English-language resources tailored to their specific curriculum.

### The Problem We Solve

- ⏱️ Teachers spend countless hours manually translating and adapting materials
- 📚 Language barriers often hinder student comprehension of complex scientific concepts
- 🔤 Limited bilingual resources available for science education
- 💼 Lack of structured, professional learning materials for English-language science instruction

### Our Solution

Science Bridge AI dramatically reduces preparation time while ensuring both teachers and students have polished, professional tools needed to succeed in bilingual learning environments. This significantly improves accessibility and effectiveness of science education, breaking down language barriers and fostering deeper understanding of scientific principles.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Content Generation** | Upload Vietnamese source documents (PDFs, images) and let advanced AI generate a complete teaching suite |
| 📋 **Comprehensive Lesson Plans** | Automatically creates detailed, well-structured lesson plans in English, classroom-ready |
| 📚 **Student-Ready Study Materials** | Generates tailored study guides and summaries optimized for student learning |
| 🎓 **Interactive Vocabulary Decks** | Builds bilingual flashcards with IPA pronunciation and text-to-speech audio |
| 🔐 **Secure Authentication** | Complete authentication system with Lucia, Argon2 password hashing, and session management |
| 🎨 **Modern, Responsive UI** | Clean, intuitive interface optimized for all devices |
| 📥 **Downloadable Resources** | Export lesson plans and study materials as `.docx` files for offline use and editing |
| 🎯 **User Dashboard** | Intuitive dashboard to manage lessons, upload documents, and track progress |

---

## 🏗️ Tech Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** (v2.43) - Modern meta-framework for Svelte applications
- **[Svelte](https://svelte.dev/)** (v5.39) - Reactive UI framework with compiled output
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1) - Utility-first CSS framework
- **[shadcn-svelte](https://www.shadcn-svelte.com/)** - High-quality, accessible component library
- **[Bits UI](https://www.bits-ui.com/)** - Unstyled, composable component library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful, consistent SVG icon set

### Backend & Database
- **[Drizzle ORM](https://orm.drizzle.team/)** (v0.44) - TypeScript-first ORM
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL database
- **[Drizzle Kit](https://orm.drizzle.team/docs/drizzle-kit-overview)** - Database migrations and management

### Authentication & Security
- **[Lucia](https://lucia-auth.com/)** - Modern authentication library
- **[Argon2](https://www.npmjs.com/package/@node-rs/argon2)** - Secure password hashing
- **[@oslojs/crypto](https://github.com/pilcrowonpaper/oslojs)** - Cryptographic utilities

### AI & Content Generation
- **[mnRouter AI Gateway](https://mnrouter.mncuchiinhuttt.dev)** - High-speed OpenAI-compatible gateway (`gemini-3.8-flash`)
- **[docx](https://docx.js.org/)** - Generate `.docx` documents programmatically
- **[gTTS](https://pypi.org/project/gTTS/)** - Google Text-to-Speech for audio pronunciation

### Development Tools
- **[Vite](https://vitejs.dev/)** (v7.1) - Next-generation frontend build tool
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9) - Type-safe JavaScript
- **[ESLint](https://eslint.org/)** - Code quality and style checking
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Svelte Check](https://www.npmjs.com/package/svelte-check)** - Svelte type checking

---

## 🚀 Getting Started

### Prerequisites

- **Bun** v1.0 or higher (or Node.js v18+)
- Google Gemini API key ([Get one here](https://ai.google.dev/))
- Neon database account ([Create here](https://neon.tech/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN.git
   cd AI_Ho_tro_giao_vien_hoc_sinh_KHTN
   ```

2. **Install dependencies**
   bun install

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root and add the following (use `.env.example` as template):
   ```env
   # Database connection string from Neon
   DATABASE_URL="postgresql://user:password@host/database"

   # Google Gemini API Key
   # Get this from https://ai.google.dev/
   GOOGLE_API_KEY="your_gemini_api_key_here"

   # Authentication secret (generate with: openssl rand -base64 32)
   AUTH_SECRET="your_secure_random_secret_here"
   ```

4. **Set up the database**
   
   Push your database schema to Neon:
   ```bash
   bun run db:push
   ```

5. **Run the development server**
   ```bash
   bun run dev
   ```

   Open your browser and navigate to `http://localhost:5173`

---

## 📚 Usage Guide

### For Teachers

1. **Register & Create Account**
   - Visit the application and create a new account
   - Set up your profile with your teaching information

2. **Upload Vietnamese Documents**
   - Navigate to your dashboard
   - Drag and drop Vietnamese science documents (PDF, images)
   - Support for textbook chapters, worksheets, lecture notes

3. **Generate Lesson Materials**
   - Click "Create Lesson" button
   - Configure generation options if available
   - Wait for AI to process documents (typically 1-2 minutes)

4. **Access & Customize Generated Content**
   - View AI-generated lesson plan, study materials, and vocabulary deck
   - Review and make adjustments as needed
   - Preview the complete lesson package

5. **Download Resources**
   - Export lesson plan as `.docx` file
   - Download study materials for offline use
   - Share vocabulary deck with students

### For Students

1. **Access Shared Lessons**
   - Receive lesson link from your teacher
   - No registration required to view lessons

2. **Study with Generated Materials**
   - Review lesson content and study guides
   - Practice with bilingual vocabulary flashcards
   - Use text-to-speech for pronunciation guidance

3. **Interactive Learning**
   - Flip flashcards to reveal translations and IPA pronunciation
   - Listen to native pronunciation via text-to-speech
   - Track your learning progress

---

## 📁 Project Structure

```
AI_Ho_tro_giao_vien_hoc_sinh_KHTN/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable Svelte components
│   │   │   ├── auth/            # Authentication-related components
│   │   │   ├── ui/              # UI component library
│   │   │   └── ...
│   │   ├── server/
│   │   │   ├── db/              # Database setup and queries
│   │   │   ├── auth/            # Authentication logic
│   │   │   ├── schema.ts        # Drizzle database schema
│   │   │   └── ai/              # AI/Gemini integration
│   │   └── utils/               # Utility functions
│   ├── routes/
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (app)/               # Main application pages
│   │   ├── +layout.svelte       # Root layout
│   │   └── +page.svelte         # Home page
│   └── app.html                 # HTML template
├── static/                       # Static assets (images, fonts, etc.)
├── drizzle.config.ts            # Drizzle ORM configuration
├── svelte.config.js             # SvelteKit configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment variables template
└── package.json                # Project dependencies
```

---

## 🛠️ Development Commands

```bash
# Development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking for Svelte
npm run check
npm run check:watch

# Code formatting
npm run format

# Linting and formatting checks
npm run lint

# Database management
npm run db:push          # Push schema to database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (visual DB editor)
```

---

## 🔐 Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string from Neon | `postgresql://user:pass@host/db` |
| `GOOGLE_API_KEY` | Google Gemini API key | `AIza... ` |
| `AUTH_SECRET` | Secret for session/token encryption | Generated via `openssl rand -base64 32` |

### Optional Variables

```env
# Application configuration
APP_NAME="Science Bridge AI"
APP_URL="http://localhost:5173"

# Feature flags
ENABLE_ANALYTICS=true
DEBUG_MODE=false
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@sveltejs/kit` | 2.43 | SvelteKit framework |
| `svelte` | 5.39 | UI framework |
| `tailwindcss` | 4.1 | CSS styling |
| `drizzle-orm` | 0.44 | Database ORM |
| `lucia` | - | Authentication |
| `@google/genai` | 1.26 | Google Gemini AI |
| `docx` | 9.5 | Document generation |
| `vite` | 7.1 | Build tool |

---

## 🚀 Deployment

### Deploy on Vercel

Vercel provides the easiest deployment experience for SvelteKit applications:

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "Import Project" and select your GitHub repository
   - Select `AI_Ho_tro_giao_vien_hoc_sinh_KHTN` repository

3. **Configure environment variables**
   - In Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add all variables from `.env.example`:
     - `DATABASE_URL`
     - `GOOGLE_API_KEY`
     - `AUTH_SECRET`

4. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - Your app will be live at `https://your-domain.vercel.app`

### Deploy with Docker

Create a `Dockerfile`:

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

ENV NODE_ENV=production

CMD ["bun", "./build/index.js"]
```

Build and run:
```bash
docker build -t science-bridge-ai .
docker run -p 3000:3000 -e DATABASE_URL="..." -e GOOGLE_API_KEY="..." science-bridge-ai
```

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/AI_Ho_tro_giao_vien_hoc_sinh_KHTN.git
   ```

2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure code passes linting and type checks

### Development Guidelines

- Write TypeScript-first code
- Follow the existing code style
- Run `npm run lint` before committing
- Add meaningful commit messages
- Test your changes locally

---

## 📝 License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Database connection fails**
- Verify `DATABASE_URL` is correct
- Check Neon database status
- Ensure firewall allows connection

**Issue: Google Gemini API errors**
- Confirm `GOOGLE_API_KEY` is valid
- Check API quota and billing
- Verify API is enabled in Google Cloud Console

**Issue: Build fails with TypeScript errors**
- Run `npm run check` to see detailed errors
- Ensure all types are properly imported
- Check Node.js version (v18+)

---

## 🔗 Useful Resources

- 📖 [SvelteKit Documentation](https://kit.svelte.dev/docs/introduction)
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- 🗄️ [Drizzle ORM Documentation](https://orm.drizzle.team/)
- 🔐 [Lucia Authentication Docs](https://lucia-auth.com/)
- 🤖 [Google Gemini API Docs](https://ai.google.dev/docs)
- 🌐 [Neon Database Docs](https://neon.tech/docs/introduction)

---

## 📧 Contact & Support

- **GitHub**: [@mncuchiinhuttt](https://github.com/mncuchiinhuttt)
- **Project Repository**: [AI_Ho_tro_giao_vien_hoc_sinh_KHTN](https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN)
- **Live Demo**: [sciencebridgeai.mncuchiinhuttt.dev](https://sciencebridgeai.mncuchiinhuttt.dev)
- **Report Issues**: [GitHub Issues](https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN/issues)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powerful AI capabilities
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [SvelteKit](https://kit.svelte.dev/) community for the amazing framework
- [shadcn-svelte](https://www.shadcn-svelte.com/) for beautiful UI components
- All educators and students using Science Bridge AI

---
