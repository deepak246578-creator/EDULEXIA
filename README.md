# EDULEXIA • Dyslexia Learning Support Platform

An accessibility-first, compassionate educational web platform providing a **7-Stage Reading Screening Assessment**, **personalized adaptive phonics activities**, and **dedicated portals for Students, Parents, and Educators**.

---

## 🌟 Key Pillars

1. **Accessibility First (Universal Design for Learning)**
   - Specialized high-legibility fonts: **Lexend**, **Atkinson Hyperlegible**, **Comic Neue**, and **Inter**.
   - Adjustable font sizes, letter spacing (tracking), and line height.
   - Six visual-stress-reducing color palettes: Warm Cream, Soft Peach, Sky Blue, Mint Soothe, Night Calm, and High Contrast.
   - Mouse-following **Reading Guide Ruler** to eliminate line jumping.
   - Native **Web Speech API** text-to-speech audio reader on all instructions, questions, and reading passages.

2. **Positive, Encouraging Educational Assessment**
   - **Important Medical Disclaimer**: This system is designed as an *educational screening aid* and learning support tool. It is **not** a clinical, psychological, or medical diagnosis of dyslexia.
   - Focuses on strengths first. Replaces deficit labels with growth-oriented descriptors: *Strong*, *Moderate*, and *Supported Growth*.
   - Star rewards, streaks, and milestone badges without competitive leaderboards.

3. **Transparent Adaptive Recommendation Engine**
   - Clinically grounded rule-based engine that maps screening results and practice accuracy directly to structured phonics progressions (Levels 1 to 6).
   - Clean, modular interface designed for future integration with ML/ONNX models.

---

## 📚 7-Stage Screening Curriculum

| Stage | Domain Focus | Sample Exercise | Weight |
| :---: | :--- | :--- | :---: |
| **1** | **Letter Recognition** | Mirror letter discrimination ($b$, $d$, $p$, $q$) | 10% |
| **2** | **Letter–Sound Matching** | Consonant and vowel phoneme retrieval ($/k/$, $/s/$, $/f/$) | 15% |
| **3** | **Phonological Skills** | Sound segmentation and phoneme blending ($/f/+/ɪ/+/ʃ/$ → *FISH*) | 20% |
| **4** | **Word Recognition** | Word ladder transformations (*cat → cap → map → mop*) | 20% |
| **5** | **Sentence Reading** | Contextual sentence comprehension and tile arrangement | 15% |
| **6** | **Passage Reading** | Fluent short-story comprehension with detail retrieval | 15% |
| **7** | **Optional Voice Reading** | Microphone oral reading comparison with a **no-penalty skip option** | 5% |

---

## 👥 Portals & Personas

- **Student Hub (`/student`)**: Personalized learning track, star count, streak counter, adaptive AI recommendations, and interactive activity launcher.
- **Parent Portal (`/parent`)**: Encouraging interpretations of child's screening results, continuity tracking across attempts, and evidence-based home reading strategies.
- **Educator Hub (`/teacher`)**: Classroom student roster, phonological domain heatmap matrix, individual student drilldown, and classroom/IEP accommodation guidance.
- **1-Click Demo Profiles**:
  - **Student**: Leo Martin (`student@example.com` / `password123`)
  - **Parent**: Sarah Martin (`parent@example.com` / `password123`)
  - **Teacher**: Ms. Eleanor Vance (`teacher@example.com` / `password123`)

---

## 🚀 Quick Start

### 1. Installation
Install dependencies for both the Express backend and Vite frontend:
```bash
npm run install:all
```

### 2. Running Locally
Start both backend and frontend development servers concurrently:
```bash
npm run dev
# or
npm start
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Production Build
```bash
cd client && npm run build
```

---

## 🛡️ Architecture & Resilient Storage

- **Backend**: Modular Express.js REST API with JWT authentication and RBAC middleware.
- **Dual-Mode Persistence**: Automatically attempts to connect to MongoDB; if MongoDB is unavailable, it gracefully defaults to the built-in embedded persistent JSON database at `server/data/localStore.json`.
- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide React, and Canvas Confetti.
