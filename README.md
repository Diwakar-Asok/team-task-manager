# Trackify

Trackify is a modern team-based project and task management system built using **React 19 + TypeScript + Vite**.  
It includes role-based access (Admin & Member), project creation, task assignment, board view, team management, and local persistence — all wrapped in a clean, intuitive UI.

This project showcases real-world frontend architecture using modern React patterns, Redux Toolkit, Tailwind CSS styling, and a fully responsive dashboard.

---

## Features

### **Role-Based Access**
- **Admin**: Can create projects, manage team members, and assign roles.  
- **Member**: Can view assigned projects and create/assign tasks.  
- Conditional UI rendering based on permissions (Admin-only actions hidden for Members).

### **Project Management**
- Create, update, and delete projects  
- View project details, task statistics, and contributors  
- Clean dashboard with key metrics (Total Projects, Tasks, In-Progress, Completed)

### **Task Management**
- Add tasks under projects  
- Assign tasks to any team member  
- Update task status (To Do → In Progress → Done)  
- View tasks inside each project or in kanban board style  

### **Kanban Board**
- Drag-and-drop task movement (To Do, In Progress, Done)  
- Visual workflow to track team progress  
- Each task shows its assignee + project tag  

### **Team Management**
- Add team members with name & email  
- Assign roles (Admin / Member)  
- Remove members  
- Clear breakdown of role permissions  

### **Local Persistence**
- All data (users, projects, tasks, roles) is stored using **localStorage**  
- Data persists across refresh  
- Ideal for interviews, demos, and offline usage  

### **Clean & Modern UI**
- Fully responsive layout  
- Sidebar navigation  
- Dashboard cards  
- Custom Trackify branding and icon  
- Tailwind CSS-based design system  

---

## Tech Stack

| Category | Technology |
|---------|------------|
| UI Framework | **React 19 + TypeScript + Vite** |
| Styling | **Tailwind CSS** |
| State Management | **Redux Toolkit (RTK)** |
| Routing | **React Router 7** |
| Form Handling | React hooks (useState / controlled forms) |
| Persistence | LocalStorage |
| Icons | Lucide / Custom SVGs |
| Deployment | **Vercel** |
