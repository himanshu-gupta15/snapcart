'use client';

import { AppDispatch } from '@/redux/store';
import { setUserData } from '@/redux/userSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function UserGetMe() {
  const dispatch=useDispatch<AppDispatch>()
  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await axios.get('/api/me');
        dispatch(setUserData(res.data))
      } catch (error) {
        console.error('GetMe error:', error);
      }
    };

    getMe();
  }, []);

  return null; // 👈 better than empty div
}
