import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 md:px-10.25 lg:px-20.25 py-7.5 lg:py-6 bg-white dark:bg-blue-900 shadow-sm dark:shadow-sm font-body">
      <h1 className="font-extrabold leading-[1.2] lg:leading-snug text-sm lg:text-2xl text-gray-900 dark:text-white">
        Where in the world?
      </h1>
      <ThemeToggle />
    </header>
  );
}

export default Header;