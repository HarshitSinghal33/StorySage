import React from 'react'
import styles from './Loader.module.css'

export default function Loader({ Loaderheight }) {
    // LoaderHeight is props I pass to set the height of loader beacuse in full page it need almost full height while in loading some story it need only some height an di set it in inline styles.
    return (
        <div className={styles.StyledLoader}
            style={{ height: Loaderheight ? `${Loaderheight}` : '80vh' }}
        >
            <div className={styles.LdsSpinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
