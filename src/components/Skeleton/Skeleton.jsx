function Skeleton({ className }) {
  return <div className={`skeleton-pulse${className ? ` ${className}` : ''}`} />;
}

export default Skeleton;
