import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../Images/l2.jpg';
import iconImage from '../Images/icon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Style definitions
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

const Card = styled.div`
    background-color: rgba(29, 42, 86, 0.9);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h2`
    color: #ffffff;
    margin-bottom: 20px;
`;

const Subtitle = styled.p`
    color: #ffffff;
    margin-bottom: 20px;
`;

const InputWrapper = styled.div`
    margin-bottom: 20px;
    text-align: left;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: rgba(242, 103, 34, 0.3);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
        background-color: rgba(226, 88, 27, 0.3);
    }
`;

const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 10px;
`;

const Icon = styled.img`
    width: 50px;
    height: 50px;
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegisterRedirect = () => {
        navigate('/registration');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Login successful');
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                setTimeout(() => navigate('/calendrier'), 1500); // Redirect after a short delay
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Card>
                <Icon src={iconImage} alt="icon" />
                <Title>Login</Title>
                <Subtitle>Please enter your Login and your Password</Subtitle>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <form onSubmit={handleSubmit}>
                    <InputWrapper>
                        <label htmlFor="username" style={{ color: '#ffffff' }}>Username</label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <label htmlFor="password" style={{ color: '#ffffff' }}>Password</label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Subtitle>Don't have an account? <button onClick={handleRegisterRedirect}>Register here</button></Subtitle>
                    </InputWrapper>
                    <Button type="submit">Sign in</Button>
                </form>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default Login;
