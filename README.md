# Tigger - Project Management System

## Table of Contents

1. [Introduction](#introduction)
2. [Aims](#aims)
3. [Objectives](#objectives)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Key Features](#key-features)

---

## Introduction

**Tigger** is a modern, full-stack web-based project management system designed to help teams and organizations efficiently manage their projects, tasks, and collaboration. The application provides an intuitive and visually appealing interface that enables users to create projects, assign tasks, track progress, and collaborate with team members in real-time.

In today's fast-paced work environment, effective project management is crucial for the success of any organization. Traditional methods of tracking projects using spreadsheets or manual processes are often error-prone, time-consuming, and lack real-time collaboration capabilities. Tigger addresses these challenges by providing a centralized platform where team members can:

- **Organize Projects**: Create and manage multiple projects with detailed information including descriptions, priorities, timelines, and team assignments.
- **Track Tasks**: Break down projects into manageable tasks with status tracking, priority levels, due dates, and assignee management.
- **Visualize Progress**: Use Kanban boards and analytics dashboards to visualize project progress and team productivity.
- **Collaborate Effectively**: Enable team collaboration through comments, task assignments, and shared workspaces.

The application follows modern web development practices and implements a clean, responsive user interface with support for both light and dark themes, ensuring accessibility and usability across different devices and user preferences.

---

## Aims

The primary aims of the Tigger project management system are:

### 1. Streamline Project Management Workflow

To create a comprehensive platform that simplifies the complexities of project management by providing intuitive tools for planning, executing, and monitoring projects from inception to completion.

### 2. Enhance Team Collaboration

To facilitate seamless communication and collaboration among team members by providing shared workspaces, task assignments, and real-time updates that keep everyone aligned and informed.

### 3. Improve Productivity and Efficiency

To help teams work more efficiently by providing visual tools like Kanban boards, analytics dashboards, and calendar views that enable quick decision-making and progress tracking.

### 4. Provide Real-time Visibility

To offer stakeholders and team members real-time visibility into project status, task completion rates, and potential bottlenecks through comprehensive dashboards and reporting features.

### 5. Ensure Secure and Scalable Architecture

To build a robust, secure, and scalable system that can accommodate growing teams and organizations while maintaining data security and user privacy through modern authentication mechanisms.

---

## Objectives

The specific objectives of the Tigger project are:

### Functional Objectives

| #   | Objective                | Description                                                                                                                                                                                                                           |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **User Authentication**  | Implement secure user authentication and authorization using Clerk, supporting multiple authentication methods and organization management.                                                                                           |
| 2   | **Project Management**   | Enable users to create, read, update, and delete projects with attributes such as name, description, priority (Low/Medium/High), status (Planning/Active/Completed/Hold/Inactive/Cancelled), start date, end date, and team members.  |
| 3   | **Task Management**      | Provide comprehensive task management capabilities including task creation, assignment, status tracking (Todo/In Progress/Done), priority setting, type classification (Task/Bug/Feature/Improvement/Other), and due date management. |
| 4   | **Kanban Board**         | Implement a drag-and-drop Kanban board interface for visual task management and workflow optimization.                                                                                                                                |
| 5   | **Dashboard Analytics**  | Create an interactive dashboard displaying key metrics including total projects, completed projects, assigned tasks, overdue tasks, and recent project activities.                                                                    |
| 6   | **Calendar Integration** | Provide calendar view functionality to visualize project timelines and task deadlines.                                                                                                                                                |
| 7   | **Comment System**       | Enable team collaboration through a commenting system on tasks for discussions and updates.                                                                                                                                           |
| 8   | **Organization Support** | Support multi-organization workspace management allowing users to work across different teams and projects.                                                                                                                           |

### Technical Objectives

| #   | Objective                   | Description                                                                                                                  |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Responsive Design**       | Develop a fully responsive user interface that works seamlessly across desktop, tablet, and mobile devices.                  |
| 2   | **Dark/Light Theme**        | Implement theme switching functionality supporting both dark and light modes for user preference.                            |
| 3   | **RESTful API**             | Design and implement a RESTful API architecture for smooth communication between frontend and backend.                       |
| 4   | **Database Management**     | Utilize PostgreSQL with Sequelize ORM for efficient data storage, retrieval, and relationship management.                    |
| 5   | **State Management**        | Implement efficient client-side state management using Zustand for optimal application performance.                          |
| 6   | **Form Validation**         | Integrate comprehensive form validation using React Hook Form and Zod schema validation.                                     |
| 7   | **Security Implementation** | Implement security best practices including rate limiting, CORS configuration, and secure authentication.                    |
| 8   | **Modern UI/UX**            | Create an aesthetically pleasing and intuitive user interface with smooth animations, gradients, and modern design patterns. |

---

## Technology Stack

### Frontend Technologies

| Technology            | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| **React 19**          | Core UI library for building the user interface |
| **Vite**              | Fast build tool and development server          |
| **React Router DOM**  | Client-side routing and navigation              |
| **Tailwind CSS 4**    | Utility-first CSS framework for styling         |
| **Zustand**           | Lightweight state management solution           |
| **React Hook Form**   | Performant form handling library                |
| **Zod**               | TypeScript-first schema validation              |
| **Clerk**             | Authentication and user management              |
| **Recharts**          | Charting library for analytics visualization    |
| **Lucide React**      | Modern icon library                             |
| **@hello-pangea/dnd** | Drag and drop functionality for Kanban board    |
| **date-fns**          | Date manipulation and formatting                |

### Backend Technologies

| Technology             | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| **Node.js**            | JavaScript runtime environment              |
| **Express 5**          | Web application framework                   |
| **PostgreSQL**         | Relational database management system       |
| **Sequelize**          | Promise-based ORM for database operations   |
| **Clerk Express**      | Backend authentication middleware           |
| **express-rate-limit** | API rate limiting for security              |
| **CORS**               | Cross-origin resource sharing configuration |
| **dotenv**             | Environment variable management             |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   React +   │  │   Tailwind   │  │        Zustand          │ │
│  │    Vite     │  │     CSS      │  │   (State Management)    │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │    Clerk    │  │ React Router │  │      React Hook Form    │ │
│  │    Auth     │  │     DOM      │  │        + Zod            │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Backend)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   Express   │  │    Clerk     │  │     Rate Limiting       │ │
│  │   Server    │  │  Middleware  │  │        + CORS           │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Controller Layer                         ││
│  │• Project Controller  • Task Controller  • Comment Controller││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────────┘
                            │ Sequelize ORM
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   Projects  │  │    Tasks     │  │       Comments          │ │
│  │    Table    │  │    Table     │  │        Table            │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Dashboard

- Welcome screen with personalized greeting
- Statistics cards showing total projects, completed projects, assigned tasks, and overdue items
- Project overview with progress tracking
- Quick access to overdue and personal tasks

### 2. Project Management

- Create projects with comprehensive details
- Set project priority levels (Low/Medium/High)
- Track project status through lifecycle stages
- Assign project managers and team members
- Define project timelines with start and end dates

### 3. Task Management

- Create and manage tasks within projects
- Drag-and-drop Kanban board interface
- Task status workflow (Todo → In Progress → Done)
- Task types: Task, Bug, Feature, Improvement, Other
- Priority assignment and due date tracking
- Task assignee management

### 4. Analytics & Visualization

- Project progress tracking with visual indicators
- Completion rate calculations
- Task distribution charts
- Timeline visualization through calendar view

### 5. Authentication & Security

- Secure user authentication via Clerk
- Organization-based access control
- Rate limiting for API protection
- Secure session management

### 6. User Experience

- Responsive design for all screen sizes
- Dark and light theme support
- Modern animations and transitions
- Intuitive navigation and user interface

---

## Author

**Abhishek Adhikari**

---

_This documentation was created for academic purposes as part of a college project submission._
