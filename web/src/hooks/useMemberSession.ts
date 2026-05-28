import { useState, useEffect } from 'react';

const STORAGE_KEY = 'band-manager-member-id';

export function useMemberSession() {
  const [memberId, setMemberIdState] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMemberIdState(saved);
  }, []);

  function setMemberId(id: string) {
    setMemberIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function clearMember() {
    setMemberIdState('');
    localStorage.removeItem(STORAGE_KEY);
  }

  return { memberId, setMemberId, clearMember };
}
