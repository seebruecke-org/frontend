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
        'bg-black hover:bg-white text-white hover:text-black border-black border text-xs md:text-base font-rubik font-bold uppercase rounded-full py-4 sm:py-5 md:py-6 px-7 sm:px-8 md:px-10 self-start',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
