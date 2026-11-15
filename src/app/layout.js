import "./globals.css";

export const metadata = {
  title: "MediCore — Hospital OPS",
  description: "MediCore Hospital OPS dashboard: patients, beds, doctors, appointments and emergency alerts at a glance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
