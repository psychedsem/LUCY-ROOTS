import styles from './PageCard.module.css';

function PageCard({ children, className = '', ...props }) {
  return (
    <article className={`${styles.card} ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}

export default PageCard;
