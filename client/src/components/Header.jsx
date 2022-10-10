import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import reactLogo from "../assets/react.svg";

const Header = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={reactLogo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Online Execute Command
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
