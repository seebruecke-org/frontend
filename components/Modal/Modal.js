import ReactModal from 'react-modal';

ReactModal.setAppElement('#__next');

export default function Modal({
  children,
  onClose = () => {},
  onRequestClose,
  ...props
}) {
  return (
    <ReactModal onRequestClose={() => onClose()} {...props}>
      <button type="button" onClick={() => onClose()}>
        Schliessen
      </button>

      {children}
    </ReactModal>
  );
}
