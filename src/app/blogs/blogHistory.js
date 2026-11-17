"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const MAX_HISTORY_DEPTH = 60;
const DEBOUNCE_DELAY_MS = 600;

// Persistent session history store in memory
// Map<string, { past: Array, present: Object, future: Array, typingBaseline: Object | null }>
const sessionHistories = new Map();

/**
 * Deep clones blog state to ensure immutable snapshots
 */
export function cloneBlogState(state) {
  if (!state) return null;
  return {
    hashtag: typeof state.hashtag === "string" ? state.hashtag : "",
    topImageUrl: typeof state.topImageUrl === "string" ? state.topImageUrl : "",
    selectedBlogId: state.selectedBlogId ? String(state.selectedBlogId) : "",
    sections: Array.isArray(state.sections)
      ? state.sections.map((sec) => ({
          _uid: sec._uid,
          heading: typeof sec.heading === "string" ? sec.heading : "",
          para: typeof sec.para === "string" ? sec.para : "",
          image: typeof sec.image === "string" ? sec.image : "",
          backlinks: Array.isArray(sec.backlinks)
            ? sec.backlinks.map((b) => ({
                anchor: typeof b?.anchor === "string" ? b.anchor : "",
                url: typeof b?.url === "string" ? b.url : "",
              }))
            : [],
        }))
      : [],
  };
}

/**
 * Compares two blog states for deep equality to prevent redundant history snapshots
 */
export function areBlogStatesEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;

  if (a.hashtag !== b.hashtag) return false;
  if (a.topImageUrl !== b.topImageUrl) return false;
  if (a.selectedBlogId !== b.selectedBlogId) return false;

  const aSecs = a.sections || [];
  const bSecs = b.sections || [];
  if (aSecs.length !== bSecs.length) return false;

  for (let i = 0; i < aSecs.length; i++) {
    const sA = aSecs[i];
    const sB = bSecs[i];
    if (!sA || !sB) return false;
    if (sA._uid !== sB._uid) return false;
    if (sA.heading !== sB.heading) return false;
    if (sA.para !== sB.para) return false;
    if (sA.image !== sB.image) return false;

    const bA = sA.backlinks || [];
    const bB = sB.backlinks || [];
    if (bA.length !== bB.length) return false;
    for (let j = 0; j < bA.length; j++) {
      if (bA[j]?.anchor !== bB[j]?.anchor || bA[j]?.url !== bB[j]?.url) return false;
    }
  }

  return true;
}

/**
 * Custom hook providing centralized Global Undo and Redo functionality
 * for blog creation and editing sessions.
 *
 * @param {Object} options
 * @param {string} options.sessionKey - Unique session identifier (e.g. `edit_${blogId}` or `new_blog`)
 * @param {Object} options.initialState - Initial complete blog state
 * @param {Function} options.onApplyState - Callback called with restored blog state on undo/redo
 */
