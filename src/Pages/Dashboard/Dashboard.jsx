import React from 'react'
import {

  VideoCameraOutlined,
  DashboardOutlined,
  LineChartOutlined,
 
} from '@ant-design/icons';

const Dashboard = () => {
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
  return (
    <div className="dashboard-root">
           <div className="cards-grid">
             <div className="card">
               <div className="card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                 <DashboardOutlined style={{ fontSize: 28, color: 'white' }} />
               </div>
               <div className="card-content">
                 <div className="card-label">Total Candidates</div>
                 <div className="card-value">0</div>
                 <div className="card-change positive">+12% from last month</div>
               </div>
             </div>
   
             <div className="card">
               <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                 <VideoCameraOutlined style={{ fontSize: 28, color: 'white' }} />
               </div>
               <div className="card-content">
                 <div className="card-label">Assessments Today</div>
                 <div className="card-value">0</div>
                 <div className="card-change positive">+3 from yesterday</div>
               </div>
             </div>
   
             <div className="card">
               <div className="card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                 <LineChartOutlined style={{ fontSize: 28, color: 'white' }} />
               </div>
               <div className="card-content">
                 <div className="card-label">Completed</div>
                 <div className="card-value">0</div>
                 <div className="card-change positive">+8% completion rate</div>
               </div>
             </div>
           </div>
   
           <div className="main-grid">
             <div className="panel wide">
               <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 700, color: theme.textDark }}>Overview</h3>
               <p className="muted" style={{ margin: '0 0 20px 0', fontSize: 14 }}>Charts, live widgets and tables go here. Add charts or tables as needed.</p>
               <div className="placeholder">(Chart area)</div>
             </div>
   
             <div className="panel side">
               <h4 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 700, color: theme.textDark }}>Recent Activity</h4>
               <ul className="activity-list">
                 <li>
                   <div className="activity-dot"></div>
                   <div>Candidate A completed assessment</div>
                 </li>
                 <li>
                   <div className="activity-dot"></div>
                   <div>Report for Assessment X generated</div>
                 </li>
                 <li>
                   <div className="activity-dot"></div>
                   <div>New job posted: Frontend Developer</div>
                 </li>
               </ul>
             </div>
           </div>
   
           <style>{`
             .dashboard-root{display:flex;flex-direction:column;gap:24px}
             .cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:8px}
             .card{background:${theme.card};border-radius:16px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02);border:1px solid ${theme.cardBorder};display:flex;align-items:center;gap:20px;transition:all 0.3s ease;cursor:pointer;}
             .card:hover{box-shadow:0 10px 20px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);transform:translateY(-4px);}
             .card-icon{width:64px;height:64px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.15);}
             .card-content{display:flex;flex-direction:column;gap:4px;flex:1;}
             .card-label{font-size:13px;font-weight:600;color:${theme.textMuted};text-transform:uppercase;letter-spacing:0.5px;}
             .card-value{font-size:32px;font-weight:800;color:${theme.textDark};line-height:1.2;}
             .card-change{font-size:12px;font-weight:600;margin-top:4px;}
             .card-change.positive{color:#10b981}
             .card-change.negative{color:#ef4444}
             .main-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}
             .panel{background:${theme.card};border-radius:16px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02);border:1px solid ${theme.cardBorder};}
             .panel.wide{min-height:380px}
             .panel.side{min-height:380px}
             .muted{color:${theme.textMuted};line-height:1.6}
             .placeholder{height:240px;border-radius:12px;background:linear-gradient(135deg,#f6f8fb 0%,#e9ecef 100%);display:flex;align-items:center;justify-content:center;color:${theme.textMuted};font-weight:600;font-size:15px;border:2px dashed ${theme.cardBorder};}
             .activity-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px;}
             .activity-list li{display:flex;align-items:flex-start;gap:12px;padding:12px;background:${theme.soft};border-radius:10px;font-size:14px;color:${theme.textDark};font-weight:500;transition:all 0.2s;}
             .activity-list li:hover{background:#dae8f5;transform:translateX(4px);}
             .activity-dot{width:8px;height:8px;border-radius:50%;background:${theme.accent};margin-top:6px;flex-shrink:0;}
             @media (max-width:1200px){.cards-grid{grid-template-columns:repeat(2,1fr)}.main-grid{grid-template-columns:1fr}}
             @media (max-width:768px){.cards-grid{grid-template-columns:1fr}.card{flex-direction:column;text-align:center;padding:20px}.card-icon{margin:0 auto}}
           `}</style>
         </div>
  )
}

export default Dashboard