
import { Chapter, AppState } from '../types';
import { INITIAL_CHAPTERS, LOCAL_STORAGE_KEY } from '../constants';

export const getAppState = (): AppState => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const initialState: AppState = {
      chapters: INITIAL_CHAPTERS,
      darkMode: false,
    };
    saveAppState(initialState);
    return initialState;
  }
  return JSON.parse(data);
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const updateChapters = (chapters: Chapter[]) => {
  const state = getAppState();
  state.chapters = chapters;
  saveAppState(state);
};
