type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return <div className="rounded-2xl bg-brand px-4 py-3 text-sm font-medium text-white">{message}</div>;
}
