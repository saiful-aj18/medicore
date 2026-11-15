import "./globals.css";

export const metadata = {
  title: "MediCare — Hospital OPS",
  description: "MediCare Hospital OPS dashboard: patients, beds, doctors, appointments and emergency alerts at a glance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
