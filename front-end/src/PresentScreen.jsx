// src/PresentScreen.jsx
import React from 'react';
import { useStudents } from './StudentsContext';

export default function PresentScreen() {
  const { students, presentIds } = useStudents();
  const present = students.filter(s => presentIds.includes(s.id));

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Present Students</h2>
      {present.length === 0 ? (
        <p>No students marked present yet.</p>
      ) : (
        present.map(s => (
          <div key={s.id} className="flex items-center mb-2">
            {s.photoUrls[0] && (
              <img
                src={`http://localhost:8000${s.photoUrls[0]}`}
                alt={s.name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span>{s.name}</span>
          </div>
        ))
      )}
    </div>
  );
}
