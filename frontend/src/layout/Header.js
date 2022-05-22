import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { authActions } from '../store/auth-slice';
import classes from './Header.module.css';

function Header({menus}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutClickHandler = (e) => {
        e.preventDefault();

        dispatch(authActions.logout());
        navigate({
            pathname: '/login'
        });
    }

    return (
        <header className={classes.header}>
            <div className={classes['header-left']}>
                {menus.map(menu => {
                    return (
                        <NavLink key={menu.link} className={classes['navbar-link']}
                                 to={menu.link}>{menu.title}
                        </NavLink>
                );
                })}
                <NavLink className={classes['navbar-link']}
                         to='../login' onClick={logoutClickHandler}>Logout</NavLink>
            </div>
            <div className={classes['header-right']}>
                <h1 className={classes['header-title']}>School Simplifier</h1>
            </div>
        </header>
    );
}

export default Header;