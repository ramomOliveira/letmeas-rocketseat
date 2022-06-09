import imgDelete from '../../assets/images/delete.svg';
import { Button } from '../Button';
import './style.scss';

interface ModalProps {
  description: string;
  show: boolean;
  onClose: () => void;
  title: string;
  onToAccept?: () => void;
}

export default function Modal({ description, show, onClose, title, onToAccept }: ModalProps) {
  const handleOutsideClick = () => {
    onClose();
  };
  if (!show) {
    return null;
  }

  return (
    <div onClick={handleOutsideClick} className='wrapper-modal'>
      <div onClick={(event) => event.stopPropagation()} className='container'>


        <img src={imgDelete} alt="Imagem de delete" />
        <h1>{title}</h1>
        <p>{description}</p>
        <div>
          <Button onClick={onClose} >Cancelar</Button>
          <Button onClick={onToAccept} >Sim</Button>
        </div>


      </div>
    </div>
  )
}