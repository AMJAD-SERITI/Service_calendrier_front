import React, { useState } from 'react';
import backgroundImage from '../Images/l2.jpg';
import logoImage from '../Images/im.png';

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        repeterMotDePasse: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Demande de changement de mot de passe', passwordData);
    };

    return (
        <div style={styles.page}>
            <NavBar />
            <div style={styles.container}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={styles.header}>CHANGER MOT DE PASSE</h2>
                    <FormGroup
                        label="Ancien Mot de Passe"
                        name="ancienMotDePasse"
                        placeholder="Entrer Ancien Mot de Passe"
                        value={passwordData.ancienMotDePasse}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Nouveau Mot de Passe"
                        name="nouveauMotDePasse"
                        placeholder="Entrer Nouveau Mot de Passe"
                        value={passwordData.nouveauMotDePasse}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Répéter Mot de Passe"
                        name="repeterMotDePasse"
                        placeholder="Répéter Mot de Passe"
                        value={passwordData.repeterMotDePasse}
                        onChange={handleChange}
                    />
                    <button type="submit" style={styles.submitButton}>Enregistrer</button>
                </form>
            </div>
        </div>
    );
};

const NavBar = () => (
    <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>
            <img src={logoImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        </div>
        <div style={styles.navbarMenu}>
            <button style={{ ...styles.navbarLink, marginRight: '20px' }}
                    onClick={() => window.location.href = '/calendrier'}>Home
            </button>
            <button style={{ ...styles.navbarLink, marginRight: '20px' }}
                    onClick={() => window.location.href = '/profil'}
            >Profil
            </button>

            <button style={styles.navbarLink}
                    onClick={() => window.location.href = '/login'}
            >Logout</button>
        </div>
    </nav>
);

const FormGroup = ({ label, name, placeholder, value, onChange }) => (
    <div style={styles.formGroup}>
        <label style={{ ...styles.label, fontWeight: 'bold' }}>{label}</label>
        <input
            type="password"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={styles.input}
        />
    </div>
);

const styles = {
    page: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    navbar: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: '#333',
        padding: '10px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    navbarBrand: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navbarMenu: {
        display: 'flex',
        alignItems: 'center',
    },
    navbarLink: {
        background: 'none',
        border: 'none',
        color: '#333',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Arrière-plan transparent pour le formulaire
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
        fontWeight: 'bold', // Mise à jour pour le texte en gras
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    submitButton: {
        width: '100%',
        padding: '10px 0',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default ChangePassword;
