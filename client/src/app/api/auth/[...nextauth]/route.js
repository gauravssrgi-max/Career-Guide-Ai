import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub Login
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    // Email/Password Login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Demo user for testing
        if (credentials.email === 'demo@careerguide.ai' && credentials.password === 'demo123456') {
          return { id: 'demo-1', name: 'Demo User', email: 'demo@careerguide.ai', image: null };
        }
        // In production, verify against your database here
        if (credentials.email && credentials.password?.length >= 6) {
          return { id: Date.now().toString(), name: credentials.email.split('@')[0], email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'career-guide-ai-secret-2024',
});

export { handler as GET, handler as POST };
