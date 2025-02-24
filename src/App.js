import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import RegistrationForm from './pages/RegistrationForm';
import Calendrier from "./pages/calendrier";
import UserProfile from "./pages/Profil";
import ChangePassword from "./pages/ChangePassword";
import HolidayCalendar from './pages/HolidayCalendar';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [events, setEvents] = useState([]);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/calendrier" element={<Calendrier isLoggedIn={isLoggedIn} setEvents={setEvents} />} />
                <Route path="/profil" element={<UserProfile isLoggedIn={isLoggedIn} onLogout={logout} />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/" element={<Login />} /> {/* Default route */}
                <Route path="/holidays" element={<HolidayCalendar holidays={events} />} />
            </Routes>
        </Router>
    );
};
export default App;