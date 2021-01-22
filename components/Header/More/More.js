import TimesIcon from '@/public/icons/times.svg';

function Footer() {
  return (
    <footer className="flex justify-end bg-gray-700 md:hidden mt-auto border-gray-600 border-t">
      <a
        href=""
        className="w-1/2 py-5 text-center font-rubik text-xs font-bold uppercase border-r border-gray-600"
      >
        Mein Ort
      </a>

      <a
        href=""
        className="w-1/2 py-5 text-center font-rubik text-xs font-bold uppercase"
      >
        Suche
      </a>
    </footer>
  );
}

export default function More({ children, onDismiss = () => {} }) {
  return (
    <div className="flex flex-col bg-gray-800 absolute top-0 right-0 w-screen h-screen pt-5">
      <button
        type="button"
        className="justify-end ml-auto mr-5 mb-20"
        onClick={onDismiss}
      >
        <TimesIcon className="w-14 h-14" />
        <span className="font-rubik text-3xs uppercase tracking-wide">
          Close
        </span>
      </button>

      {children}

      <Footer />
    </div>
  );
}
