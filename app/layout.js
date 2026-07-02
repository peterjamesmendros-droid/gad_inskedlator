import "./globals.css"; // or wherever your Tailwind styles are located

export const metadata = {
  title: "GAD INSKEDLATOR",
  description: "Secure Room Allocation Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}