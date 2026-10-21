# 🎵 Spotify Album Finder — Mood Finder & Album Comparison

A full-stack web application designed for music enthusiasts to search Spotify albums, inspect detailed album metadata, compare albums using a deterministic **Project Comparison Score**, discover music tailored to specific emotional moods, and manage personal favorite collections with secure user accounts.

Built from scratch using **Java 21, Spring Boot 3, Spring Security 6, JWT, MySQL, React (Vite), and Axios**.

---

## 🌟 Features

### 👤 User Authentication
- **User Registration**: Register with name, unique email, and strong password. Passwords are automatically hashed with BCrypt.
- **User Login & JWT**: Authenticates credentials and issues a signed HMAC-SHA256 JSON Web Token.
- **Route & Endpoint Protection**: Protected REST endpoints strictly require a valid Bearer token.
- **Logout**: Clears the client-side token and user profile securely.

### 🎵 Spotify Music Discovery
- **Album Search**: Fast album and artist search returning album title, artist, cover art, release date, track counts, and popularity.
- **Album Details**: In-depth album drawer view including Spotify popularity meter and direct Spotify Web player links.
- **Album Comparison**: Side-by-side head-to-head comparison engine with a deterministic 0–100 **Project Comparison Score**.
- **Mood Finder**: Emotional music discovery for 5 distinct vibes:
  - 😊 **Happy** (Upbeat pop & dance)
  - 💔 **Sad** (Melancholy acoustic ballads)
  - 🔥 **Energetic** (High-tempo workouts & electrifying beats)
  - 😌 **Relaxing** (Chill lofi & ambient)
  - ❤️ **Romantic** (Soulful R&B & slow intimate love songs)

### ❤️ Personal Collection & Analytics
- **Personal Favorites**: Authenticated users can save, inspect, and remove albums from their private collection.
- **Search History**: Automatically logs authenticated searches with timestamps for quick one-click re-searching.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript (ES6+), React Router 6, Axios, Vanilla CSS |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Web, Spring Security 6, Spring Data JPA, Hibernate |
| **Security & Auth** | JSON Web Tokens (JJWT 0.12.6), BCrypt Password Encoder |
| **Database** | MySQL Server 8.0 |
| **External API** | Spotify Web API (Client Credentials Flow) |
| **Build Tools** | Maven 3.9+, Node.js 24+, npm 11+ |

---

## 🏗️ Architecture

```text
                React Frontend (Port 5173)
                            │
                            │ HTTP / REST (with JWT Bearer Token)
                            ▼
           Spring Boot REST Backend (Port 8080)
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
   Spring Security 6                         MySQL 8.0
         │                                (Database: spotify_album_finder)
         ▼                                (Tables: users, favorites, search_history)
   JWT Verification
         │
         ▼
   Spotify Service
         │
         ▼
  Spotify Web API (Client Credentials Flow)
```

### Separation of Authentication Systems
1. **Application Authentication (Internal)**:
   - React ➔ Spring Boot ➔ Spring Security ➔ BCrypt ➔ JWT ➔ MySQL.
   - Manages our application's registered users.
2. **Spotify Web API Authentication (Server-to-Server)**:
   - Spring Boot Backend ➔ Spotify Accounts OAuth ➔ Spotify Web API.
   - Utilizes `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` entirely on the backend server. **The Spotify Client Secret is NEVER exposed to React or the browser.**

---

## 🔐 Security Explanation

1. **Why Passwords are Hashed**:
   Passwords are never stored in plain text. Spring Security's `BCryptPasswordEncoder` computes a salted, multi-round cryptographic hash before persisting into MySQL, protecting users even in the event of an unauthorized database dump.
2. **Why JWT (JSON Web Tokens) are Used**:
   Stateless authentication removes the need for server-side HTTP session storage. The Spring Boot backend validates incoming tokens cryptographically on every request.
3. **Backend Secret Isolation**:
   Both `JWT_SECRET` and `SPOTIFY_CLIENT_SECRET` are managed via environment variables and loaded into `application.properties`. Secrets are excluded from version control via `.gitignore`.
4. **CORS (Cross-Origin Resource Sharing)**:
   Strictly configured to allow requests from the trusted React development origin `http://localhost:5173` with credentials supported.

---

## 🆚 Comparison Algorithm ("Project Comparison Score")

The application provides an objective, deterministic comparison score (0 to 100 points) to compare two albums:

