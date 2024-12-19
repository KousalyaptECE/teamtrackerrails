import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const LabelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['jwt']);
  const [newLabelColor, setNewLabelColor] = useState('#FFFFFF');

  useEffect(() => {
    const jwtToken = cookies.jwt;

    if (!jwtToken) {
      console.error('No JWT token found.');
      return;
    }

    const headers = { Authorization: `${jwtToken}` };

    const fetchLabels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/labels`, { headers });
        setLabels(response.data);
      } catch (error) {
        console.error('Error fetching labels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [id, cookies.jwt]);

  const handleAddLabel = async (e) => {
    e.preventDefault();

    const jwtToken = cookies.jwt;
    if (!jwtToken) {
      console.error('No JWT token found.');
      return;
    }

    const headers = { Authorization: `${jwtToken}` };

    try {
      const response = await axios.post(
        `http://localhost:3000/labels`,
        { name: newLabel, color: newLabelColor },
        { headers }
      );
      setLabels([...labels, response.data]);
      setNewLabel('');
      setNewLabelColor('#FFFFFF');
    } catch (error) {
      console.error('Error adding label:', error);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    const jwtToken = cookies.jwt;
    if (!jwtToken) {
      console.error('No JWT token found.');
      return;
    }

    const headers = { Authorization: `${jwtToken}` };

    try {
      await axios.delete(`http://localhost:3000/labels/${labelId}`, { headers });
      setLabels(labels.filter((label) => label.id !== labelId));
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  const handleGoBack = () => {
    navigate(`/projects/${id}/tasks`);
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold text-gray-600 py-4">Loading labels...</div>;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Labels for Project</h2>

      <button
        onClick={handleGoBack}
        className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
      >
        Go back to Project
      </button>

      <form onSubmit={handleAddLabel} className="mb-4">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Enter new label"
          className="px-4 py-2 border rounded-md w-full mb-2"
          required
        />
        <label>Color</label>
         <input
          type="color"
          value={newLabelColor}
          onChange={(e) => setNewLabelColor(e.target.value)}
          className="px-4 py-2 border rounded-md w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Label
        </button>
      </form>

      {labels.length === 0 ? (
        <div className="text-center text-gray-600">No labels found for this project.</div>
      ) : (
        <ul>
          {labels.map((label) => (
            <li key={label.id} className="flex justify-between items-center py-2 border-b">
              <span
                className="text-lg font-semibold"
                style={{ backgroundColor: label.color, padding: '5px', borderRadius: '5px' }} 
              >
                {label.name}
              </span>
              <button
                onClick={() => handleDeleteLabel(label.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LabelPage;
