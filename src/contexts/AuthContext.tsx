import { createContext, ReactNode, useCallback, useEffect, useState } from "react"
import { firebaseAuth, firebase } from "../services/firebase"

export interface IGoogleUser {
    uuid: string
    name: string
    avatar: string
}

export type AuthContextType = {
    user?: IGoogleUser,
    signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as any)

type AuthContextProviderProps = {
    children: ReactNode
}

const AuthContextProvider = (props: AuthContextProviderProps) => {
    const [user, setUser] = useState<IGoogleUser>()

    const signInWithGoogle = useCallback(async () => {
        const provider = new firebase.auth.GoogleAuthProvider()

        const result = await firebaseAuth.signInWithPopup(provider)
        const { user } = result

        if (user) {
            const { uid, displayName, photoURL } = user

            if (!displayName || !photoURL)
                throw new Error("Missing information from Google account!")

            setUser({
                uuid: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }, [])

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {

            if (user) {
                const { uid, displayName, photoURL } = user

                if (!displayName || !photoURL)
                    throw new Error("Missing information from Google account!")

                setUser({
                    uuid: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }

        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider }