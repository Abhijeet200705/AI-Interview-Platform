import { useAuth } from '../context/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 600, margin: '60px auto' }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
      <p>Preferred Job Role: {user?.preferredJobRole || 'Not set'}</p>
      <p>Experience: {user?.experience || 'Not set'}</p>
      <p>Skills: {user?.skills?.length ? user.skills.join(', ') : 'None added'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;