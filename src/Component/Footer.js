import React from 'react';
import './Footer.css';

import logo_inria from '../images/logo_inria.png'
import logo_uca from '../images/logo_uca.png'
import logo_cnrs from '../images/logo_cnrs.png'

const Footer = () => (
    <div className="panelFooter">
        <div className="footer-wrap">
            <div className="widgetFooter">
                <span className="text-muted">D2KAB project links</span>
                <ul id="footerUsefulLink">
                    <li>
                        <a href="https://www.d2kab.org/">Project website</a>
                    </li>
                    <li>
                        <a href="mailto:d2kab-contact@lirmm.fr">Contact</a>
                    </li>
                </ul>
            </div>

            <div className="">
                <div className="widgetFooter">
                    <img src={logo_inria} width={90} alt="Inria" />
                </div>
                <div className="widgetFooter">
                    <img src={logo_uca} width={60} alt="UCA" />
                </div>
                <div className="widgetFooter">
                    <img src={logo_cnrs} width={45} alt="CNRS" />
                </div>
            </div>
        </div>
    </div>
);

export default Footer;
