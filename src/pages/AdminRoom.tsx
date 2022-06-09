import { useParams, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import Modal from '../components/Modal';

import '../styles/room.scss';
// import { useAuth } from '../hooks/useAuth';

import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';



type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalCheck, setShowModalCheck] = useState<boolean>(false);
  const [showModalAnswer, setShowModalAnswer] = useState<boolean>(false);
  const [showModalEndRoom, setShowModalEndRoom] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useNavigate();

  const { title, questions } = useRoom(`${roomId}`)

  async function HandleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history(`/`);
  }

  async function handleDeleteQuestion() {
    await database.ref(`rooms/${roomId}/questions/${selected}`).remove();
    setShowModal(false);
  }

  async function handleCheckQuestionAsAnswered() {
    await database.ref(`rooms/${roomId}/questions/${selected}`).update({
      isAnswered: true,
    })
    setShowModalCheck(false);

  }

  async function handleHighlightQuestion() {
    await database.ref(`rooms/${roomId}/questions/${selected}`).update({
      isHighlighted: true,
    })
    setShowModalAnswer(false);
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={`${roomId}`} />
            <Button isOutlined onClick={() => setShowModalEndRoom(true)}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>}
        </div>



        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModalCheck(true)
                        setSelected(question.id)
                      }
                      }
                    >
                      <img src={checkImg} alt="Marca pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModalAnswer(true)
                        setSelected(question.id)
                      }
                      }
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(true)
                    setSelected(question.id)
                  }
                  }
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
      {
        showModal && (
          <Modal
            title='Excluir Pergunta'
            description='Tem certeza que deseja excluir essa pergunta?'
            show={showModal} onClose={() => setShowModal(false)}
            onToAccept={() => handleDeleteQuestion()} />
        )
      }
      {
        showModalCheck && (
          <Modal
            title='Marcar como respondida'
            description='Tem certeza que deseja marcar essa pergunta como respondida?'
            show={showModalCheck} onClose={() => setShowModalCheck(false)}
            onToAccept={() => handleCheckQuestionAsAnswered()} />
        )
      }
      {
        showModalAnswer && (
          <Modal
            title='Dar destaque à pergunta'
            description='Tem certeza que deseja dar destaque essa pergunta?'
            show={showModalAnswer} onClose={() => setShowModalAnswer(false)}
            onToAccept={() => handleHighlightQuestion()} />
        )
      }
      {
        showModalEndRoom && (
          <Modal
            title='Encerrar a sala'
            description='Tem certeza que deseja encerrar a sala?'
            show={showModalEndRoom} onClose={() => setShowModalEndRoom(false)}
            onToAccept={() => HandleEndRoom()} />
        )
      }
    </div>
  )
}