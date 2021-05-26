import clsx from 'clsx';

export default function Button({
  children,
  type = 'submit',
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        'bg-black hover:bg-white focus:bg-white text-white hover:text-black focus:text-black border-black border text-xs md:text-base font-rubik font-bold uppercase rounded-full py-5 sm:py-5 md:py-6 px-9 sm:px-8 md:px-10 self-start',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
