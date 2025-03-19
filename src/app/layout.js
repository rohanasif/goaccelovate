import "./globals.css";

export const metadata = {
  title: "Accelevate TODO Task",
  description: "A simple TODO task app built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
