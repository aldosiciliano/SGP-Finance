import React from 'react';
import { Wallet } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex h-dvh overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid h-full w-full max-w-5xl items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:gap-6">
        <section className="auth-hero relative hidden h-full overflow-hidden p-6 lg:flex lg:flex-col xl:p-8">
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/10 to-transparent" />

          <div className="relative flex h-full items-center">
            <div className="max-w-xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9f6eb]">
                <span className="h-2 w-2 rounded-full bg-[#56d6a3]" />
                SGP Finance
              </div>

              <div className="max-w-xl rounded-[30px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm xl:p-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8fd0bc]">Acceso financiero</p>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-balance xl:text-5xl">
                  Diseñado para ver tus finanzas con claridad
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#c3d4ea] xl:text-[15px]">
                  Un acceso simple para entrar rápido a tu panel y trabajar con una interfaz más
                  clara y ordenada.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel flex h-full items-center justify-center overflow-hidden p-5 sm:p-6 xl:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 space-y-3 text-center sm:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--primary)] text-white shadow-lg sm:mx-0">
                <Wallet className="h-6 w-6" />
              </div>
              <p className="eyebrow">Acceso</p>
              <h2 className="text-2xl font-bold text-[var(--text)] xl:text-3xl">{title}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
