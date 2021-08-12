import { useEffect, useState } from "react"
import { firebaseDatabase } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHightlighted: boolean
    likeCount: number
    likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHightlighted: boolean
    likes: Record<string, {
        authorId: string
    }>
}>

const useRoom = (roomId: string) => {
    const { user } = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = firebaseDatabase.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions = databaseRoom.questions as FirebaseQuestions

            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(item => {
                const [key, value] = item
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHightlighted: value.isHightlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.uuid)?.[0]
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => roomRef.off('value')

    }, [roomId, user?.uuid])

    return { questions, title }
}

export { useRoom }