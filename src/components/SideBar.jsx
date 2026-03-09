import Link from 'next/link'
import styles from './sidebar.module.css'
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <div>
                <h1>Hana gate</h1>
                <p>visual novels</p>

                <nav>
                    <Link href='/'>Visual Novels</Link>
                    <Link href='/characters'>Characters</Link>
                    <Link href='/users'>Users</Link>
                
                    <Link href='/config'>Configurations</Link>
                    <Link href='/random'>Random</Link>
                    <Link href='/login'>Login</Link>
                    <Link href='/register'>Register</Link>
                </nav>
            </div>
            <div>
                <p className={styles.by}>website by sopynya</p>
                <img src='/ad7.jpg'/>
            </div>
            
        </div>
    )
}