import { Download, Share, Smartphone, X } from 'lucide-react'
import { usePWAInstall } from '../../hooks/usePWAInstall'

export default function InstallBanner() {
  const {
    canShowBanner,
    isIOS,
    showIOSGuide,
    setShowIOSGuide,
    promptInstall,
    dismiss,
  } = usePWAInstall()

  if (!canShowBanner && !showIOSGuide) {
    return null
  }

  return (
    <>
      {canShowBanner && (
        <aside
          role="region"
          aria-label="Instalação do aplicativo"
          className="relative z-20 flex items-center justify-between gap-3 border-b border-sun/30 bg-forest px-3 py-2 text-paper shadow-sm sm:px-5"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/icons/icon-192x192.png"
              alt="Ícone Flora MOC"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg shadow-sm"
            />
            <p className="truncate text-xs text-paper/95 sm:text-sm">
              <strong className="font-semibold text-sun">Instale o Flora MOC</strong>{' '}
              <span className="hidden sm:inline">no seu celular para acesso rápido e modo offline</span>
              <span className="sm:hidden">no celular</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-xs font-semibold text-ink shadow-sm transition hover:bg-sun/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              {isIOS ? (
                <>
                  <Smartphone aria-hidden className="h-3.5 w-3.5 text-forest" />
                  <span>Como instalar</span>
                </>
              ) : (
                <>
                  <Download aria-hidden className="h-3.5 w-3.5 text-forest" />
                  <span>Instalar App</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dispensar aviso de instalação"
              className="grid h-7 w-7 place-items-center rounded-full text-paper/70 transition hover:bg-white/10 hover:text-paper"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-xs sm:items-center"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-line bg-paper p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Flora MOC"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-2xl shadow-sm"
                />
                <div>
                  <h3 id="ios-modal-title" className="font-serif text-lg font-bold text-forest">
                    Instalar no iPhone / iPad
                  </h3>
                  <p className="text-xs text-muted">Acesso instantâneo em 2 passos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="Fechar instruções"
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-sage/50 hover:text-ink"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>

            <ol className="mt-5 space-y-3.5 text-xs text-ink/85 sm:text-sm">
              <li className="flex items-center gap-3 rounded-2xl border border-line/60 bg-cream p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-xs font-bold text-paper">
                  1
                </span>
                <span>
                  No Safari, toque no botão <strong>Compartilhar</strong> (
                  <Share aria-hidden className="inline h-4 w-4 align-sub text-forest" /> na barra inferior).
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-line/60 bg-cream p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-xs font-bold text-paper">
                  2
                </span>
                <span>
                  Role a lista e selecione <strong>Adicionar à Tela de Início</strong> (ícone ⊞).
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="btn btn-primary mt-5 w-full !min-h-11 justify-center rounded-full text-sm font-semibold"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
