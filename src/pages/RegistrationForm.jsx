import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../Images/l2.jpg';
import iconImage from '../Images/icon.png';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 10px;
    min-height: 100vh;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

const Card = styled.div`
    background-color: rgba(29, 42, 86, 0.9);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
    margin-top: 10px;
`;

const Title = styled.h2`
    color: #ffffff;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    color: #ffffff;
    margin-bottom: 10px;
`;

const InputWrapper = styled.div`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Label = styled.label`
    color: #ffffff;
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
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

const StyledLink = styled.a`
    color: #ffffff;
    text-decoration: none;
    display: block;
    margin-top: 10px;
    margin-bottom: 20px;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 10px;
`;

const Icon = styled.img`
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
`;

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/register', formData);
            alert(response.data); // Display success message
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            if (error.response) {
                setError(error.response.data); // Display error message from the server
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <Container>
            <Card>
                <Icon src={iconImage} alt="icon" />
                <Title>Register</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <form onSubmit={handleSubmit}>
                    {['username', 'lastName', 'firstName', 'email', 'password', 'confirmPassword'].map((field, idx) => (
                        <InputWrapper key={idx}>
                            <Label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <Input
                                type={field === 'email' ? 'email' : field.includes('password') ? 'password' : 'text'}
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>
                    ))}
                    <InputWrapper>
                        <input type="checkbox" id="terms" required />
                        <Label htmlFor="terms" style={{ marginLeft: '10px' }}>
                            I Agree To The Terms & Conditions
                        </Label>
                    </InputWrapper>
                    <Button type="submit">Register</Button>
                </form>
                <StyledLink onClick={() => navigate('/login')}>Already a member? Login</StyledLink>
            </Card>
        </Container>
    );
};

export default RegistrationForm;
