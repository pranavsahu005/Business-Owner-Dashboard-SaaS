import { useStore } from '../store';

export default function OrbsBackground() {
  const { themeMode } = useStore();

  if (themeMode === 'galaxy') {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-500 bg-[#0B0A18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 16% 18%, rgba(129, 140, 248, 0.14), transparent 44%), radial-gradient(circle at 86% 24%, rgba(217, 155, 195, 0.1), transparent 42%), radial-gradient(circle at 52% 92%, rgba(114, 178, 162, 0.08), transparent 46%)',
        }}
      />
    );
  }

  if (themeMode === 'dark') {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-500 bg-[#111110]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 84% 12%, rgba(212, 168, 114, 0.08), transparent 42%), radial-gradient(circle at 14% 85%, rgba(124, 169, 149, 0.07), transparent 46%)',
        }}
      />
    );
  }

  // Serene Warm Pastel Editorial Light Canvas (Alabaster + Soft Buttercream + Warm Peach wash)
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-500 bg-[#F6F2EA]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 88% 8%, rgba(246, 224, 176, 0.48), transparent 42%), radial-gradient(circle at 12% 18%, rgba(242, 221, 206, 0.36), transparent 40%), radial-gradient(circle at 72% 92%, rgba(216, 232, 223, 0.34), transparent 45%)',
      }}
    />
  );
}