export function useBlogHistory({ sessionKey, initialState, onApplyState }) {
  const [, setTriggerRender] = useState(0);
  const isApplyingHistoryRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const typingBaselineRef = useRef(null);

  // Retrieve or initialize session history
  const getSession = useCallback(() => {
    const key = sessionKey || "new_blog";
    if (!sessionHistories.has(key)) {
      sessionHistories.set(key, {
        past: [],
        present: cloneBlogState(initialState),
        future: [],
      });
    }
    return sessionHistories.get(key);
  }, [sessionKey, initialState]);

  // Update session present on initial load or session switch if uninitialized
  useEffect(() => {
    const session = getSession();
    if (!session.present && initialState) {
      session.present = cloneBlogState(initialState);
      setTriggerRender((c) => c + 1);
    }
  }, [getSession, initialState]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  const session = getSession();
  const canUndo = (session.past?.length > 0) || Boolean(typingBaselineRef.current);
  const canRedo = session.future?.length > 0;

  /**
   * Commits any pending debounced typing changes into history
   */
  const commitPendingTyping = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (typingBaselineRef.current) {
      const s = getSession();
      s.past.push(typingBaselineRef.current);
      if (s.past.length > MAX_HISTORY_DEPTH) {
        s.past.shift();
      }
      typingBaselineRef.current = null;
      setTriggerRender((c) => c + 1);
    }
  }, [getSession]);

  /**
   * Re-bases the history baseline (e.g. when initial data finishes loading from server)
   */
  const setInitialBaseline = useCallback((freshState) => {
    const s = getSession();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    typingBaselineRef.current = null;
    s.past = [];
    s.present = cloneBlogState(freshState);
    s.future = [];
    setTriggerRender((c) => c + 1);
  }, [getSession]);

  /**
   * Records a user-initiated state change into centralized history
   *
   * @param {Object} nextState - New complete blog state
   * @param {Object} options
   * @param {boolean} options.isDiscrete - If true, commits immediately (for adds, deletes, reorders)
   */
  const recordChange = useCallback((nextState, { isDiscrete = false } = {}) => {
    if (isApplyingHistoryRef.current) return;
    const s = getSession();

    if (areBlogStatesEqual(s.present, nextState)) return;

    if (isDiscrete) {
      commitPendingTyping();
      if (s.present) {
        s.past.push(s.present);
        if (s.past.length > MAX_HISTORY_DEPTH) {
          s.past.shift();
        }
      }
      s.present = cloneBlogState(nextState);
      s.future = [];
      setTriggerRender((c) => c + 1);
    } else {
      // Rapid typing change: group within debounce window
      if (!typingBaselineRef.current) {
        typingBaselineRef.current = s.present || cloneBlogState(nextState);
      }
      s.present = cloneBlogState(nextState);
      s.future = []; // Clear redo stack on any new edit

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        commitPendingTyping();
      }, DEBOUNCE_DELAY_MS);

      setTriggerRender((c) => c + 1);
    }
  }, [getSession, commitPendingTyping]);

  /**
   * Performs an Undo operation
   */
  const undo = useCallback(() => {
    const s = getSession();

    // 1. If currently inside a typing debounce burst, undo back to typing baseline
    if (typingBaselineRef.current) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const restored = typingBaselineRef.current;
      typingBaselineRef.current = null;

      s.future.unshift(s.present);
      s.present = restored;

      isApplyingHistoryRef.current = true;
      onApplyState(cloneBlogState(restored));
      setTimeout(() => {
        isApplyingHistoryRef.current = false;
      }, 50);

      setTriggerRender((c) => c + 1);
      return true;
    }

    // 2. Otherwise pop from past stack
    if (!s.past || s.past.length === 0) return false;

    const previousState = s.past.pop();
    if (!previousState) return false;

    s.future.unshift(s.present);
    s.present = previousState;

    isApplyingHistoryRef.current = true;
    onApplyState(cloneBlogState(previousState));
    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 50);

    setTriggerRender((c) => c + 1);
    return true;
  }, [getSession, onApplyState]);

  /**
   * Performs a Redo operation
   */
  const redo = useCallback(() => {
    const s = getSession();

    commitPendingTyping();

    if (!s.future || s.future.length === 0) return false;

    const nextState = s.future.shift();
    if (!nextState) return false;

    s.past.push(s.present);
    s.present = nextState;

    isApplyingHistoryRef.current = true;
    onApplyState(cloneBlogState(nextState));
    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 50);

    setTriggerRender((c) => c + 1);
    return true;
  }, [getSession, commitPendingTyping, onApplyState]);

  /**
   * Clear session history
   */
  const clearSession = useCallback(() => {
    const key = sessionKey || "new_blog";
    if (sessionHistories.has(key)) {
      sessionHistories.delete(key);
      setTriggerRender((c) => c + 1);
    }
  }, [sessionKey]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    recordChange,
    setInitialBaseline,
    commitPendingTyping,
    clearSession,
    isApplyingHistory: () => isApplyingHistoryRef.current,
  };
}

