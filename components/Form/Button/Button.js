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
        'bg-black hover:bg-white text-white hover:text-black border-black border text-base font-rubik font-bold uppercase rounded-full py-6 px-10 self-start',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
