import React from "react";

import Header from "./Header";

import classes from './Layout.module.css';

function Layout(props) {
    return (
        <React.Fragment>
            <Header></Header>
            <main className={classes.main}>
                {props.children}
            </main>
        </React.Fragment>
    );
}

export default Layout;