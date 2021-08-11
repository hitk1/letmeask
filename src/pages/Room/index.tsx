import React, { FormEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode'
import { useAuth } from '../../hooks/useAuth';
import { firebaseDatabase } from '../../services/firebase';


import '../../styles/room.scss'

type FirebaseQuestions = Record<string, {
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHightlighted: boolean
}>

type Question = {
    id: string
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHightlighted: boolean
}

type RoomParams = {
    id: string
}

const Room: React.FC = () => {
    const { user } = useAuth()
    const { id: roomId } = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    const handleSendQuestion = async (event: FormEvent) => {
        event.preventDefault()

        if (newQuestion.trim() == '')
            return

        if (!user)
            throw new Error("You must be logged in")

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        }

        await firebaseDatabase.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('')
    }

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
                    isHightlighted: value.isHightlighted
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

    }, [roomId])

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode
                        code={roomId}
                    />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {
                            user
                                ? (
                                    <div className="user-info">
                                        <img src={user.avatar} alt={user.name} />
                                        <span>{user.name}</span>
                                    </div>
                                )
                                : (
                                    <span>Para enviar um perguntar,
                                        <button>
                                            faça seu login
                                        </button>
                                    </span>
                                )
                        }
                        <Button
                            type="submit"
                            disabled={!user}
                        >
                            Enviar pergunta
                        </Button>
                    </div>
                </form>


            </main>
        </div>
    )
}

export { Room }