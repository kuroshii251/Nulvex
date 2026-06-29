import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'el-dialog-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'el-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    command?: string;
    commandFor?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'el-dialog-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'el-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
