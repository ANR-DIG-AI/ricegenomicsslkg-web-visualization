import { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo_d2kab from "../images/logo_d2kab.png";
import { Link } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <Navbar bg="" variant="">
        <Navbar.Brand href=""></Navbar.Brand>
        <img
          className="mt-4 me-5"
          id="logo_d2kab"
          src={logo_d2kab}
          alt="D2KAB"
        ></img>
        <div className="mt-4 me-0 col-sm-8">
          <div className="title">Rice Genomics SLKG</div>
          <div>
            Search interface for the{" "}
            <a href="https://github.com/Wimmics/RiceGenomicsSLKG">
              Rice Genomics Scientific Literature Knowledge Graph
            </a>
            .
          </div>
        </div>
        <Nav className="mr-auto flex-column">
          <Nav.Item>
            <Link to="/search">Search</Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
