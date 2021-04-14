import ReactModal from 'react-modal';

import TimesIcon from '@/public/icons/times.svg';

ReactModal.setAppElement('#__next');

const styles = {
  content: {
    borderRadius: 0,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
    zIndex: 21
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20
  }
};

export default function Modal({ children, onClose = () => {}, ...props }) {
  return (
    <ReactModal onRequestClose={() => onClose()} style={styles} {...props}>
      <div className="relative p-10">
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-8 right-8 flex flex-col items-center font-rubik font-rubik-features text-3xs uppercase leading-none text-gray-800 hover:text-orange-800"
        >
          <TimesIcon className="w-14 h-auto mb-1" />
          Close
        </button>

        <div className="pt-20">{children}</div>
      </div>
    </ReactModal>
  );
}
