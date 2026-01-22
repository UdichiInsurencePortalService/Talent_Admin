import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  ScheduleOutlined 
} from '@ant-design/icons';
import { Button, Layout, Menu, Grid } from 'antd';
import { Exams } from '../../Pages/Exams/Exams';
import { useNavigate } from 'react-router-dom';
import api from '../../Authentication/api'; // axios instance with withCredentials: true
import Dashboard from '../../Pages/Dashboard/Dashboard';
import Candidates from '../../Pages/Candidates/Candidates';
import Scheduled from '../../Pages/Scheduled/Scheduled';
import QuestionBank from '../../Pages/QuestionBank/QuestionBank';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

function formatDateTime(d) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

export default function Admin() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState('dashboard');
  const [user, setUser] = useState(null); // authenticated user
  const [loadingAuth, setLoadingAuth] = useState(true);
  const screens = useBreakpoint();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!screens.lg) setCollapsed(true);
  }, [screens.lg]);

  // ---------- PROTECTION: verify auth on mount ----------
  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        setLoadingAuth(true);
        const res = await api.get('auth/me'); // expects { user: {...} }
        if (!mounted) return;
        setUser(res.data.user || null);
        setLoadingAuth(false);
      } catch (err) {
        // not authenticated -> go to login
        setLoadingAuth(false);
        navigate('/login', { replace: true });
      }
    }
    checkAuth();
    return () => { mounted = false; };
  }, [navigate]);

  // ---------- Logout ----------
  const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {}

  // ✅ clear auth flag
  localStorage.removeItem("isAdminLoggedIn");

  navigate("/login", { replace: true });
};


  // keep original theme & UI
  const theme = {
    bg: '#f0f4f8',
    sider: '#07223b',
    header: 'linear-gradient(90deg,#0f3b66,#123a5a)',
    accent: '#2ecc71',
    primary: '#2f6fb2',
    card: '#ffffff',
    soft: '#e8f4f8',
    textDark: '#1a202c',
    textMuted: '#718096',
    cardBorder: '#e2e8f0',
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'exam', icon: <VideoCameraOutlined />, label: 'Exam' },
    { key: 'scheduled', icon: <ScheduleOutlined />, label: 'Scheduled Exam' },

    { key: 'candidates', icon: <UserOutlined />, label: 'Candidates' },
    { key: 'question', icon: <FileTextOutlined />, label: 'Question Bank' },
    { key: 'stats', icon: <LineChartOutlined />, label: 'Statistics' },
    { key: 'support', icon: <QuestionCircleOutlined />, label: 'Help & Support' },
  ];

  // ---------- Renderers (same as your existing design) ----------
  function renderDashboard() {
    return (
    <Dashboard/>
    );
  }

  function renderExam() {
    return (<Exams />);
  }

   function renderCandidates() {
    return (<Candidates/>);
  }

   function renderQuestions() {
    return (<QuestionBank/>);
  }

  function renderScheduled() {
    return (<Scheduled/>);
  }

  // function renderOtherPages() {

  //   return (

     
  //   );
  // }

  // while auth check in progress, show nothing (or spinner)
  if (loadingAuth) {
    return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Checking authentication...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: "'Poppins', Inter, system-ui, -apple-system, 'Segoe UI', Roboto", background: theme.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        body{margin:0;padding:0}
      `}</style>

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={(c) => setCollapsed(c)}
        width={260}
        style={{ background: theme.sider, height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, overflowY: 'auto', zIndex: 100 }}
      >
        <div style={{ height: 76, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>TA</div>
            {!collapsed && <div style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: '0.3px' }}>Talent Assess</div>}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selected]}
          onClick={(e) => setSelected(e.key)}
          items={menuItems}
          style={{ background: 'transparent', borderRight: 'none', color: 'white', padding: '12px 8px', marginTop: 8 }}
          className="ta-side-menu"
        />

        <div style={{ padding: 18, color: '#9fb3d6', fontSize: 13, marginTop: 'auto' }}>
          {!collapsed && <div>Signed in as: <strong style={{color:'white'}}>{user?.name || user?.email}</strong></div>}
        </div>

        <style>{`
          .ta-side-menu .ant-menu-item{border-left:4px solid transparent;transition:all .2s ease;padding-left:20px!important;height:50px;display:flex;align-items:center;margin:4px 0;border-radius:0 10px 10px 0;font-weight:500;font-size:14px;}
          .ta-side-menu .ant-menu-item:hover{background:rgba(46,204,113,0.08)!important;border-left-color:${theme.accent}!important;color:white!important;}
          .ta-side-menu .ant-menu-item-selected{background:linear-gradient(90deg,rgba(46,204,113,0.12),rgba(46,204,113,0.04))!important;border-left-color:${theme.accent}!important;color:white!important;font-weight:600;}
          .ta-side-menu .anticon{font-size:18px}
        `}</style>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left .2s ease' }}>
        <Header style={{ padding: '10px 24px', background: theme.header, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)} 
              style={{ fontSize: 18, width: 48, height: 48, borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }} 
            />
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>Administration</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <div style={{ textAlign: 'right', color: 'white' }}>
              <div style={{ fontSize: 13, color: '#cfe9d6', fontWeight: 500 }}>{formatDateTime(now)}</div>
              <div style={{ fontSize: 12, color: '#cfe9d6', opacity: 0.9 }}>{user?.email}</div>
            </div>

            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: 'white' }}>
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{ margin: 24, padding: 28, minHeight: 'calc(100vh - 120px)', background: theme.bg, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {selected === 'dashboard' && renderDashboard()}
          {selected === 'exam' && renderExam()}
          {selected === 'candidates' && renderCandidates()}
          {selected === 'question' && renderQuestions()}
            {selected === 'scheduled' && renderScheduled()}



          {/* {selected !== 'dashboard' && selected !== 'exam' && renderOtherPages()} */}

          <style>{`
            @media (max-width:1024px){ .ant-layout-sider{position:fixed!important} }
            @media (max-width:768px){ .ant-layout-content{margin:16px!important;padding:20px!important} }
          `}</style>
        </Content>
      </Layout>
    </Layout>
  );
}
