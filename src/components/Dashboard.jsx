import { useEffect, useState } from 'react';
import API_URL from '../config';
import './Dashboard.css';

const Dashboard = ({ adminUser, onLogout }) => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/contacts`);
            const data = await response.json();

            if (data.success) {
                setContacts(data.data);
            } else {
                setError(data.message || 'Failed to fetch contacts');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">ScaleBridge Admin</h1>
                    <div className="header-actions">
                        <span className="admin-name">Welcome, {adminUser?.username}</span>
                        <button onClick={onLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="controls-bar">
                    <div className="stats">
                        <h2>Contact Submissions</h2>
                        <p className="count">{contacts.length} total entries</p>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, email, company, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={fetchContacts} className="refresh-btn">
                        Refresh
                    </button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                {isLoading ? (
                    <div className="loading">Loading contacts...</div>
                ) : (
                    <div className="contacts-grid">
                        {filteredContacts.length === 0 ? (
                            <div className="no-data">No contacts found</div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <div key={contact._id} className="contact-card">
                                    <div className="card-header">
                                        <h3 className="contact-name">{contact.name}</h3>
                                        <span className={`status-badge ${contact.status}`}>
                                            {contact.status}
                                        </span>
                                    </div>

                                    <div className="card-body">
                                        {contact.company && (
                                            <div className="contact-field">
                                                <span className="field-label">Company:</span>
                                                <span className="field-value">{contact.company}</span>
                                            </div>
                                        )}

                                        <div className="contact-field">
                                            <span className="field-label">Email:</span>
                                            <span className="field-value">{contact.email}</span>
                                        </div>

                                        <div className="contact-field">
                                            <span className="field-label">Phone:</span>
                                            <span className="field-value">{contact.phone}</span>
                                        </div>

                                        {contact.message && (
                                            <div className="contact-field message-field">
                                                <span className="field-label">Message:</span>
                                                <p className="field-value message-text">{contact.message}</p>
                                            </div>
                                        )}

                                        <div className="contact-field">
                                            <span className="field-label">Submitted:</span>
                                            <span className="field-value date-value">
                                                {formatDate(contact.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
