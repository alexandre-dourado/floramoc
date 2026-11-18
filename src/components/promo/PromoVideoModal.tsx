import { useCallback, useEffect, useRef, useState } from 'react'
import { Compass, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'

export interface PromoVideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PromoVideoModal({ isOpen, onClose }: PromoVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isEnded, setIsEnded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Pausa o vídeo se o modal fechar
  useEffect(() => {
    const video = videoRef.current
    if (!isOpen) {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setIsEnded(false)
      setProgress(0)
    } else {
      if (video) {
        video.currentTime = 0
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Navegador exigiu mudo ou interação
              setIsPlaying(false)
            })
        }
      }
    }
  }, [isOpen])

  // Fecha com tecla Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
        .then(() => {
          setIsPlaying(true)
          setIsEnded(false)
        })
        .catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }, [])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setIsEnded(true)
  }

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play()
      .then(() => {
        setIsPlaying(true)
        setIsEnded(false)
      })
      .catch(() => setIsPlaying(false))
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação do Flora MOC"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-[360px] sm:max-w-[400px] max-h-[92dvh] overflow-hidden rounded-3xl bg-forest-deep shadow-[0_24px_60px_-10px_rgba(15,42,35,0.6)] border border-white/20 select-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Barra superior com botões de Ação */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Botão de Som */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Ativar som da narração' : 'Desativar som'}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-forest/85 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur-md border border-white/25 shadow-md transition-all hover:bg-forest hover:scale-105 active:scale-95 focus-visible:outline-3 focus-visible:outline-sun"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-sun animate-pulse" />
                <span>Ativar som</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-sun" />
                <span>Som ativo</span>
              </>
            )}
          </button>

          {/* Botão de Fechar 'X' */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar vídeo promocional"
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-forest/85 text-paper backdrop-blur-md border border-white/25 shadow-md transition-all hover:bg-forest hover:scale-110 active:scale-95 focus-visible:outline-3 focus-visible:outline-sun"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Player de Vídeo */}
        <div
          className="relative w-full aspect-[9/16] bg-black cursor-pointer overflow-hidden flex items-center justify-center"
          onClick={togglePlay}
          title={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        >
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted={isMuted}
            poster="/assets/video/flora-promo-poster.webp"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover block"
          >
            <source src="/assets/video/flora-promo.webm" type="video/webm" />
            <source src="/assets/video/flora-promo.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução deste vídeo.
          </video>

          {/* Overlay quando pausado */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 grid place-items-center bg-black/35 backdrop-blur-[2px] transition-all">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-sun text-ink shadow-lg transition-transform hover:scale-110">
                <Play className="h-8 w-8 translate-x-0.5 fill-ink" />
              </span>
            </div>
          )}

          {/* Overlay quando finalizado */}
          {isEnded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-forest-deep/85 p-6 text-center text-paper backdrop-blur-sm animate-in fade-in duration-300">
              <span className="eyebrow !text-sun tracking-widest">Flora MOC</span>
              <h3 className="font-serif text-2xl font-bold leading-snug">Explore e descubra o verde da nossa cidade</h3>
              <p className="text-xs text-paper/80 max-w-[260px]">
                Árvores e flores conectadas em um mapa vivo e comunitário de Montes Claros.
              </p>
              <div className="mt-2 flex flex-col sm:flex-row gap-2 w-full max-w-[280px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-primary !bg-sun !text-ink hover:!bg-sun-soft flex-1 shadow-lg font-bold"
                >
                  <Compass className="h-4 w-4" />
                  Explorar Mapa
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="btn btn-ghost !bg-forest/80 !text-paper hover:!bg-forest flex-1 border-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Rever
                </button>
              </div>
            </div>
          )}

          {/* Barra de Progresso Fina */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
            <div
              className="h-full bg-sun transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rodapé sutil com chamada rápida para o mapa */}
        <div className="flex items-center justify-between border-t border-white/10 bg-forest px-4 py-2.5 text-xs text-paper/90">
          <span className="font-medium truncate">Montes Claros • MG</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-sun hover:underline underline-offset-2 ml-2"
          >
            Pular para o mapa &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
