import Link from "next/link";
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="h-[100px] w-full bg-white shadow-sm flex items-center justify-between px-0">
      <div className="flex items-center gap-0">
        <Image
          src="/images/logo.svg"
          width={128}
          height={128}
          alt="CloneVk"
          className="max-h-[100px] object-contain"
        />
        <input
          type="text"
          placeholder="Поиск"
          className="bg-gray-100 rounded-full px-4 text-sm w-[600px] h-[40px] ml-0"
        />
      </div>

    <div className="flex items-center gap-6 pr-8">
      <nav className="flex items-center gap-6 text-sm text-gray-800">
        <Link href="#">Друзья</Link>
        <Link href="#">Группы</Link>
        <Link href="#">Сообщения</Link>
        <Link href="#">Лента</Link>
      </nav>
      <button
        className="w-[192px] h-[32px] bg-blue-500 text-white text-sm rounded-lg flex items-center justify-center"
      >
      Входи-входи
      </button>
    </div>
  </header>
  );
}
