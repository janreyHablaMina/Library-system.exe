type DynamicBookCoverProps = {
  title: string
  author: string
  seed?: string | number
  compact?: boolean
}

const coverPalettes = [
  { background: '#FDECDC', border: '#F4C995', text: '#6F3218', accent: '#C96B13', jewel: '#07866F' },
  { background: '#E8F2ED', border: '#B8D8C8', text: '#174A3A', accent: '#D18A22', jewel: '#19745F' },
  { background: '#E9EEF9', border: '#BCCBE8', text: '#253C70', accent: '#C77836', jewel: '#315E9B' },
  { background: '#F4EAF2', border: '#DDBFD7', text: '#663353', accent: '#C77A28', jewel: '#8A456F' },
  { background: '#F4F0DF', border: '#DDD19E', text: '#514719', accent: '#B96A24', jewel: '#647A37' },
  { background: '#E8F1F5', border: '#B8D2DD', text: '#244A5C', accent: '#C88125', jewel: '#34788A' },
  { background: '#F5E8E8', border: '#E1BDBD', text: '#6B3131', accent: '#C28A25', jewel: '#9A4E4E' },
  { background: '#EEEAF8', border: '#CEC3E7', text: '#49396D', accent: '#C7802B', jewel: '#69549B' },
]

function hashSeed(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

export function DynamicBookCover({ title, author, seed, compact = false }: DynamicBookCoverProps) {
  const palette = coverPalettes[hashSeed(String(seed ?? `${title}|${author}`)) % coverPalettes.length]

  return (
    <div
      className="relative flex h-full w-full select-none flex-col justify-between overflow-hidden rounded-[inherit] border shadow-sm"
      style={{ backgroundColor: palette.background, borderColor: palette.border, color: palette.text }}
      aria-label={`Generated cover for ${title}`}
      role="img"
    >
      <div className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute inset-y-0 left-[7%] w-px bg-white/40" />

      <div className={`relative z-10 font-black uppercase tracking-[0.16em] opacity-65 ${compact ? 'px-1.5 pt-1 text-[3px]' : 'px-4 pt-4 text-[7px]'}`}>
        InfoLib Collection
      </div>

      <div className={`relative z-10 flex flex-1 flex-col items-center justify-center text-center ${compact ? 'px-1' : 'px-4'}`}>
        <h4 className={`font-serif font-black leading-tight ${compact ? 'line-clamp-2 text-[6px]' : 'line-clamp-4 text-[12px]'}`}>
          {title || 'Untitled Book'}
        </h4>

        {!compact && (
          <div className="relative mt-3 flex h-8 w-8 items-center justify-center">
            <div className="absolute h-6 w-6 rotate-45 rounded border-2" style={{ borderColor: palette.jewel, backgroundColor: `${palette.jewel}18` }} />
            <div className="absolute h-4 w-4 rotate-45 rounded-sm" style={{ backgroundColor: palette.accent }} />
            <div className="absolute h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        )}
      </div>

      <div className={`relative z-10 flex flex-col items-center text-center ${compact ? 'px-1 pb-1' : 'px-4 pb-4'}`}>
        {!compact && <div className="mb-1.5 h-[1.5px] w-7 rounded opacity-30" style={{ backgroundColor: palette.text }} />}
        <span className={`max-w-full truncate font-bold uppercase tracking-wider opacity-80 ${compact ? 'text-[3px]' : 'text-[7.5px]'}`}>
          {author || 'Unknown Author'}
        </span>
      </div>
    </div>
  )
}
