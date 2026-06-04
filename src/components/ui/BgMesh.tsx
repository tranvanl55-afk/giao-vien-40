export function BgMesh() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Background Image from user - 100% opacity, no overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.postimg.cc/Hx1kGm3g/nen-ws.png')" }}
      />
    </div>
  );
}
