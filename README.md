# Science Bridge AI

<div align="center">
  <h3 align="center">Science Bridge AI</h3>
  <p align="center">
    Bridging the language gap in science education with AI.
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

---

## About The Project

**Science Bridge AI** is a web-based platform designed to empower educators and students in bilingual science education. It addresses the challenge of teaching and learning complex scientific concepts in English when the primary curriculum is in Vietnamese.

By leveraging the power of Google's Gemini AI, this tool automates the creation of high-quality, context-aware educational materials. Teachers can simply upload their existing Vietnamese science documents (such as textbook chapters or worksheets), and the AI will generate a comprehensive suite of English-language resources. This significantly reduces preparation time and ensures that both teachers and students have the tools they need to succeed in a bilingual learning environment.

The goal is to make science education more accessible and effective, breaking down language barriers and fostering a deeper understanding of scientific principles, regardless of the primary language of instruction.

---

## Key Features

- **AI-Powered Content Generation**: Upload Vietnamese source documents (PDFs, images) and let the AI generate a complete set of teaching materials.
- **Comprehensive Lesson Plans**: Automatically creates detailed, structured lesson plans in English, ready for classroom use.
- **Student-Ready Study Materials**: Generates study guides and summaries from the source content, tailored for students.
- **Interactive Vocabulary Decks**: Builds bilingual vocabulary flashcards with IPA pronunciation and text-to-speech audio to aid in language acquisition.
- **Secure User Authentication**: Features a complete authentication system with Lucia, including secure password hashing (Argon2) and session management.
- **Modern, Responsive UI**: A clean, intuitive, and responsive interface built with SvelteKit and Tailwind CSS, ensuring a seamless experience on any device.
- **Downloadable Resources**: All generated materials, including lesson plans and study documents, can be downloaded as `.docx` files for offline use and easy editing.

---

## Built With

This project is built with a modern, type-safe, and efficient stack:

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-svelte](https://www.shadcn-svelte.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [Neon](https://neon.tech/) (Serverless Postgres)
- **Authentication**: [Lucia](https://lucia-auth.com/)
- **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)
- **Text-to-Speech**: [gTTS (Google Text-to-Speech)](https://pypi.org/project/gTTS/)
- **Document Generation**: [docx](https://docx.js.org/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN.git
   cd AI_Ho_tro_giao_vien_hoc_sinh_KHTN
   ```
2. **Install dependencies**

   ```sh
   npm install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root of the project and add the following variables. You can use the `.env.example` file as a template.

   ```env
   # Database connection string from Neon
   DATABASE_URL="your_database_connection_string"

   # Google AI API Key
   GOOGLE_API_KEY="your_gemini_api_key"

   # You can generate a secret with `openssl rand -base64 32`
   AUTH_SECRET="your_lucia_auth_secret"
   ```
4. **Push the database schema**
   This command will sync your database schema with the definitions in `src/lib/server/db/schema.ts`.

   ```sh
   npm run db:push
   ```
5. **Run the development server**

   ```sh
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

---

## Usage

1. **Register & Login**: Create a new account or sign in to access your dashboard.
2. **Upload Documents**: On the dashboard, drag and drop your Vietnamese science documents (PDFs or images) into the upload area.
3. **Generate Lesson**: Once your files are uploaded, click the "Create Lesson" button. The AI will process the documents and generate the materials.
4. **Access Your Lesson**: After a few moments, you will be provided with a unique link to the generated lesson page.
5. **Explore & Download**: On the lesson page, you can view the lesson details, interact with the vocabulary flashcards, and download the lesson plan and study documents.

---

## Project Structure

A brief overview of the key directories in the project:

- `src/lib/components/`: Contains all reusable Svelte components, organized by feature (e.g., `auth`, `ui`).
- `src/lib/server/`: Holds all server-side logic, including database setup (`db`), authentication (`auth`), and schema definitions.
- `src/routes/`: Defines the application's pages and API endpoints using SvelteKit's file-based routing system.
- `drizzle.config.ts`: Configuration file for the Drizzle ORM.
- `static/`: Publicly accessible static assets like images and fonts.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

Project Link: [https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN](https://github.com/mncuchiinhuttt/AI_Ho_tro_giao_vien_hoc_sinh_KHTN)
