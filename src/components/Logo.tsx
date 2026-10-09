import logo from "../assets/lilmed-logo.png";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="LilMed"
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}

export function LilMedWordmark({ className = "" }: { className?: string }) {
  // Wordmark matched to the LILMED logo: rounded bold sans (Nunito 900),
  // tight tracking, using the exact logo palette — leaf green -> sky blue -> deep blue.
  return (
    <span
      className={`leading-[0.85] ${className}`}
      style={{
        fontFamily: "'Nunito', system-ui, sans-serif",
        fontWeight: 900,
        letterSpacing: "-0.035em",
        background:
          "linear-gradient(92deg, #8FC74A 0%, #97CA49 28%, #3DADE2 62%, #578FC4 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        textShadow: "0 2px 24px rgba(11,58,111,0.28)",
      }}
    >
      LilMed
    </span>
  );
}

