import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import { Bot, Loader2, Send, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ChatPro() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
  })

  console.log('messages:', messages)
  console.log('isLoading:', isLoading)
  console.log('error:', error)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      console.log('Sending message:', input)
      sendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const formatTime = (date = new Date()) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-slate-900 text-lg">
              AI Assistant
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Online • Always ready to help
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border border-slate-100/50">
                <p className="text-[15px] leading-relaxed text-slate-800">
                  👋 Hello! I'm your AI assistant. How can I help you today?
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } animate-fadeIn`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 shadow-emerald-500/30'
                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-blue-500/30'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col max-w-[70%] ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-3xl px-5 py-3.5 backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 rounded-tr-md'
                      : 'bg-white text-slate-800 shadow-lg border border-slate-100/50 rounded-tl-md'
                  }`}
                >
                  {/* Handle parts array */}
                  {message.parts && message.parts.length > 0 ? (
                    message.parts.map((part, idx) => {
                      if (part.type === 'thinking') {
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-2 mb-3 pb-3 border-b border-slate-200/50"
                          >
                            <div className="mt-0.5">💭</div>
                            <div className="text-sm text-slate-600 italic leading-relaxed">
                              {part.content}
                            </div>
                          </div>
                        )
                      }
                      if (part.type === 'text') {
                        return (
                          <p
                            key={idx}
                            className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                          >
                            {part.content}
                          </p>
                        )
                      }
                      return null
                    })
                  ) : (
                    // Fallback if no parts array (some chat implementations use content directly)
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {(message as any).content || 'No content'}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-400 mt-2 px-2 font-medium">
                  {formatTime()}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border border-slate-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-red-50 rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border border-red-100">
                <p className="text-[15px] leading-relaxed text-red-800">
                  ⚠️ Error: {error.message || 'Something went wrong'}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative group">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[58px] max-h-40 bg-slate-50/50 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 shadow-sm overflow-hidden"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="group flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 disabled:shadow-none hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center font-medium">
            <kbd className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">
              Enter
            </kbd>{' '}
            to send •{' '}
            <kbd className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">
              Shift + Enter
            </kbd>{' '}
            for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}
