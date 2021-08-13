import React, { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import anwserImg from '../../assets/images/answer.svg'
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode'
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { firebaseDatabase } from '../../services/firebase';

import '../../styles/room.scss'

type RoomParams = {
    id: string
}

const AdminRoom: React.FC = () => {
    const { user } = useAuth()
    const { push } = useHistory()
    const { id: roomId } = useParams<RoomParams>()
    const { title, questions } = useRoom(roomId)

    const handleFinishRoom = async () => {
        await firebaseDatabase.ref(`rooms/${roomId}`).update({
            finishedAt: new Date()
        })

        push('/')
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm("Tem certeza que voce deseja excluir esta pergunta?")) {
            await firebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    const handleHighlightQuestion = async (questionId: string) => {
        await firebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    const handleCheckQuestionAsAnswered = async (questionId: string) => {
        await firebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            onClick={handleFinishRoom}
                            isOutlined
                        >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>

                <div className="question-list">
                    {questions.map((item, index) =>
                        <Question
                            key={`${index}-${item.id}`}
                            content={item.content}
                            author={item.author}
                            isAnswered={item.isAnswered}
                            isHighlighted={item.isHighlighted}
                        >
                            {!item.isAnswered && (
                                <>
                                    <button
                                        onClick={() => handleCheckQuestionAsAnswered(item.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    <button
                                        onClick={() => handleHighlightQuestion(item.id)}
                                    >
                                        <img src={anwserImg} alt="Dar destaque a perguntar" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDeleteQuestion(item.id)}
                            >
                                <img src={deleteImg} alt="Deletar uma pergunta" />
                            </button>
                        </Question>
                    )
                    }
                </div>
            </main>
        </div>
    )
}

export { AdminRoom }