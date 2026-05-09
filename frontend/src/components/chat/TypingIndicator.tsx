interface Props {
  typingUsers: string[];
}

export default function TypingIndicator({ typingUsers }: Props) {
  if (typingUsers.length === 0) return null;

  let text = "";
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]}, ${typingUsers[1]} are typing...`;
  } else {
    text = `${typingUsers[0]}, ${typingUsers[1]} and others are typing...`;
  }

  return (
    <div className="px-6 py-2">
      <p className="text-xs text-indigo-400 font-medium animate-pulse">
        {text}
      </p>
    </div>
  );
}
