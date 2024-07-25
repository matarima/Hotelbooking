import React, { useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import '../../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        axios.post('/auth/login', { username, password })
            .then((response) => {
                console.log('Response from server:', response.data);

                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);

                    axios.get('/auth/user', {
                        headers: {
                            'Authorization': `Bearer ${response.data.token}`
                        }
                    }).then(userResponse => {
                        loginUser(userResponse.data.user);
                        localStorage.setItem('username', userResponse.data.user.username);
                        navigate('/');
                    }).catch(userError => {
                        console.error('Error fetching user data:', userError);
                        setError('Login failed. Unable to fetch user data.');
                    });
                } else {
                    setError('Login failed. Invalid response from server.');
                }
            })
            .catch((err) => {
                console.error('Login error:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Login failed. Please try again.');
                }
            });
    };

    return (
        <div className="auth-form">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;