import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Projects = () => {
  const [projects, setProjects] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [cookies] = useCookies(['jwt']); 

  useEffect(() => {
    const headers = {
      Authorization: `${cookies.jwt}` 
    };

    axios
      .get('/projects', { headers })
      .then((response) => {
        console.log(response)
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
      
            const allProjects = [...createdProjects, ...memberProjects];
        
            setProjects(allProjects);
                    
        } else {
          console.error('Invalid response format', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, [cookies.jwt]); 

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
    <div className="flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-1/4 px-4">
        <div className="bg-gray-50 shadow-md p-4">
          <div className="text-lg font-bold text-gray-800 mb-2">Activities</div>
          <div className="text-gray-500">No recent activities</div>
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="w-full lg:w-1/4 px-4">
        <div className="bg-gray-50 shadow-md p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="text-lg font-bold text-gray-800">Your Projects</div>
            <Link to="/projects/new">
              <button
                type="button"
                className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
                id="Newproject"
              >
                New Project
              </button>
            </Link>
          </div>
          <div className="my-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-0">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="py-1 border-b last:border-b-0 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  <Link
                    to={`/projects/${project.id}/tasks`}
                    className="text-blue-500 hover:underline"
                  >
                    {project.title}
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No projects found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Projects;
