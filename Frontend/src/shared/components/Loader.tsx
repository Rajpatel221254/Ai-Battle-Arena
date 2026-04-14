interface LoaderProps {
  /** "screen" fills the viewport, "inline" sits inside its parent, "button" is tiny */
  size?: "screen" | "inline" | "button";
  label?: string;
}

export default function Loader({ size = "inline", label }: LoaderProps) {
  const sizeMap = {
    screen: "w-12 h-12 border-[3px]",
    inline: "w-8 h-8 border-[3px]",
    button: "w-4 h-4 border-2",
  };

  const wrapper =
    size === "screen"
      ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-arena-900/80 backdrop-blur-sm"
      : "flex flex-col items-center justify-center py-4";

  return (
    <div className={wrapper}>
      <div
        className={`${sizeMap[size]} rounded-full border-arena-600 border-t-neon-cyan animate-spin`}
      />
      {label && (
        <p
          className={`mt-3 text-arena-400 font-medium ${
            size === "button" ? "text-xs" : "text-sm"
          }`}
        >
          {label}
        </p>
      )}
    </div>
  );
}
