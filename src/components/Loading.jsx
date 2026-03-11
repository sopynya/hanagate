import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle}>
        <div className={styles.half}></div>
      </div>
    </div>
  );
}