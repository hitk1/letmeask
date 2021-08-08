import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { firebase, firebaseAuth } from '../../services/firebase'
import { Button } from '../../components/Button';
import '../../styles/auth.scss'

import { AuthContext } from '../../contexts/AuthContext'

const Home: React.FC = () => {
    const { push } = useHistory()
    const { user, signInWithGoogle } = useContext(AuthContext)

    const handleCreateRoom = useCallback(async () => {
        if (!user)
            await signInWithGoogle()

        push('/rooms/new')
    }, [])

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
                    <button
                        className="create-room"
                        onClick={handleCreateRoom}
                    >
                        <img src={googleIconImg} alt="Logo google" />
                        Crie sua sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form action="">
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type="submit" >
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export { Home }