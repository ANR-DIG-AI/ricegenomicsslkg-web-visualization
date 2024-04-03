import '../notice/Notice.css';

import {Container} from 'react-bootstrap';
import SearchForm from './SearchForm';
import Footer from '../Footer';
import NavBar from '../NavBar';

/**
 * Entry point of the search page
 *
 * @return {JSX.Element}
 * @constructor
 */
function Search() {
    return (
        <Container fluid="lg">
            <NavBar/>
            <SearchForm/>
            <Footer/>
        </Container>
    );
}

export default Search;
