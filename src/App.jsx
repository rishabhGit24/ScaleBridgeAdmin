import { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            setIsAuthenticated(true);
            setAdminUser(authData);
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setAdminUser(userData);
        localStorage.setItem('adminAuth', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAdminUser(null);
        localStorage.removeItem('adminAuth');
    };

    return (
        <div className="app">
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard adminUser={adminUser} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
