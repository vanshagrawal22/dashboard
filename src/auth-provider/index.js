'use client'
import {SessionProvider} from "next-auth/react" 

const NextAuthProvider = ({children})=>{
    return <SessionProvider>
        {children}
    </SessionProvider>
}

export default NextAuthProvider