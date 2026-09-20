import React from 'react';
import { cn } from './Button';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm text-slate-950 shadow-[0_8px_30px_rgb(0,0,0,0.04)]", className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-bold text-lg leading-none tracking-tight text-slate-800", className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  )
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}
