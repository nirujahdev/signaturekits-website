'use client';

import React from 'react';

interface IconProps {
  src: string | { src: string; width?: number; height?: number } | any;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function Icon({ src, alt = 'Icon', className = '', width = 24, height = 24 }: IconProps) {
  // Extract the actual src path from Next.js SVG import object
  let iconSrc: string;
  let iconWidth = width;
  let iconHeight = height;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Icon.tsx:render',message:'Icon component render',data:{srcType:typeof src,srcIsObject:typeof src==='object',srcKeys:src&&typeof src==='object'?Object.keys(src):[],hasSrc:src&&typeof src==='object'?!!src.src:false},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (typeof src === 'string') {
    iconSrc = src;
  } else if (src && typeof src === 'object') {
    // Next.js SVG imports return objects with src property
    iconSrc = src.src || (src as any).default?.src || '';
    if (src.width) iconWidth = src.width;
    if (src.height) iconHeight = src.height;
  } else {
    iconSrc = '';
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Icon.tsx:after-extract',message:'Icon src extracted',data:{iconSrc,iconSrcType:typeof iconSrc,iconSrcLength:iconSrc?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (!iconSrc) {
    console.warn('Icon component: Invalid src provided', src);
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={alt}
      width={iconWidth}
      height={iconHeight}
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
}

