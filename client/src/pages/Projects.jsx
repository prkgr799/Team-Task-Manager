import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, Users, ChevronRight, LayoutGrid, List as ListIcon, Calendar, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data.filter(u => u._id !== user._id));
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const toggleMember = (memberId) => {
    setNewProject(prev => {
      const isSelected = prev.members.includes(memberId);
      return {
        ...prev,
        members: isSelected 
          ? prev.members.filter(id => id !== memberId) 
          : [...prev.members, memberId]
      };
    });
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>{user?.role === 'Admin' ? 'Oversee and manage all active initiatives' : 'Initiatives you are currently contributing to'}</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> Create Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Folder size={24} />
                </div>
                <span className={`badge ${project.status === 'Active' ? 'badge-success' : 'badge-primary'}`}>{project.status}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{project.name}</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '4.5rem' }}>
                {project.description || 'Focus on delivering high-quality results for this initiative.'}
              </p>
            </div>
            
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '600' }}>
                  <Users size={16} />
                  <span>{project.members?.length || 0} Members</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '600' }}>
                  <Calendar size={16} />
                  <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <ChevronRight size={18} color="var(--primary)" />
            </div>
          </Link>
        ))}
        
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: '20px' }}>
            <Folder size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <h3>No projects found</h3>
            <p>Ready to start something new?</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '580px', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Launch New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Project Identity</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. Phoenix Dashboard" required />
              </div>
              <div className="input-group">
                <label>Mission & Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="What are the key objectives of this project?" rows="3"></textarea>
              </div>
              
              <div className="input-group">
                <label>Add Team Members ({newProject.members.length} selected)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  {users.map(u => (
                    <div 
                      key={u._id} 
                      onClick={() => toggleMember(u._id)}
                      style={{ 
                        padding: '0.5rem 0.75rem', 
                        borderRadius: '8px', 
                        border: '1px solid',
                        borderColor: newProject.members.includes(u._id) ? 'var(--primary)' : 'var(--border)',
                        background: newProject.members.includes(u._id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.8125rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.role}</p>
                      </div>
                      {newProject.members.includes(u._id) && <Check size={14} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Launch Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