$$\text{Project Comparison Score} = \text{Popularity Score} + \text{Track Completeness Score} + \text{Era Factor}$$

- **Popularity Contribution (60% weight - Max 60 pts)**:
  $$\text{Popularity Score} = \frac{\text{Spotify Popularity (0-100)}}{100} \times 60$$
- **Track Completeness Contribution (25% weight - Max 25 pts)**:
  Evaluates album substance, capped at 20 tracks:
  $$\text{Track Completeness} = \frac{\min(\text{Total Tracks}, 20)}{20} \times 25$$
- **Era & Longevity Factor (15% weight - Max 15 pts)**:
  - Released 2020 or newer: **15 pts** (Contemporary freshness)
  - Released 2010 to 2019: **13 pts** (Modern classic)
  - Released prior to 2010: **11 pts** (Legacy classic)

> **Important**: This is our project's deterministic comparison formula based on Spotify metadata and is not an official editorial ranking from Spotify.

---

## 🎭 Mood Recommendation Algorithm

The Mood Finder implements a transparent, rule-based recommendation algorithm that maps human emotional states to tailored musical attributes:

1. **Happy**: Targets high-valence, upbeat pop, dance, and feel-good anthems.
2. **Sad**: Targets acoustic arrangements, minor keys, slow tempos, and emotional piano ballads.
3. **Energetic**: Targets high-BPM workout electronic, dynamic rock, and dance tracks.
4. **Relaxing**: Targets low-tempo acoustic, chill lofi, ambient, and peaceful instrumental tones.
5. **Romantic**: Targets intimate R&B, slow soul melodies, and heartfelt love ballads.

---

## 🚀 Setup & Running Locally

### 1. Prerequisites
- **Java 21**
- **Maven 3.8+**
- **Node.js 18+ & npm**
- **MySQL 8.0**

### 2. Environment Variables Configuration (Windows PowerShell)

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
$env:SPOTIFY_CLIENT_ID="your_spotify_client_id"
$env:SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
```

### 3. Run Backend (Spring Boot)

```powershell
cd C:\Users\Dell\Documents\SPOTIFY\backend
mvn clean spring-boot:run
```
Backend will start on: **`http://localhost:8080`**

### 4. Run Frontend (React + Vite)

In a new terminal window:

```powershell
cd C:\Users\Dell\Documents\SPOTIFY\frontend
npm run dev
```
Frontend will be available at: **`http://localhost:5173`**

---

## 🧪 Testing Verification Checklist

- [x] **Test 1**: Spring Boot starts successfully on port 8080.
- [x] **Test 2**: MySQL connection verified; schema created automatically.
- [x] **Test 3**: User registration endpoint (`POST /api/auth/register`) operational.
- [x] **Test 4**: User record verified in MySQL with BCrypt hashed password.
- [x] **Test 5 & 6**: Login endpoint (`POST /api/auth/login`) verified; returns valid JWT.
- [x] **Test 7 & 8**: Protected endpoints allow valid JWT and reject unauthorized requests with HTTP 403.
- [x] **Test 9**: Spotify API authentication verified via Client Credentials Flow.
- [x] **Test 10**: Album search returns standardized album metadata.
- [x] **Test 11**: Album details endpoint returns full track and popularity metrics.
- [x] **Test 12**: Album comparison calculates deterministic Project Comparison Score and determines winner.
- [x] **Test 13**: Mood Finder verified for all 5 moods (`happy`, `sad`, `energetic`, `relaxing`, `romantic`).
- [x] **Test 14**: User favorites CRUD verified with strict user-specific access control.
- [x] **Test 15**: Search history logs authenticated user queries.

---

## 📦 Git Repository Workflow

To initialize your Git repository and push your project to GitHub:

```powershell
cd C:\Users\Dell\Documents\SPOTIFY

# 1. Initialize git
git init

# 2. Stage all files (secrets and build files are ignored by .gitignore)
git add .

# 3. Create your initial commit
git commit -m "Initial commit: Spotify Album Finder complete full-stack project"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/your-username/spotify-album-finder.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🔮 Future Improvements
- Customizable user profile pictures and bios.
- Playlist generation directly into user's Spotify account.
- Social sharing of comparison results.
- Advanced multi-album tournaments (comparing 4 or more albums).
#   s p o t i f y - a l b u m - f i n d e r  
 