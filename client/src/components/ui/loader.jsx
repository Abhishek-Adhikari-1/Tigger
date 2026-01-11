export default function Loader() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="relative w-10 h-10 rotate-165">
        <span className="absolute top-1/2 left-1/2 block w-2 h-2 rounded-sm -translate-x-1/2 -translate-y-1/2 animate-beforeShadow"></span>
        <span className="absolute top-1/2 left-1/2 block w-2 h-2 rounded-sm -translate-x-1/2 -translate-y-1/2 animate-afterShadow"></span>
      </div>
    </div>
  );
}
