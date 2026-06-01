import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToastProps = {
  message: string | null
  onClose: () => void
  isDarkMode?: boolean
}

export function Toast({ message, onClose, isDarkMode }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [message])

  if (!message && !isVisible) return null

  const lowerMsg = message?.toLowerCase() || ''
  const isError = lowerMsg.includes('fail') || lowerMsg.includes('error') || lowerMsg.includes('only ') || lowerMsg.includes('must be') || lowerMsg.includes('invalid') || lowerMsg.includes('delete')
  const isSuccess = lowerMsg.includes('success')
  
  const Icon = isError ? AlertTriangle : isSuccess ? CheckCircle2 : Info
  
  // Dynamic Theme Generation
  let containerTheme = ''
  let iconBgTheme = ''
  let dividerTheme = ''
  let btnTheme = ''

  if (isError) {
    containerTheme = isDarkMode 
      ? 'border-rose-500/20 bg-rose-500/10 text-rose-100 shadow-rose-900/20' 
      : 'border-rose-200 bg-rose-50/90 text-rose-900 shadow-rose-500/20'
    iconBgTheme = isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-200 text-rose-700'
    dividerTheme = isDarkMode ? 'border-rose-500/20' : 'border-rose-200'
    btnTheme = isDarkMode ? 'text-rose-400 hover:bg-rose-500/20 hover:text-rose-200' : 'text-rose-600 hover:bg-rose-200 hover:text-rose-800'
  } else if (isSuccess) {
    containerTheme = isDarkMode 
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100 shadow-emerald-900/20' 
      : 'border-emerald-200 bg-emerald-50/90 text-emerald-900 shadow-emerald-500/20'
    iconBgTheme = isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-200 text-emerald-700'
    dividerTheme = isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200'
    btnTheme = isDarkMode ? 'text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200' : 'text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800'
  } else {
    containerTheme = isDarkMode 
      ? 'border-blue-500/20 bg-blue-500/10 text-blue-100 shadow-blue-900/20' 
      : 'border-blue-200 bg-blue-50/90 text-blue-900 shadow-blue-500/20'
    iconBgTheme = isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-200 text-blue-700'
    dividerTheme = isDarkMode ? 'border-blue-500/20' : 'border-blue-200'
    btnTheme = isDarkMode ? 'text-blue-400 hover:bg-blue-500/20 hover:text-blue-200' : 'text-blue-600 hover:bg-blue-200 hover:text-blue-800'
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      } ${containerTheme}`}
    >
      <div className={`grid h-8 w-8 place-items-center rounded-full shrink-0 ${iconBgTheme}`}>
        <Icon size={18} />
      </div>
      <p className="text-[13px] font-bold tracking-tight pr-2 leading-tight">{message}</p>
      <div className={`ml-1 pl-3 border-l ${dividerTheme}`}>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className={`rounded-lg p-1.5 transition-colors shrink-0 ${btnTheme}`}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
