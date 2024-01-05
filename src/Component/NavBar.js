import {Component} from "react";
import {Navbar, Nav} from "react-bootstrap";
import logo_d2kab from '../images/logo_d2kab.png';
import {Link} from "react-router-dom";


class NavBar extends Component {

    render() {
        return (
            <Navbar bg="" variant="">
                <Navbar.Brand href=""></Navbar.Brand>
                <img className="mt-4 me-5" id="logo_d2kab" src={logo_d2kab} alt="D2KAB"></img>
                <div className="mt-4 me-0 col-sm-6">
                    <div className="title">Wheat Genomics SLKG</div>
                    <div>Visualization interface for the <b>Wheat Genomics Scientific Literature Knowledge Graph</b></div>
                    <div>Developed by the <a href="https://www.d2kab.org/">D2KAB</a> project.</div>
                </div>
                <Nav className="mr-auto flex-column">
                    <Nav.Item>
                        <Link to="/search">Search</Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}

export default NavBar;
