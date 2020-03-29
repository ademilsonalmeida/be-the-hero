import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiPower, FiTrash2} from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

function Profile() {
    const history = useHistory();

    const [incidents, setIncidents] = useState([]);

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        try {            
            fetchData();            
        } catch (error) {
            alert('Erro ao carregar os incidentes, tente novamente.')
        }
    }, [ongId]);

    async function fetchData() {
        const response = await api.get('profile', {            
            headers: {
                Authorization: ongId
            }
        });
        
        setIncidents(response.data);
    }

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            });

            fetchData();
        } catch (error) {
            alert('Erro ao deletar o incidente, tente novamente.');
        }
    }

    function handleLogout() {
        localStorage.removeItem('ongId');
        localStorage.removeItem('ongName');

        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem vindo(a), {ongName}</span>

                <Link className="button" to="/incidents/new">
                    Cadastrar novo caso
                </Link>
                <button 
                    type="button"
                    onClick={handleLogout}>
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {
                    incidents.map(incident => {
                        return (
                            <li key={incident.id}>
                                <strong>CASO:</strong>
                                <p>{incident.title}</p>

                                <strong>DESCRIÇÃO:</strong>
                                <p>{incident.description}</p>

                                <strong>VALOR:</strong>
                                <p>{Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(incident.value)}</p>

                                <button 
                                    type="button" 
                                    onClick={() => handleDeleteIncident(incident.id)}>
                                    <FiTrash2 size={20} color="#a8a8b3" />
                                </button>
                            </li>      
                        )
                    })
                }         
            </ul>
        </div>
    );
}

export default Profile;