import React, { useCallback } from "react";

import classes from './ContentTable.module.css';

function ContentTable(props) {
    const columns = props.columns;
    const data = props.data;

    const itemToRow = useCallback((item) => {
        const res = [];
        let elem;
        let counter = 0;
        for(const field in item) {
            const dataOfField = item[field];
            if(dataOfField instanceof Array) {
                elem = dataOfField.length === 0
                        ? ''
                        : dataOfField.reduce((acc, curr) => acc + ', ' + curr);
            }
            else {
                elem = dataOfField;
            }
            res.push(<td key={counter++}>{elem}</td>);
        }
        return res;
    }, []);

    return (
        <table className={`table ${classes['content-table']}`}>
            <thead>
                <tr>
                    {columns.map((column, index) => <th key={index}>{column}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => <tr key={index}>{itemToRow(item)}</tr>)}
            </tbody>
        </table>
    );
}

export default ContentTable;