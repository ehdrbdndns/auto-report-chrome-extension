export function SmallButton({ text }: { text: string }) {
  return (
    <button className="bg-primary-color py-[0.3rem] px-[1.2rem] rounded-[0.6rem] hover:opacity-70">
      <span className="text-sm font-semibold white">{text}</span>
    </button>
  );
}

export function BigButton({ text }: { text: string }) {
  return <button className="bg-primary-color ">{text}</button>;
}
