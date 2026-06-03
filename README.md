# Panthi Clinic 3D Website - "Clinical Ethereal" (Modular Server Application)

Welcome to the modular server-based Node.js web application for the Panthi Clinic 3D dental excellence website. The project has been fully reorganized into a production-grade layout using `npm`, `Express.js` (Modular Routing), **MongoDB Atlas** (Mongoose DB Schemas), and **Nodemailer** alerts.

---

## 📂 Project Architecture

The workspace contains the following modular directories and files:

```
d:\stitch_panthi_clinic_3d_website\
├── package.json           # npm settings, start scripts, and package dependencies
├── server.js              # ROOT BOOTSTRAP: loads env, connects to DB, mounts routes, serves statics
├── .env                   # SECRET CONFIGS: server ports, Mongo URIs, SMTP credentials
├── .gitignore             # GIT EXCLUSIONS: ignores node_modules, secrets, and lock files
├── README.md              # Project documentation (this file)
├── node_modules/          # Downloaded server-side node packages (after npm install)
├── backend\
│   ├── config\
│   │   └── db.js          # Mongoose connection setup script for MongoDB Atlas
│   ├── models\
│   │   └── Reservation.js # Mongoose schema mapping for reservation collection models
│   └── routes\
│       └── appointmentRoutes.js # Routing controllers (API routing: slots search & reservation submits)
└── frontend\
    ├── css\
    │   └── style.css      # Consolidated styles: glassmorphism, 3D teal ambient shadows, and transitions
    ├── js\
    │   ├── tailwind-config.js # Shared design system token configuration (Tailwind CDN theme config)
    │   ├── homepage.js        # Interactive scripts: 3D hover-parallax tilting card, scroll-spy tabs
    │   └── appointment.js     # Interactive scripts: wizard control, AJAX slots fetcher, validation & submit
    ├── html\
    │   ├── index.html     # Main clinic landing page (Bento grids, services, testimonials)
    │   └── appointment.html   # Clinical appointment booking form wizard (4-step visual scheduler)
    └── public\
        ├── DESIGN.md      # Original brand and design specifications
        └── images\
            ├── screen_homepage.png     # Mockup/screenshot reference of the homepage
            └── screen_appointment.png  # Mockup/screenshot reference of the appointment page
```

---

## ⚙️ Setting Up Environment Secrets (`.env`)

To configure your database and email parameters, open and edit the **`.env`** file located in the root of the project:

```env
# Server Port
PORT=3000

# MongoDB Atlas connection string URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.com/panthi_clinic?retryWrites=true&w=majority

# Dentist Destination Notification Email
DENTIST_EMAIL=aryanpanthi77@gmail.com

# SMTP Nodemailer Settings (Optional - leave empty to use console mock logger)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

### 🔌 Resilient Database Fallback Mode
If your `MONGODB_URI` connection string is missing or contains the default `<username>` placeholder, the server **will not crash**. It will display a clear setup reminder in the terminal and automatically run in **Offline Mock Mode** (saving new reservations directly to temporary memory), allowing you to review visual layouts and click interfaces instantly!

---

## 🛠️ Clinic Business Rules (Enforced)

The scheduling system strictly maintains the clinic's operating constraints:
1.  **Operating Hours:** Open daily from **7:00 AM to 7:00 PM**.
2.  **Lunch Break:** **1:00 PM to 2:00 PM** is blocked. No appointments can overlap with this window.
3.  **Treatment Durations:** Est. time varies per service:
    -   *General Consultation:* 30 minutes
    -   *Cosmetic Dentistry:* 60 minutes (1 hour)
    -   *Dental Implants:* 120 minutes (2 hours)
    -   *Orthodontics:* 90 minutes (1.5 hours)
4.  **Collision Prevention:** Slotted durations are checked dynamically against MongoDB collections to prevent double-booking.

---

## 🚀 How to Run locally

To start the server application, open your terminal in the project directory and follow these steps:

### Step 1: Install Dependencies
Run the following command once to install Express, Mongoose, Dotenv, Nodemailer, and Nodemon:
```bash
npm install
```

### Step 2: Launch the Server
You have two npm run commands available:

*   **For Development (Recommended):**
    This uses Nodemon to auto-restart the server every time you modify and save files (`.js`, `.css`, or `.html`):
    ```bash
    npm run dev
    ```
*   **For Production / Simple Run:**
    Starts the server directly with Node:
    ```bash
    npm start
    ```

Once started, the terminal will log a link to access the website:
🔗 **Local Address:** **[http://localhost:3000](http://localhost:3000)**
