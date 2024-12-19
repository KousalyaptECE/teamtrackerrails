import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import { CookiesProvider} from 'react-cookie'
import NewProject from './components/NewProject';
import ProjectTasks from './components/ProjectTasks';
import MainLayout from './components/MainLayout'; 
import Label from './components/Label'
import TaskDetails from './components/TaskDetails';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />
//   },
//   {
//     path: "/login",
//     element: <Login/>
//   },
//   {
//     path:"/register",
//     element: <Register/>
//   },
//   {
//     path:"/projects/new",
//     element: <NewProject/>
//   },
//   {
//     path:"/projects/:id/tasks",
//     element: <ProjectTasks/>
//   }
// ])

const router = createBrowserRouter([
  {
    path: "/", 
    element: <MainLayout />, 
    children: [
      {
        index: true, 
        element: <App />
      },
      {
        path: "projects/new",
        element: <NewProject />
      },
      {
        path: "projects/:id/tasks",
        element: <ProjectTasks />
      },
      {
        path: "/projects/:id/labels",
        element: <Label />
      },
      {
        path: "/projects/:projectId/tasks/:taskId",
        element: <TaskDetails />
      }
    ]
  },
  {
    path: "/login", 
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/'}}>
      <RouterProvider router={router} />
    </CookiesProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
