import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RedirectHome = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    } else if (isAdmin) {
      navigate('/hr/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  return null;
};

export default RedirectHome;
