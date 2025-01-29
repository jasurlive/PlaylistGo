import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import './css/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-icons">
                    <a href="https://t.me/jasurjacob_bot" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTelegram} />
                    </a>
                    <a href="https://wa.me/+447775180677" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faWhatsapp} />
                    </a>
                    <a href="https://jasurlive.uz" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faCommentDots} />
                    </a>
                    <a href="mailto:jasur@graduate.org" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                </div>
                <p>&copy; 2023{currentYear > 2023 ? `-${currentYear}` : ''} <a href='https://jasurlive.uz'>jasurlive.uz</a> | All rights reserved ©</p>
            </div>
        </footer>
    );
};

export default Footer;
