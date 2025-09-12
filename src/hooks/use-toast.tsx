import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  className?: string;
  duration?: number;
};

export function useToast() {
  const toast = ({
    title,
    description,
    className = "",
    duration = 3000,
  }: ToastProps) => {
    return sonnerToast(title, {
      description,
      className: `bg-background text-foreground border border-border ${className}`,
      duration,
    });
  };

  return { toast };
}