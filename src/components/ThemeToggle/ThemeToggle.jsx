import { useTheme } from "@/context/ThemeContext";
import { FaSun } from "react-icons/fa6";
import { IoMoonOutline } from "react-icons/io5";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-pressed={isDark}
      className="flex items-center gap-2 bg-white dark:bg-blue-900 text-grey-950 dark:text-white font-body text-[0.75rem] lg:text-[1rem] leading-[1.35] lg:leading-loose font-semibold focus-ring"
    >
      {isDark ? <><FaSun aria-hidden="true" className="flex-inline justify-center size-4 lg:size-5" /> Light Mode</> : <><IoMoonOutline aria-hidden="true" className="flex-inline justify-center size-4 lg:size-5" /> Dark Mode</>}
    </button>
  );
}

export default ThemeToggle;