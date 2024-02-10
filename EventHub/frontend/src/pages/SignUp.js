import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../actions/userActions';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleType] = useState("attendee");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister)
  const { error, userInfo } = userRegister;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await dispatch(register(name, email, password, role));
      toast.success('Registration successfully')
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`)
    }
  }

  useEffect(() => {
    if (userInfo) {
      const storedUserType = userInfo.role;

      if (storedUserType === 'organiser') {
        navigate('/employee-dashboard');
      }
      else if (storedUserType === 'attendee') {
        navigate('/employee-dashboard');
      }
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-darkerSecondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border">
          <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className="block w-full rounded-md border py-2 text-gray-900 shadow-sm focus:outline-none  focus:border-secondary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div >
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border py-2 text-gray-900 shadow-sm focus:outline-none  focus:border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border py-2 text-gray-900 shadow-sm focus:outline-none focus:border-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="userType" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Role
              </label>
              <select
                id="userType"
                name="userType"
                className="block w-full rounded-md border py-2 text-gray-900 shadow-sm focus:outline-none focus:border-secondary"
                value={role}
                onChange={(e) => setRoleType(e.target.value)}
              >
                <option value="organiser">Organiser</option>
                <option value="attendee">Attendee</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-2 rounded-md shadow-sm hover:bg-darkerSecondary focus:outline-none focus:ring focus:secondary"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
