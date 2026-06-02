import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './components/Button';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [students, setStudents] = useState([]);
  const [matriculation, setMatriculation] = useState('');
  const [name, setName] = useState('');
  const [inClass, setInClass] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveStudent = async () => {
    if (!matriculation.trim() || !name.trim()) {
      return alert("Matriculation and Name are required!");
    }

    try {
      const res = await axios.post(`${API_URL}/students`, {
        matriculation: matriculation.trim(),
        name: name.trim(),
        present: inClass
      });

      setStudents([...students, res.data]);
      setMatriculation('');
      setName('');
      setInClass(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save student");
    }
  };

const togglePresence = async (id) => {
  // Find current student
  const student = students.find(s => s.id === id);
  if (!student) return;

  const newPresent = !student.present;

  try {
    await axios.put(`${API_URL}/students/${id}`, { 
      present: newPresent 
    });

    // Update UI
    setStudents(students.map(s => 
      s.id === id ? { ...s, present: newPresent } : s
    ));
  } catch (err) {
    console.error(err);
    alert("Failed to update presence in database");
  }
};

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-600">ClassList App</h1>
          <div className="flex gap-3">
            <Button color="#0061FF" text="add" onClick={saveStudent} />
            <Button color="#0061FF" text="delete" onClick={() => alert("Select a student")} />
            <Button color="#0061FF" text="cancel" onClick={() => {setMatriculation(''); setName(''); setInClass(false);}} />
          </div>
        </div>

        {/* Add Student Form */}
        <div className="p-6 border-b bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Matriculation</label>
              <input
                type="text"
                value={matriculation}
                onChange={(e) => setMatriculation(e.target.value)}
                placeholder="CT23A143"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="EpieB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={inClass}
                onChange={(e) => setInClass(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-gray-700">In Class</label>
            </div>

            <button
              onClick={saveStudent}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg transition"
            >
              Save Student
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="p-6 space-y-3">
          {loading ? <p className="text-center py-10">Loading...</p> : 
           students.length === 0 ? <p className="text-center text-gray-500 py-10">No students yet</p> :
           students.map((student) => (
            <div
              key={student.id}
              className={`p-5 rounded-xl border-l-4 flex justify-between items-center
                ${student.present ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={student.present}
                  onChange={() => togglePresence(student.id)}
                  className="w-6 h-6 accent-green-600 cursor-pointer"
                />
                <div>
                  <p className="font-semibold">{student.matriculation} {student.name}</p>
                  <p className="text-green-600 text-sm">
                    status: {student.present ? '0.9' : '0.4'} %
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteStudent(student.id)}
                className="text-red-600 text-3xl hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="text-center py-4 text-sm text-gray-500 border-t">
          CEC430 academic year 2025/2026
        </div>
      </div>
    </div>
  );
}

export default App;