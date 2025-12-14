// src/components/Footer.jsx

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="
        mx-auto
        max-w-5xl
        px-4
        py-4
        flex
        flex-col
        items-center
        gap-1
        text-center
        text-xs
        text-slate-500

        sm:flex-row
        sm:justify-between
        sm:text-sm
      ">
        {/* Identidad */}
        <span className="font-medium text-slate-600">
          Web Developer Daniel Alejandro
        </span>

        {/* Contacto */}
        <a
          href="mailto:daniel.salas@bue.edu.ar"
          className="
            text-[var(--color-primary)]
            hover:underline
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--color-primary)]
            rounded-sm
          ">
          daniel.salas@bue.edu.ar
        </a>

        {/* Legal */}
        <span className="text-slate-400">
          © {year} · All rights reserved
        </span>
      </div>
    </footer>
  );
}
