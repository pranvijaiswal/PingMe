const AuthImagePattern = ({ title, subtitle }) => {
  
  const bgColors = ["#3b82f6", "#ec4899", "#6b7280"]; // blue-500, green-500, amber-500

  return (
    <>
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border-2 border-primary"
                style={{
                  animation: "colorPulse 3s infinite ease-in-out",
                  backgroundColor: bgColors[i % 3],
                  animationDelay: `${i * 0.2}s`, 
                }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>

     
      <style>{`
        @keyframes colorPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
};

export default AuthImagePattern;
