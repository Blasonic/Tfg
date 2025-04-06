import React from 'react';
import './Footer.css';
import IzquierdaFooter from '../IzquierdaFooter/IzquierdaFooter';
import CentroFooter from '../CentroFooter/CentroFooter';
import DerechaFooter from '../DerechaFooter/DerechaFooter';
function Footer() {
    return (
        <footer className="footer">
            <IzquierdaFooter />
            <CentroFooter />
            <DerechaFooter />


        </footer>
    );
}

export default Footer;