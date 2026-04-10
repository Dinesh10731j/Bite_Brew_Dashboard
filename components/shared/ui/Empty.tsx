type EmptyProps = {
  title: string;
  description: string;
};

export function Empty({ title, description }: EmptyProps) {
  return (
    <div className="rounded-3xl border border-dashed border-brand/20 bg-brand-soft/60 px-6 py-10 text-center dark:border-white/10 dark:bg-white/5">
      <h3 className="text-lg font-semibold text-brand-ink dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{description}</p>
    </div>
  );
}
