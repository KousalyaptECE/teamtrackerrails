import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const NewProject = () => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 

  useEffect(() => {
    if (!cookies.jwt) {
      navigate('/login');
    }
  }, [cookies.jwt, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `${cookies.jwt}`,
          },
        });
        setUsers(response.data); 
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [cookies.jwt]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleMembersChange = (e) => {
    const value = e.target.value;
    setMembers(value);

    if (value.length > 0) {
      setFilteredUsers(users.filter(user => user.email.toLowerCase().startsWith(value.toLowerCase())));
      setIsDropdownVisible(true);
    } else {
      setFilteredUsers([]);
      setIsDropdownVisible(false);
    }
  };

  const handleMemberSelect = (email) => {
    setMembers(email);
    setIsDropdownVisible(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !members) {
      setError('Please fill in all fields');
      return;
    }

    const newProjectData = {
      project: {
        title,
        description,
        member_emails: members.split(',').map((email) => email.trim()),
      },
    };

    try {
      const response = await axios.post('/projects', newProjectData, {
        headers: {
          Authorization: `${cookies.jwt}`,
        },
      });
      navigate(`/projects/${response.data.id}/tasks`);
    } catch (error) {
      setError('Error creating project. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Project</h2>
        <p className="text-gray-600 mb-6">
          A repository contains all the files for your project, including the revision history.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter project name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description 
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter project description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="members" className="block text-gray-700 font-medium mb-2">
              Members (comma-separated emails)
            </label>
            <input
              type="text"
              id="members"
              value={members}
              onChange={handleMembersChange}
              placeholder="Enter member emails"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            {isDropdownVisible && filteredUsers.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded-md bg-white shadow-md max-h-48 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMemberSelect(user.email)}
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600"
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
