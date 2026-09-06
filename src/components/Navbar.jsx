import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/LOGO.png';
import wordmark from '../assets/images/MarkDown.png';
import styles from './Navbar.module.css';

const SCROLL_THRESHOLD = 24;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function getLinkClass({ isActive }) {
    return `${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim();
  }

  return (
    <header
      className={styles.navbar}
      data-scrolled={isScrolled ? 'true' : 'false'}
    >
      <div className={styles.brandLeft} aria-hidden={!isScrolled}>
        <img src={logo} alt="LUCY//ROOTS logo" />
      </div>

      <nav className={styles.navLinks} aria-label="Primary navigation">
        <NavLink to="/" end className={getLinkClass}>
          Home
        </NavLink>
        <NavLink to="/meditate" className={getLinkClass}>
          Meditate
        </NavLink>
        <NavLink to="/learn" className={getLinkClass}>
          Learn
        </NavLink>
      </nav>

      <div className={styles.brandRight} aria-hidden={!isScrolled}>
        <img src={wordmark} alt="LUCY//ROOTS wordmark" />
      </div>
    </header>
  );
}

export default Navbar;
