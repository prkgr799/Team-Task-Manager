import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle2, Clock, ListTodo, User as UserIcon, Calendar, Filter, MoreVertical, Flag } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get('/users')
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to fetch project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  if (loading) return <div>Loading project details...</div>;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className="badge badge-primary">Project</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Created on {new Date(project?.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '1rem' }}>{project?.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>{project?.description || 'No description provided for this project.'}</p>
          </div>
          {user?.role === 'Admin' && (
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
              <Plus size={18} /> New Task
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)' }}>VIEWING:</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>ALL TASKS ({tasks.length})</span>
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Task Details</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assignee</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.5rem' }} data-label="Task Details">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{task.title}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{task.description}</span>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }} data-label="Status">
                  <span className={`badge ${task.status === 'Completed' ? 'badge-success' : task.status === 'In Progress' ? 'badge-warning' : 'badge-primary'}`}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }} data-label="Priority">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: task.priority === 'High' ? 'var(--error)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--primary)' }}>
                    <Flag size={14} fill={task.priority === 'High' ? 'var(--error)' : 'transparent'} />
                    {task.priority}
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }} data-label="Assignee">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                      {task.assignedTo?.name.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }} data-label="Actions">
                  {(user?.role === 'Admin' || task.assignedTo?._id === user?._id) ? (
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: 'auto', width: 'auto' }}
                    >
                      <option value="Todo">Set Todo</option>
                      <option value="In Progress">Set In Progress</option>
                      <option value="Completed">Set Completed</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View Only</span>
                  )}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '5rem', textAlign: 'center' }}>
                  <ListTodo size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No tasks found for this project.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Design the system architecture" required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Briefly describe the task requirements..." rows="3"></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Assignee</label>
                  <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} required>
                    <option value="">Choose a member</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Target Deadline</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
