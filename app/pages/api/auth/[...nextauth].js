import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email", placeholder: "mail" },
      password: { label: "Password", type: "password" }
    },
      async authorize(credentials, req) {
        try {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          });

          const data = await response.json();
          console.log('Respons dari server credentials:', data);

          if (response.ok && data.token) {
            console.log('Token JWT yang dihasilkan:', data.token);

            return {
              id: data.data.userId,
              email: data.data.email,
              username: data.data.username,
              namaLengkap: data.data.namaLengkap,
              alamat: data.data.alamat,
              role: data.data.role
            };
          } else {
            throw new Error('Gagal melakukan autentikasi');
          }
        } catch (error) {
          throw new Error('Gagal melakukan autentikasi');
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.namaLengkap = user.namaLengkap;
        token.alamat = user.alamat;
        token.role = user.role;
      }
      console.log('Data user yang diterima:', token);
      return token;
    },
    async session(session, token) {
      // if(user){
      //   session.user = token.user;
      // }
      
      session.user = token?.token?.token.user;

      console.log('Session user setelah diatur:', session);
      return session;
    },
  },
  session: {
    jwt: true,
  },
};

export default NextAuth(options);
