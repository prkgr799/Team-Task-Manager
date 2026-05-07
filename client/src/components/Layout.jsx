import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, User as UserIcon, Bell, Settings, Search, Menu, X, Users } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={22} /> },
  ];

  // Add Team link for Admins
  if (user?.role === 'Admin') {
    navItems.push({ name: 'Team', path: '/team', icon: <Users size={22} /> });
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          zIndex: 100, 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'var(--gradient-primary)', 
          color: 'white', 
          display: windowWidth > 1024 ? 'none' : 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          border: 'none'
        }}
        className="mobile-toggle"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '280px', backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 60 }}>
        <div style={{ padding: '2.5rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--gradient-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>T</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>TaskFlow</h2>
        </div>

        <div style={{ flex: 1, padding: '0 1rem' }}>
          <p style={{ padding: '0 1rem 0.75rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Main Menu</p>
          <nav>
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={closeMobileMenu}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '14px', 
                  marginBottom: '0.5rem',
                  backgroundColor: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: location.pathname === item.path ? 'var(--primary-light)' : 'var(--text-muted)',
                  fontWeight: location.pathname === item.path ? '700' : '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: location.pathname === item.path ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '2rem', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <UserIcon size={24} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: '700', textTransform: 'uppercase' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', height: '48px', gap: '0.75rem' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="header" style={{ height: '80px', padding: '0 3rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', position: 'sticky', top: 0, zIndex: 40, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px', display: windowWidth < 768 ? 'none' : 'block' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search tasks, projects..." 
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.625rem 1rem 0.625rem 2.75rem', color: 'white', fontSize: '0.875rem' }} 
            />
          </div>
          
          <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
            <Bell size={20} />
          </button>
          <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
            <Settings size={20} />
          </button>
        </header>

        <main style={{ flex: 1, padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
          {children}
        </main>
      </div>
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 55 }}
        ></div>
      )}
    </div>
  );
};

export default Layout;
