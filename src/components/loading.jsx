export default function Loading({ className = "" }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      <div className="text-xl">Loading...</div>
    </div>
  );
}
