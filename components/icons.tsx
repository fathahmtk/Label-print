import React from 'react';

type IconProps = {
  className?: string;
};

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
        <path d="M12 12v10"></path>
    </svg>
);

export const BarcodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 50" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 0 H5 V50 H0 z" />
        <path d="M8 0 H10 V50 H8 z" />
        <path d="M13 0 H14 V50 H13 z" />
        <path d="M17 0 H21 V50 H17 z" />
        <path d="M23 0 H24 V50 H23 z" />
        <path d="M27 0 H30 V50 H27 z" />
        <path d="M34 0 H35 V50 H34 z" />
        <path d="M38 0 H39 V50 H38 z" />
        <path d="M42 0 H46 V50 H42 z" />
        <path d="M50 0 H51 V50 H50 z" />
        <path d="M54 0 H55 V50 H54 z" />
        <path d="M58 0 H62 V50 H58 z" />
        <path d="M65 0 H67 V50 H65 z" />
        <path d="M70 0 H71 V50 H70 z" />
        <path d="M74 0 H78 V50 H74 z" />
        <path d="M82 0 H84 V50 H82 z" />
        <path d="M88 0 H90 V50 H88 z" />
        <path d="M94 0 H100 V50 H94 z" />
    </svg>
);

export const QrCodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 33 33" fill="currentColor" shapeRendering="crispEdges">
        <path d="M0 0h7v7H0z M1 1h5v5H1z M2 2h3v3H2z M0 26h7v7H0z M1 27h5v5H1z M2 28h3v3H2z M26 0h7v7h-7z M27 1h5v5h-5z M28 2h3v3h-3z M9 9h1v1H9z M11 9h1v1h-1z M13 9h1v1h-1z M15 9h1v1h-1z M17 9h1v1h-1z M19 9h1v1h-1z M21 9h1v1h-1z M9 11h1v1H9z M11 11h3v3h-3z M15 11h1v1h-1z M17 11h3v3h-3z M21 11h1v1h-1z M9 13h1v1H9z M15 13h1v1h-1z M21 13h1v1h-1z M9 15h1v1H9z M11 15h1v1h-1z M13 15h3v3h-3z M17 15h1v1h-1z M19 15h1v1h-1z M21 15h1v1h-1z M9 17h3v3h-3z M13 17h1v1h-1z M17 17h1v1h-1z M19 17h3v3h-3z M9 19h1v1H9z M11 19h1v1h-1z M15 19h3v3h-3z M19 19h1v1h-1z M9 21h1v1H9z M11 21h3v3h-3z M15 21h1v1h-1z M17 21h3v3h-3z M21 21h1v1h-1z"/>
    </svg>
);


export const BringForwardIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15 3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h10zm-3.707 5.293a1 1 0 00-1.414-1.414L8 8.586 6.121 6.707a1 1 0 00-1.414 1.414l2.586 2.586a1 1 0 001.414 0l3-3z" />
  </svg>
);


export const SendBackwardIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H3zm13.707-1.293a1 1 0 00-1.414-1.414L12 5.586 10.121 3.707a1 1 0 00-1.414 1.414l2.586 2.586a1 1 0 001.414 0l3-3z" />
  </svg>
);

export const BinIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export const DuplicateIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);

export const RotateIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M15.312 11.225A5.5 5.5 0 0111 16.5a5.5 5.5 0 01-4.43-8.812l-1.68-1.68a.75.75 0 011.06-1.06l1.68 1.68A5.5 5.5 0 0115.312 11.225z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M1.625 5.625a.75.75 0 011.06 0l1.68 1.68A5.5 5.5 0 018.8 3.5a5.5 5.5 0 014.43 8.812l1.68 1.68a.75.75 0 01-1.06 1.06l-1.68-1.68A5.5 5.5 0 014.688 8.775L3 10.463V6.687a.75.75 0 01.75-.75h2.775L1.625 5.625z" clipRule="evenodd" />
    </svg>
);

export const ZoomInIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.358 3.358a1 1 0 01-1.414 1.414l-3.358-3.358A7 7 0 012 9zm5-1a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export const ZoomOutIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.358 3.358a1 1 0 01-1.414 1.414l-3.358-3.358A7 7 0 012 9zm3-1a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export const ExportIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);

export const ImportIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);