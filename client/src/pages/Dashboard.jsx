import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle2, Clock, ListTodo, AlertCircle, TrendingUp, Users, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/stats/summary');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: <ListTodo size={24} />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { label: 'Completed', value: stats.completedTasks, icon: <CheckCircle2 size={24} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'In Progress', value: stats.inProgressTasks, icon: <Clock size={24} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Overdue', value: stats.overdueTasks, icon: <AlertCircle size={24} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="animate-pulse" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Loading your dashboard...</div>
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hello, {user?.name.split(' ')[0]}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {user?.role === 'Admin' ? 'Management Overview' : 'Personal Task Tracking'}
          </p>
        </div>
        <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '600' }}>
            <TrendingUp size={18} />
            <span>On track</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Tasks completion up 12%</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((card, index) => (
          <div key={index} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{card.label}</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Project Progress</h3>
            <FolderKanban size={20} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'Todo', val: stats.todoTasks, color: 'var(--primary)', percentage: (stats.todoTasks / (stats.totalTasks || 1)) * 100 },
              { label: 'In Progress', val: stats.inProgressTasks, color: 'var(--warning)', percentage: (stats.inProgressTasks / (stats.totalTasks || 1)) * 100 },
              { label: 'Completed', val: stats.completedTasks, color: 'var(--success)', percentage: (stats.completedTasks / (stats.totalTasks || 1)) * 100 }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.val} tasks</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.percentage}%`, backgroundColor: item.color, borderRadius: '10px', transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
            <Users size={32} color="white" />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Team Collaboration</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '280px' }}>
            {user?.role === 'Admin' 
              ? 'You have full control over project assignments and team monitoring.' 
              : 'Focus on your assigned tasks and keep your status updated for the team.'}
          </p>
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pro Tip</p>
            <p style={{ fontSize: '0.875rem' }}>Complete tasks before the due date to boost your team score!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
