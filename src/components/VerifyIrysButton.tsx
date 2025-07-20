'use client';

import React from 'react';

interface VerifyIrysButtonProps {
  url: string;
  size?: 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
  fileType?: string;
  onDownloadClick?: () => void;
}

export default function VerifyIrysButton({ 
  url, 
  size = 'sm', 
  className = '',
  children,
  fileType,
  onDownloadClick
}: VerifyIrysButtonProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  };

  const sizeStyles = {
    sm: {
      padding: '8px 12px',
      fontSize: '14px',
      gap: '6px'
    },
    lg: {
      padding: '12px 16px',
      fontSize: '16px',
      gap: '8px'
    }
  };

  const colorStyles = {
    backgroundColor: '#072A6C',
    color: '#ffffff',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };

  const hoverStyles = {
    backgroundColor: '#0d3a8a',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If it's a PDF and we have a download handler, use it
    if (fileType === 'application/pdf' && onDownloadClick) {
      onDownloadClick();
      return;
    }
    
    // Otherwise open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = hoverStyles.backgroundColor;
    target.style.transform = hoverStyles.transform;
    target.style.boxShadow = hoverStyles.boxShadow;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = colorStyles.backgroundColor;
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = colorStyles.boxShadow;
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...colorStyles
  };

  // Determine button text based on file type
  const getButtonText = () => {
    if (children) return children;
    if (fileType === 'application/pdf') return 'Download PDF';
    return 'Verify on Irys';
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={combinedStyles}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        style={{ width: size === 'sm' ? '14px' : '16px', height: size === 'sm' ? '14px' : '16px' }} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </svg>
      {getButtonText()}
    </a>
  );
} 