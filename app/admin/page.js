import "./globals.css";

export const metadata = {
  title: "GAD Inskedlator",
  description: "Lactation Room & Child-Minding Centre Booking System — DICT MISS-DWAD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif", background: '#f5f4f7', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}