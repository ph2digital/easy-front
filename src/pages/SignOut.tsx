// src/pages/SignOut.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';

const SignOut: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      dispatch(clearUser());
      navigate('/login');
    };
    signOut();
  }, [dispatch, navigate]);

  return <div>Signing out...</div>;
};

export default SignOut;
