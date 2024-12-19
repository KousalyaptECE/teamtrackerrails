import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../apis/logoutApi';

function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([]); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.jwt) {
      const fetchProjects = async () => {
        try {
          const headers = { Authorization: `${cookies.jwt}` };
          const response = await axios.get('/projects', { headers });

          if (response.data) {
            const createdProjects = Array.isArray(response.data.projects_created)
              ? response.data.projects_created.map((project) => ({
                  id: project.id,
                  title: project.title,
                  type: 'created',
                }))
              : [];

            const memberProjects = Array.isArray(response.data.projects_as_member)
              ? response.data.projects_as_member.map((project) => ({
                  id: project.id,
                  title: project.title,
                  type: 'member',
                }))
              : [];

            setProjects([...createdProjects, ...memberProjects]);
          }
        } catch (error) {
          setError('Failed to load projects. Please try again later.');
        }
      };

      fetchProjects();
    }
  }, [cookies.jwt]);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleProjectsDropdown = () => {
    setIsProjectsOpen(!isProjectsOpen); 
  };

  const handleLogout = async () => {
    const [result, error] = await logoutApi(cookies.jwt);
    if (error !== '') {
        removeCookie('jwt');
        navigate('/login');
    } else {
        removeCookie('jwt');
        navigate('/login');
    }
    };

  return (
    <nav className="bg-gray-50 text-black p-2 border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <div className="text-xl font-semibold">
            <Link to="/">Team Tracker</Link>
          </div>
          <Link to="/all_task" className="hover:text-indigo-400">All Tasks</Link>

           <div className="relative">
            <button onClick={toggleProjectsDropdown} className="hover:text-indigo-400">
              My Projects
            </button>
            {isProjectsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 max-h-60 overflow-y-auto hide-scrollbar">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}/tasks`}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      {project.title}
                    </Link>
                  ))
                ) : (
                  <div className="block px-4 py-2 text-sm text-gray-800">No Projects Available</div>
                )}
              </div>
            )}
          </div>
          
          <Link to="/projects_reports" className="hover:text-indigo-400">Report</Link>
          <Link to="/messages" className="hover:text-indigo-400">Team Wall</Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Link to="/notifications" className="hover:text-indigo-400">Notifications</Link>
          </div>

          <div className="relative">
            <button onClick={toggleProfileDropdown} className="flex items-center">
              <span className="ml-2">{cookies.user?.name || 'User'}</span>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
