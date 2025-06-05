import React, { createContext, useContext, useState, useEffect } from 'react';
const API = 'http://localhost:8000/api';
const ClassesContext = createContext();

export function ClassesProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/classes/`);
      if (!res.ok) throw new Error('Failed to fetch classes');
      const data = await res.json();
      setClasses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addClass = async () => {
    if (!newName.trim() || !newCode.trim()) return;
    
    try {
      const res = await fetch(`${API}/classes/`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, code: newCode }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      
      const created = await res.json();
      setClasses(prev => [...prev, created]);
      setNewName('');
      setNewCode('');
      return true;
    } catch (e) {
      console.error('addClass error:', e);
      alert('Failed to create class: ' + e.message);
      return false;
    }
  };

  return (
    <ClassesContext.Provider
      value={{ 
        classes, 
        newName, 
        setNewName, 
        newCode, 
        setNewCode, 
        addClass, 
        loading,
        error,
        refreshClasses: fetchClasses
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}

export const useClasses = () => useContext(ClassesContext);
