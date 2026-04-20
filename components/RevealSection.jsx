"use client";

const RevealSection = ({ children, delay = 0, className = "" }) => {
  return (
    <div
      className={`motion-section ${className}`.trim()}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealSection;
