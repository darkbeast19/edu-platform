export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-[#1a1a25] border border-[var(--border-subtle)] rounded-md ${className}`}
      {...props}
    />
  );
}
