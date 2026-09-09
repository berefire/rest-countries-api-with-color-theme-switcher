/**
 * Displays the challenge attribution footer, crediting Frontend Mentor
 * and linking to the developer's GitHub profile.
 *
 * This component takes no props — it renders fixed, static content and
 * is not meant to be reused with different data (see the architecture
 * discussion on when a component needs props vs. when it doesn't).
 */

function Attribution() {
  return (
    <footer className="font-body text-center text-xs text-grey-950 dark:text-white">
      Challenge by{' '}
      <a
        href="https://www.frontendmentor.io?ref=challenge"
        className="text-blue-800 dark:text-blue-400 hover:underline focus-ring"
      >
        Frontend Mentor <span
          aria-hidden="true" className="external-icon">🔗</span>
      </a>
      . Coded by{' '}
      <a
        href="https://github.com/berefire"
        className="text-blue-800 dark:text-blue-400 hover:underline focus-ring"
      >
        Berefire
      </a>
      .
    </footer>
  );
}

export default Attribution;