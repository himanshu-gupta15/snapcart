// import NextAuth from "next-auth"
// import connectDb from "./lib/db"
// import User from "./model/user.model"
// import bcrypt from "bcryptjs"
// import Credentials from "next-auth/providers/credentials"
// import Google from "next-auth/providers/google"


// export const {handlers,signIn, signOut,auth}=NextAuth({
//   providers:[
//     Credentials({
//       credentials:{
//         email:{label:"email",type:"email"},
//         password:{label:"password",type:"password"},
//       },
//       async authorize(credentials,request){
        
//          await connectDb()
//          const email=credentials.email 
//          const password=credentials.password as string
//          const user=await User.findOne({email})
//          if(!user){
//           throw new Error("user does not exist")
//          }
//          const isMatch=await bcrypt.compare(password ,user.password )
//          if(!isMatch){
//           throw new Error("incorrect password")
//          }
//          return {
//           id:user._id.toString(),
//           email:user.email,
//           name:user.name,
//           role:user.role
         
//          }
        
//       },
//     }),

//     Google({
     

//     clientId:process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET
//     })
//   ],

//   callbacks:{

//       async signIn({user,account}){
//         if(account?.provider=="google"){
//         await connectDb()
//         let dbUser=await User.findOne({email:user.email})
//         if(!dbUser){
//           dbUser=await User.create({
//             name:user.name,
//             email:user.email,
//             image:user.image,
//              role: "user" 
//           })
//         }
//         user.id=dbUser._id.toString()
//         user.role=dbUser.role
//         }
//         return true 
//       },                   
//     jwt({token,user,trigger,session}){
//       if(user){
//         token.id=user.id,
//         token.name=user.name,
//         token.email=user.email,
//         token.role=user.role
//       }
//       if(trigger=="update"){
//         token.role=session.role 
//       }
//       return token;
//     },
//     session({session,token}){
//       if(session.user){
//         session.user.id=token.id as string,
//         session.user.name =token.name as string,
//         session.user.email=token.email as string,
//         session.user.role=token.role as string
//       }
//       return session
//     }
//   },
//   pages:{
//     signIn:"/login",
//     error:"/login"
//   },
//   session:{
//     strategy:"jwt",
//     maxAge:10*24*60*60*100
//   },
//   secret:process.env.Auth_SECRET
// })

import NextAuth from "next-auth";
import connectDb from "./lib/db";
import User from "./model/user.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "email", type: "email" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDb();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) throw new Error("User does not exist");

//         const isMatch = await bcrypt.compare(
//           credentials.password as string,
//           user.password
//         );
//         if (!isMatch) throw new Error("Incorrect password");

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role, // ✅ comes from DB
//         };
//       },
//     }),

//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   // callbacks: {
//   //   // ✅ Create user if Google login
//   //   async signIn({ user, account }) {
//   //     if (account?.provider === "google") {
//   //       await connectDb();

//   //       let dbUser = await User.findOne({ email: user.email });

//   //       if (!dbUser) {
//   //         dbUser = await User.create({
//   //           name: user.name,
//   //           email: user.email,
//   //           image: user.image,
//   //           role: "user", // ✅ NEVER trust Google role
//   //         });
//   //       }

//   //       user.id = dbUser._id.toString();
//   //       user.role = dbUser.role;
//   //     }
//   //     return true;
//   //   },

//   //   // 🔥 MOST IMPORTANT FIX
//   //   async jwt({ token }) {
//   //     await connectDb();

//   //     if (token.email) {
//   //       const dbUser = await User.findOne({ email: token.email });

//   //       if (dbUser) {
//   //         token.id = dbUser._id.toString();
//   //         token.role = dbUser.role; // ✅ ALWAYS SYNC FROM DB
//   //       }
//   //     }

//   //     return token;
//   //   },

//   //   async session({ session, token }) {
//   //     if (session.user) {
//   //       session.user.id = token.id as string;
//   //       session.user.role = token.role as string;
//   //     }
//   //     return session;
//   //   },
//   // },
// callbacks: {
//   async signIn({ user, account }) {
//     if (account?.provider === "google") {
//       await connectDb();

//       let dbUser = await User.findOne({ email: user.email });

//       if (!dbUser) {
//         dbUser = await User.create({
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           role: "user",
//         });
//       }

//       user.id = dbUser._id.toString();
//       user.role = dbUser.role;
//     }
//     return true;
//   },

//   async jwt({ token, user }) {
//     // ✅ Only run when user exists (login time)
//     if (user) {
//       token.id = user.id;
//       token.role = (user as any).role;
//     }
//     return token;
//   },

//   async session({ session, token }) {
//     if (session.user) {
//       session.user.id = token.id as string;
//       session.user.role = token.role as string;
//     }
//     return session;
//   },
// },

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   session: {
//     strategy: "jwt",
//     maxAge: 10 * 24 * 60 * 60,
//   },

//   secret: process.env.AUTH_SECRET,
// });


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectDb();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User does not exist");

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
          });
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
});
