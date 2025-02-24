import React, { useState, useEffect } from 'react';
import backgroundImagee from '../Images/l2.jpg';
import logoImage from '../Images/im.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format } from 'date-fns';
import { FaMoon, FaSun } from 'react-icons/fa';
import usdLogo from '../Images/usd.png';
import eurLogo from '../Images/eur.png';
import madLogo from '../Images/mad.png';
import {useNavigate} from "react-router-dom";

const ITEMS_PER_PAGE = 14;
const CURRENCY_CODES = ['USD', 'EUR', 'MAD'];

const currencyLogos = {
    'USD': usdLogo,
    'EUR': eurLogo,
    'MAD': madLogo,
};



const Calendrier = ({ isLoggedIn }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/calendrier');
        }
    }, [isLoggedIn, navigate]);
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [newHoliday, setNewHoliday] = useState({
        devise: '',
        jourFerie: null,
        description: '',
    });
    const [darkMode, setDarkMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/jours/getAll');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };
    const handleNavigateToCalendar = () => {
        navigate('/holidays');
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/jours/delete/${id}`);
            setEvents(events.filter(event => event.id !== id));
        } catch (error) {
            console.error('Error deleting holiday:', error);
        }
    };

    const handleAddHoliday = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (newHoliday.devise && newHoliday.jourFerie && newHoliday.description) {
            const formattedHoliday = {
                ...newHoliday,
                jourFerie: format(newHoliday.jourFerie, 'yyyy-MM-dd'),
                user: { id: 30 }
            };

            console.log('Formatted Holiday:', formattedHoliday);

            if (!isDateUnavailable(newHoliday.devise, newHoliday.jourFerie)) {
                try {
                    const response = await axios.post('http://localhost:8080/api/jours/add', formattedHoliday);
                    const savedHoliday = response.data;
                    setEvents([...events, savedHoliday]);
                    setNewHoliday({ devise: '', jourFerie: null, description: '' });
                    setSuccessMessage('Jour férié ajouté avec succès!');
                } catch (error) {
                    console.error('Error adding holiday:', error);
                    setErrorMessage(`Erreur lors de l'ajout du jour férié: ${error.response ? error.response.data : error.message}`);
                }
            } else {
                setErrorMessage('La date sélectionnée pour cette devise est déjà utilisée.');
            }
        } else {
            setErrorMessage('Veuillez remplir tous les champs avant d\'ajouter un nouveau jour férié.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewHoliday({ ...newHoliday, [name]: value });
    };

    const handleDateChange = (date) => {
        setNewHoliday({ ...newHoliday, jourFerie: date });
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const getFilteredEvents = () => {
        let filteredEvents = events;
        if (searchTerm.trim() !== '') {
            filteredEvents = filteredEvents.filter(event => event.devise.toLowerCase().startsWith(searchTerm.toLowerCase()));
        }
        if (selectedYear) {
            filteredEvents = filteredEvents.filter(event => new Date(event.jourFerie).getFullYear() === parseInt(selectedYear));
        }
        return filteredEvents;
    };

    const getPaginatedEvents = () => {
        const filteredEvents = getFilteredEvents();
        const sortedEvents = filteredEvents.sort((a, b) => new Date(a.jourFerie) - new Date(b.jourFerie));
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return sortedEvents.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(getFilteredEvents().length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const isDateUnavailable = (devise, jourFerie) => {
        return events.some(event => event.devise === devise && new Date(event.jourFerie).toDateString() === jourFerie.toDateString());
    };

    const unavailableDates = (devise) => {
        return events.filter(event => event.devise === devise).map(event => new Date(event.jourFerie));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div style={darkMode ? styles.pageDark : styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.navbarBrand}>
                    <img src={logoImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                </div>
                <div style={styles.navbarMenu}>
                    <button style={styles.navbarLink} onClick={handleNavigateToCalendar}>Calendar</button>
                    <button style={styles.navbarLink} onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div style={darkMode ? styles.containerDark : styles.container}>
            <h2 style={{ ...styles.header, textAlign: 'center' }}>Gestion Des Jours Fériés</h2>
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <select
                        name="devise"
                        value={newHoliday.devise}
                        onChange={handleChange}
                        style={darkMode ? { ...styles.input, backgroundColor: '#333', color: '#fff' } : styles.input}
                    >
                        <option value="">Devise</option>
                        {CURRENCY_CODES.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                    <div style={styles.datePickerContainer}>
                        <DatePicker
                            selected={newHoliday.jourFerie}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Jour férié"
                            showYearDropdown
                            yearDropdownItemNumber={15}
                            scrollableYearDropdown
                            filterDate={(date) =>
                                !unavailableDates(newHoliday.devise).some(unavailableDate =>
                                    date.toDateString() === unavailableDate.toDateString()
                                )
                            }
                            className={darkMode ? 'date-picker-input-dark' : 'date-picker-input'}
                            showMonthDropdown
                            dropdownMode="select"
                        />
                    </div>
                    <input
                        type="text"
                        name="description"
                        value={newHoliday.description}
                        placeholder="Description"
                        onChange={handleChange}
                        style={darkMode ? { ...styles.input, backgroundColor: '#333', color: '#fff' } : { ...styles.input, marginLeft: '10px' }}
                    />
                    <button style={darkMode ? { ...styles.addButton, backgroundColor: '#007bff' } : styles.addButton} onClick={handleAddHoliday}>Ajouter Jour Férié</button>
                </div>
                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
                <div style={{marginBottom: '10px', textAlign: 'center'}}>
                    <input
                        type="text"
                        placeholder="Rechercher par devise"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={darkMode ? {...styles.input, backgroundColor: '#333', color: '#fff'} : styles.input}

                    /><select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={darkMode ? {...styles.input, backgroundColor: '#333', color: '#fff'} : styles.input}
                >
                    {Array.from({length: 20}, (_, index) => {
                        const year = new Date().getFullYear() + index;
                        return (
                            <option key={year} value={year}>{year}</option>
                        );
                    })}
                </select>
                    <button
                        onClick={() => toggleDarkMode()}
                        style={darkMode ? {
                            ...styles.toggleButton,
                            backgroundColor: '#333',
                            color: '#fff'
                        } : styles.toggleButton}
                    >
                        {darkMode ? <FaSun/> : <FaMoon/>}
                    </button>

                </div>



                <table style={darkMode ? { ...styles.table, backgroundColor: '#333', color: '#fff' } : styles.table}>
                    <thead>
                    <tr>
                        <th></th> {/* Laissez cette cellule vide */}
                        <th>Devise</th>
                        <th>Jour Férié</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getPaginatedEvents().map((calendrier) => (
                        <tr key={calendrier.id}>
                            <td>
                                <img src={currencyLogos[calendrier.devise]} alt={`${calendrier.devise} logo`} style={{ height: '20px', marginRight: '5px' }} />
                            </td>
                            <td>
                                {calendrier.devise}
                            </td>
                            <td>{new Date(calendrier.jourFerie).toLocaleDateString('fr-FR')}</td>
                            <td>{calendrier.description}</td>
                            <td>
                                <button style={darkMode ? { ...styles.deleteButton, backgroundColor: '#f44336' } : styles.deleteButton} onClick={() => handleDelete(calendrier.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            style={index + 1 === currentPage ? { ...styles.paginationButton, backgroundColor: '#007bff', color: '#fff' } : { ...styles.paginationButton, backgroundColor: '#333', color: '#fff' }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundImage: `url(${backgroundImagee})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
    },
    pageDark: {
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#ffffff',
    },
    navbar: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Always the same
        color: '#333',
        padding: '10px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navbarBrand: {
        display: 'flex',
        alignItems: 'center',
    },
    navbarMenu: {
        display: 'flex',
        alignItems: 'center',
    },
    navbarLink: {
        color: '#333',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px',
    },
    containerDark: {
        maxWidth: '900px',
        margin: '0 auto',
        background: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    input: {
        padding: '8px',
        marginRight: '10px',
        fontSize: '16px',
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '4px',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        borderRadius: '4px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        textAlign: 'center',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
    },
    pageButton: {
        padding: '8px 12px',
        margin: '0 5px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '16px',
    },
    datePickerContainer: {
        display: 'inline-block',
        position: 'relative',
    },
    'date-picker-input': {
        padding: '8px',
        fontSize: '16px',
        width: '200px',
    },
    'date-picker-input-dark': {
        padding: '8px',
        fontSize: '16px',
        width: '200px',
        backgroundColor: '#333',
        color: '#fff',
    },
    darkModeToggle: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#fff',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        cursor: 'pointer',
    },
    darkModeIcon: {
        fontSize: '24px',
        color: '#333',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '10px',
    },
    successMessage: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '10px',
    },
    searchButton: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '4px',
        marginLeft: '10px',  // Adjust margin-left for spacing
    },
};

export default Calendrier;
