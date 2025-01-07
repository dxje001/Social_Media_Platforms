# DRS - Social Network Simulation

## Overview
The **DRS Social Network** is a simulation project designed to mimic the functionalities of modern social networks. It includes features for user registration, authentication, friend management, and post creation with administrative oversight. The system is implemented with three core components: 

1. **User Interface (UI)**  
2. **Service for Request and Data Processing (Engine)**  
3. **Database (DB)**  

## Key Technologies
- **Frontend/UI:** Angular, CSS, HTML, TypeScript
- **Backend/Engine:** Flask API Application with RESTful endpoints 
- **Database:** MySQL
- **Real-Time Communication:** WebSocket for live updates
- **Email Notifications:** Automated email functionality for registration, notifications, and status updates.

## System Components
### 1. **User Interface (UI)**
The UI is a Flask-based web application that facilitates interaction with the system. It supports:
- **Administrator Functions:**
  - Initial admin account setup with fields like name, address, email, and more.
  - Creating and managing user accounts.
  - Approving or rejecting user posts.
  - Managing blocked users and unblocking them.

- **User Functions:**
  - Logging in with a username and password.
  - Editing personal account details.
  - Creating, editing, and deleting posts.
  - Searching for other users using fields like email, username, name, address, etc.
  - Sending, accepting, or rejecting friend requests.
  - Viewing and interacting with posts of friends.

### 2. **Engine**
The Engine is implemented as a Flask-based API service that handles all business logic and data processing. Its primary responsibilities include:
- Serving RESTful endpoints for the UI to interact with.
- Validating and processing user input and requests.
- Managing communication with the database.

### 3. **Database (DB)**
The database serves as the storage layer for all essential data, including:
- User information.
- Friend relationships.
- Posts and their statuses (pending, approved, rejected).
- Log of blocked users.

The database type is flexible (SQL or NoSQL) but must exclude SQLite.

## Key Features
- **Authentication:** Login with a username and password.
- **Registration:** Unique email and username for every user.
- **Post Creation and Approval:**  
  - Users can create posts containing text and images.  
  - Posts are sent for admin approval via email notifications.
  - Rejected posts can be edited and resubmitted.
  - Automatic user account blocking after 3 rejected posts, with admin-controlled unblocking.
  
- **Friend Management:**  
  - Users can send, accept, and reject friend requests.
  - Only posts from friends are visible, sorted by time.

- **Real-Time Updates:** Admins can monitor new post requests live without refreshing the page using WebSocket.

- **Notifications:**  
  - Email notifications for user registration, post submissions, and status updates (approval/rejection).

## How It Works
1. **Initial Setup:**
   - The system starts with an administrator account.
   - The admin can create new user accounts and manage the system.

2. **User Workflow:**
   - Users can register, log in, and manage their accounts.
   - Users can post updates, send friend requests, and interact with approved posts.

3. **Post Approval Process:**
   - Posts submitted by users are visible to the administrator.
   - The admin reviews and approves or rejects posts, notifying users via email.
   - Posts rejected more than three times result in automatic user account blocking.

4. **Database Interaction:**
   - All data is managed through the Engine service, ensuring separation of concerns between the UI and database.

## Getting Started
### Prerequisites:
- Python 3.8 or higher.
- Flask and necessary dependencies (specified in `requirements.txt`).
- A configured SQL or NoSQL database.

### Steps:
1. Clone the repository.
2. Set up the database schema.
3. Install the required Python dependencies:  

* Terminal 1
  ```bash
    py -m venv .venv
    .\.venv\Scripts\activate
    pip install -r .\backend\requirements.txt
    python.exe -m pip install --upgrade pip   
    cd .\backend\
    flask --app .\app\app.py run

* Terminal 2 
   ```bash
   cd .\frontend\DRS_frontend
  npm install
  ng serve


