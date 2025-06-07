"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
  onClick?:()=>void;
  disabled?:boolean
}

export const BackButton = ({ href, label,onClick ,disabled}: BackButtonProps) => {
  return (
    <Button variant={"link"}    disabled={disabled} className="p-0 h-auto font-normal text-purple-400 hover:text-purple-300  underline-offset-4" onClick={onClick} asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};