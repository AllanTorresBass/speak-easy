import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sql } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // For now, we'll use a mock user until database is set up
          // In production, this would query the database
          const mockUser = {
            id: '1',
            email: 'demo@speakeasy.com',
            name: 'Demo User',
            avatarUrl: null,
            nativeLanguage: 'en',
            targetLanguage: 'en',
            proficiencyLevel: 'intermediate' as const,
          };

          // Mock password check (in production, check against database)
          if (credentials.email === 'demo@speakeasy.com' && credentials.password === 'demo123') {
            return mockUser;
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nativeLanguage = user.nativeLanguage;
        token.targetLanguage = user.targetLanguage;
        token.proficiencyLevel = user.proficiencyLevel;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nativeLanguage = token.nativeLanguage as string;
        session.user.targetLanguage = token.targetLanguage as string;
        session.user.proficiencyLevel = token.proficiencyLevel as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 