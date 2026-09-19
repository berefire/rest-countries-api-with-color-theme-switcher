function Button({ onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 w-fit shadow-md rounded-sm bg-white dark:bg-blue-900 dark:text-white text-sm md:text-[1rem] focus-ring ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;