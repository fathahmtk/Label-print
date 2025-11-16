
import React from 'react';

export const MagicWandIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278V4.87421M12 19.1258V17.7472M17.7472 12H19.1258M4.87421 12H6.25278M16.1689 7.83112L17.1643 6.83569M6.83569 17.1643L7.83112 16.1689M16.1689 16.1689L17.1643 17.1643M6.83569 7.83112L7.83112 6.83569" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
  </svg>
);

export const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin h-4 w-4 text-stone-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
