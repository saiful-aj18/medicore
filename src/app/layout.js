import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "MediCare — Hospital OPS",
  description: "MediCare Hospital OPS dashboard: patients, beds, doctors, appointments and emergency alerts at a glance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
