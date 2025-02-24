import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImagee from '../Images/l2.jpg';
import logoImage from '../Images/im.png';

const UserProfile = () => {


    const [formData, setFormData] = useState({
        id: '',
        username: '',
        nom: '',
        prenom: '',
        email: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch user data from the backend
                const response = await axios.get('/userProfile');
                const user = response.data;

                // Update formData with the user data
                setFormData({
                    id: user.id,
                    username: user.username,
                    nom: user.lastName,
                    prenom: user.firstName,
                    email: user.email,
                });
            } catch (error) {
                console.error('Erreur lors de la récupération du profil utilisateur', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleResetPassword = () => {
        console.log('Demande de réinitialisation du mot de passe');
    };

    const handleCancel = () => {
        console.log('Mise à jour annulée');
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.post('/userProfile', formData);
            console.log('Informations utilisateur mises à jour', response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil', error);
        }
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.navbarBrand}>
                    <img src={logoImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                </div>
                <div style={styles.navbarMenu}>
                    <button style={{...styles.navbarLink, marginRight: '20px'}}
                            onClick={() => window.location.href = '/calendrier'}>Home
                    </button>
                    <button style={{...styles.navbarLink, marginRight: '20px'}}
                            onClick={() => window.location.href = '/profil'}>Profil</button>
                    <button style={styles.navbarLink}
                            onClick={() => window.location.href = '/login'}>Logout</button>
                </div>
            </nav>
            <div style={styles.container}>
                <h2 style={styles.header}>Détails Personnels</h2>
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label>Username :</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label>Nom</label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label>Gestion du mot de passe</label>
                    <button onClick={handleResetPassword} style={styles.resetButton}
                            onClick={() => window.location.href = '/changepassword'}
                    >Réinitialiser le mot de passe</button>
                </div>
                <div style={styles.buttonGroup}>
                    <button onClick={handleCancel} style={styles.cancelButton}
                            onClick={() => window.location.href = '/calendrier'}
                    >Annuler</button>
                    <button onClick={handleUpdate} style={styles.updateButton}>Mettre à jour</button>
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
        margin: '20px auto',
        width: '90%',
        maxWidth: '1200px',
        textAlign: 'left',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    formRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    formGroup: {
        flex: '1',
        marginRight: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    telephoneInput: {
        display: 'flex',
        alignItems: 'center',
    },
    flagIcon: {
        marginRight: '10px',
    },
    resetButton: {
        backgroundColor: '#ff7f50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
        marginLeft: '10px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    cancelButton: {
        backgroundColor: '#f0ad4e',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
        marginRight: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
    },
    updateButton: {
        backgroundColor: '#5cb85c',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
    },
};

export default UserProfile;
