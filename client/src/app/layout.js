import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import AuthSessionProvider from '../components/AuthSessionProvider';
import Header from '../components/layout/Header';

export const metadata = {
  title: 'Career Guide AI — Your Personal AI Career Mentor',
  description: 'Discover your perfect career path with AI-powered guidance. Get personalized recommendations, roadmaps, cost estimates, and mentoring.',
  keywords: 'career guidance, AI career counselor, career test, career roadmap, JEE, NEET, UPSC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
      </head>
      <body>
        <ThemeProvider>
          <AuthSessionProvider>
            <AuthProvider>
              <Header />
              <main>{children}</main>
            </AuthProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
