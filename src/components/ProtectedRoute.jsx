// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}
