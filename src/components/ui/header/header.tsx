import Image from "next/image";

export default function Header() {
  return (
    <div style={{ backgroundColor: "#1d4a5d", height: "60px", display: 'flex', justifyContent: 'space-between' }}>
      <Image
        src="https://styxx-public.s3.sa-east-1.amazonaws.com/logo-criarte.png"
        alt="Logo criarte"
        width={80}
        height={10}
        style={{marginLeft: '20px', padding: '10px'}}
      />
      <h3 className="text-white text-2xl" style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '20px'}}>Gerenciamento de projetos</h3>
    </div>
  );
}
