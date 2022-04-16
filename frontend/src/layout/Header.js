import classes from './Header.module.css';

function Header() {
    return (
        <header className={classes.header}>
            <div className={classes['header-left']}>Header Left</div>
            <div className={classes['header-right']}>Header Right</div>
        </header>
    );
}

export default Header;