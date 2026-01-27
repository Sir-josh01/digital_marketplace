import { Navigate } from 'react-router';

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    // If not admin, kick them back to a login page or home
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

export default ProtectedRoute;