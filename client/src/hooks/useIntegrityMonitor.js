import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

export function useIntegrityMonitor(interviewId, enabled) {
  const [violationCount, setViolationCount] = useState(0);
  const [lastWarning, setLastWarning] = useState('');
  const reportedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !interviewId) return;

    const reportViolation = async (type) => {
      try {
        const res = await api.post(`/interview/${interviewId}/violation`, { type });
        setViolationCount(res.data.violationCount);
        setLastWarning(res.data.warning);
      } catch (err) {
        console.error('Failed to report violation', err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_switch');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && reportedRef.current) {
        reportViolation('fullscreen_exit');
      }
      reportedRef.current = !!document.fullscreenElement;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [interviewId, enabled]);

  return { violationCount, lastWarning };
}