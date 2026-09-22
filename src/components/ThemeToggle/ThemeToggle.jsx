import { flushSync } from "react-dom";
import { useTheme } from "@/hooks/useTheme.js";
import { FaSun } from "react-icons/fa6";
import { IoMoonOutline } from "react-icons/io5";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={isDark}
      className="flex items-center gap-2 bg-white dark:bg-blue-900 text-grey-950 dark:text-white font-body text-[0.75rem] lg:text-[1rem] leading-[1.35] lg:leading-loose font-semibold cursor-pointer focus-ring"
    >
      {isDark ? <><FaSun aria-hidden="true" className="flex-inline justify-center size-4 lg:size-5" /> Light Mode</> : <><IoMoonOutline aria-hidden="true" className="flex-inline justify-center size-4 lg:size-5" /> Dark Mode</>}
    </button>
  );
}

export default ThemeToggle;