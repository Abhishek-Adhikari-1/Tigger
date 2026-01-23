# Tigger - Project Management System

## College Project Documentation

---

## Introduction

Tigger is a web-based project tool that's got everything you need. Teams and companies can use it to keep projects, tasks, and teamwork running smoothly. It's simple to use. You can set up projects, create or assign tasks, see how things are moving, and work together with your team as it all happens.

It's no secret that good project skills are a must for getting things done. Old ways based on sheets or doing everything by hand can cause mistakes, eat up time, and leave you in the dark. Tigger fixes all of that, giving everyone one place to keep projects straight, make and handle lots of projects with the details you need.

The app uses today's web tricks and has an easy, quick design that works on phones and computers, with light and dark modes, so it's easy to use for everyone.

---

## Aim

To develop a modern, user-friendly web-based project management system that enables teams to efficiently plan, track, and collaborate on projects in real-time.

---

## Objectives

- Implement secure user authentication and organization-based access control using Clerk
- Enable users to create, update, and manage multiple projects with details like priority, status, and timelines
- Develop a comprehensive task management system with drag-and-drop Kanban board functionality
- Provide task assignment, status tracking (Todo/In Progress/Done), and due date management
- Build an interactive dashboard displaying project statistics, assigned tasks, and overdue items
- Implement a commenting system for team collaboration and communication
- Create a responsive user interface that works seamlessly on desktop and mobile devices
- Support both dark and light theme modes for user accessibility

---

## Scope

- **Project Management**: Create, edit, delete, and track projects with attributes including name, description, priority (Low/Medium/High), status (Planning/Active/Completed/Hold/Inactive/Cancelled), start date, end date, and team members
- **Task Management**: Full CRUD operations for tasks within projects, including task types (Task/Bug/Feature/Improvement/Other), priority levels, assignees, and status workflow
- **Kanban Board**: Visual drag-and-drop interface for managing task status transitions
- **Dashboard Analytics**: Real-time statistics showing total projects, completed projects, personal tasks, and overdue items
- **User Authentication**: Secure login and organization management through Clerk authentication
- **Team Collaboration**: Comment system for task-level discussions and team communication
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Target Users**: Small to medium-sized teams and organizations seeking a centralized project management solution

---

## Design Process

### 1. Requirement Analysis

- Gathered requirements for project and task management features
- Identified user needs for collaboration, tracking, and real-time updates
- Defined target users as small to medium-sized teams

### 2. System Design

- Designed client-server architecture with REST API communication
- Created database schema for projects, tasks, and comments with relationships
- Planned authentication flow using Clerk for secure user management

### 3. UI/UX Design

- Designed responsive layouts for desktop and mobile devices
- Created intuitive navigation with sidebar and dashboard views
- Implemented dark/light theme support for accessibility
- Designed Kanban board interface for visual task management

### 4. Development

- Built frontend using React with Vite for fast development
- Implemented backend API with Express.js and PostgreSQL database
- Integrated Clerk authentication for secure login and organization management
- Developed drag-and-drop functionality for Kanban board

### 5. Testing & Deployment

- Tested all CRUD operations for projects, tasks, and comments
- Verified responsive design across different screen sizes
- Validated authentication and authorization flows

---

## Functional Requirements

### User Authentication

- Users can sign up, log in, and log out securely
- Users can create and manage organizations
- Users can switch between different workspaces

### Project Management

- Users can create new projects with name, description, priority, and dates
- Users can view all projects in their organization
- Users can edit project details including status and team members
- Users can delete projects (with cascading task deletion)
- Users can assign a project manager to each project

### Task Management

- Users can create tasks within a project
- Users can set task type (Task/Bug/Feature/Improvement/Other)
- Users can set task priority (Low/Medium/High)
- Users can assign tasks to team members
- Users can set due dates for tasks
- Users can update task status via Kanban board drag-and-drop
- Users can edit and delete tasks

### Dashboard

- Users can view total projects and completed projects count
- Users can view tasks assigned to them
- Users can view overdue tasks requiring attention
- Users can see recent project activities and progress

### Collaboration

- Users can add comments on tasks
- Users can view comments from team members
- Users can delete their own comments

### User Interface

- System displays responsive layout on all devices
- System supports dark and light theme modes
- System shows loading states during data fetching
- System displays success/error notifications for user actions

---

## Author

**Abhishek Adhikari**

---

_This documentation was created for academic purposes as part of a college project submission._
