import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { motion } from 'framer-motion'; // Importer Framer Motion
import logoImage from '../Images/im.png'; // Ajuster le chemin si nécessaire
import backgroundImage from '../Images/L1.jpg'; // Ajuster le chemin si nécessaire
import usdLogo from '../Images/usd.png';
import eurLogo from '../Images/eur.png';
import madLogo from '../Images/mad.png';

const HolidayCalendar = () => {
    const [year, setYear] = useState(2024);
    const [currencies] = useState(['USD', 'EUR', 'MAD']);
    const [holidays, setHolidays] = useState([]);
    const [filteredHolidays, setFilteredHolidays] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('MAD');
    const [hoveredHoliday, setHoveredHoliday] = useState({ description: '', month: null });

    useEffect(() => {
        axios.get('http://localhost:8080/api/jours/getAll')
            .then(response => {
                const holidaysData = response.data.map(holiday => ({
                    date: new Date(holiday.jourFerie),
                    currency: holiday.devise,
                    description: holiday.description
                }));
                setHolidays(holidaysData);
                console.log('Fetched holidays data:', holidaysData);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    useEffect(() => {
        const filterHolidaysByCurrency = () => {
            const holidayMap = {};
            currencies.forEach(currency => {
                holidayMap[currency] = holidays.filter(holiday => holiday.currency === currency);
            });
            setFilteredHolidays(holidayMap);
        };

        filterHolidaysByCurrency();
    }, [holidays, currencies]);

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const getCurrencyLogo = (currency) => {
        switch (currency) {
            case 'USD':
                return usdLogo;
            case 'EUR':
                return eurLogo;
            case 'MAD':
                return madLogo;
            default:
                return null;
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isHoliday = filteredHolidays[selectedCurrency]?.some(holiday =>
                holiday.date.getFullYear() === date.getFullYear() &&
                holiday.date.getMonth() === date.getMonth() &&
                holiday.date.getDate() === date.getDate()
            );
            if (isHoliday) {
                return 'holiday';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const holiday = filteredHolidays[selectedCurrency]?.find(holiday =>
                holiday.date.getFullYear() === date.getFullYear() &&
                holiday.date.getMonth() === date.getMonth() &&
                holiday.date.getDate() === date.getDate()
            );

            if (holiday) {
                return (
                    <div
                        onMouseEnter={() => handleMouseEnter(holiday.description, date.getMonth())}
                        onMouseLeave={handleMouseLeave}
                        style={styles.tooltipTarget}
                    >
                        <img src={getCurrencyLogo(selectedCurrency)} alt="Holiday" style={styles.icon} />
                    </div>
                );
            }
        }
        return null;
    };

    const handleMouseEnter = (description, month) => {
        setHoveredHoliday({ description, month });
    };

    const handleMouseLeave = () => {
        setHoveredHoliday({ description: '', month: null });
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.navbarBrand}>
                    <img src={logoImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                </div>
                <div style={styles.navbarMenu}>
                    <button style={styles.navbarLink} onClick={() => window.location.href = '/calendrier'}>Home</button>
                    <button style={styles.navbarLink} onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}>Logout</button>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.selectors}>
                    <label style={styles.selectorLabel}>
                        Select Year:
                        <select value={year} onChange={e => setYear(Number(e.target.value))} style={styles.selector}>
                            {Array.from({ length: 1000 }, (_, i) => i + 2024).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </label>
                    <label style={styles.selectorLabel}>
                        Select Currency:
                        <select value={selectedCurrency} onChange={handleCurrencyChange} style={styles.selector}>
                            {currencies.map((currency, index) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div style={styles.calendarsContainer}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <motion.div
                            key={i}
                            style={styles.calendarWrapper}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h2>
                                {hoveredHoliday.month === i && hoveredHoliday.description
                                    ? hoveredHoliday.description
                                    : `${selectedCurrency} Calendar - ${new Date(year, i).toLocaleString('default', { month: 'long' })}`}
                            </h2>
                            <Calendar
                                view="month"
                                activeStartDate={new Date(year, i, 1)}
                                tileClassName={tileClassName}
                                tileContent={tileContent}
                                style={styles.calendar}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        fontFamily: 'Arial, Helvetica, sans-serif',
        lineHeight: '1.125em',
        position: 'relative',
    },
    navbar: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
        marginLeft: '10px',
    },
    container: {
        maxWidth: '1200px',
        margin: 'auto',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
    },
    selectors: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    selectorLabel: {
        marginRight: '20px',
        fontSize: '16px',
    },
    selector: {
        marginLeft: '10px',
    },
    calendarsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    calendarWrapper: {
        flex: '1 1 30%',
        margin: '10px',
    },
    calendar: {
        width: '100%',
        height: 'auto',
    },
    tooltipTarget: {
        cursor: 'pointer',
    },
    icon: {
        width: '20px',
        height: '20px',
    },
};

export default HolidayCalendar;
