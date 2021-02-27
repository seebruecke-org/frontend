export default function Logo({ className }) {
  return (
    <div className="leading-none flex flex-col justify-center">
      <svg
        width="80"
        height="40"
        viewBox="18 0 80 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M24.7 33.6c-1-.1-4-.8-4.8-1-.4-.2-.4-.5-.1-1.2.2-.6 3.5-4 5.4-5.6 3.6-3.1 7.7-5.9 13.1-9A144.8 144.8 0 0188 .5l5-.3c4-.1 12.3-.1 12.3 0l-2 .3c-7.9 1-15 3-21.5 6.4l-2.8 1.4-.1 1.9-.2 2c-.1.2-1 .2-1.1 0l-.2-1.5V9.2l-.6.4-3 2L72 13v3.3c0 3.6 0 4-.7 4s-.8-.1-.8-3.2v-2.9l-2.1 2a56.5 56.5 0 00-2.9 3.2l-.8 1v4c0 3.7 0 4-.3 4.2-.3.3-.7.3-1 0-.2-.2-.2-.7-.2-3.3v-3l-1 1.4c-2 3-4 6.6-4.7 8.5a51.3 51.3 0 00-5.6-.7 48.6 48.6 0 00-13.2 1l-6 1a51 51 0 01-8 0z"
          fill="currentColor"
        />
      </svg>

      <span className="font-rubik font-rubik-features text-base md:text-base uppercase font-bold leading-none">
        SEEBRÜCKE
      </span>
    </div>
  );
}
