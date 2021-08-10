import React, { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import '../../styles/auth.scss'
import { Button } from '../../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useState } from 'react';
import { firebaseDatabase } from '../../services/firebase';

const NewRoom: React.FC = () => {
    const { user } = useContext(AuthContext)
    const { push } = useHistory()
    const [newRoom, setNewRoom] = useState('')

    const handleCreateRoom = async (event: FormEvent) => {
        event.preventDefault()

        if (newRoom.trim() === '')
            return

        const firebaseRoom = await firebaseDatabase.ref('rooms').push({
            title: newRoom,
            authorId: user?.uuid
        })

        push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo.</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type="submit" >
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export { NewRoom }