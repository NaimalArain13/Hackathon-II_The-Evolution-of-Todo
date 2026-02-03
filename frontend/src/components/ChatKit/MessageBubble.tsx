/**
 * MessageBubble component - Displays individual messages in the chat
 * Differentiates between user and assistant messages with appropriate styling
 */

import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const isStreaming = message.streaming;
  const isError = message.status === 'error';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        } ${isError ? 'bg-red-100 text-red-800 border border-red-300' : ''}`}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-current opacity-75"></span>
          )}
        </div>
        <div
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}