import React from 'react';

interface Props {
  name: string;
}

export function UserAvatar({ name }: Props) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
      {initials || '?'}
    </div>
  );
}