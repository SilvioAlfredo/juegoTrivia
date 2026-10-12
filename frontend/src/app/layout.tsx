import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TriviaESC",
  description: "Juego de trivia educativo: CPU, RAM, GPU y almacenamiento",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            TriviaESC
          </Link>
          <nav className="site-nav">
            <Link href="/tabla">Tabla general</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <p>&copy; Riveros Silvio A. — Cliente Next.js + API Flask</p>
        </footer>
      </body>
    </html>
  );
}
