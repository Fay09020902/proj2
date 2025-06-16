import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // Map isAdmin to role name
  const userRole = currentUser.isAdmin ? 'HR' : 'Employee';

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
