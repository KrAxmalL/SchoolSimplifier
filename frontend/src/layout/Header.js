import classes from './Header.module.css';

function Header() {
    return (
        <header className={classes.header}>
            <div className={classes['header-left']}>
                <div>
                    <span></span>
                    <h2>Menu</h2>
                </div>
            </div>
            <div className={classes['header-right']}>
                <h1 className={classes['header-title']}>School Simplifier</h1>
            </div>
        </header>
    );
}

export default Header;