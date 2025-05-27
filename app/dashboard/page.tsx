"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Добавляем useRouter

type Post = {
  postID: number;
  userID: number;
  content: string;
  imageURL: string;
};

type User = {
  userID: number;
  userName: string;
  userAvatar: string;
};

type PostWithUser = Post & {
  user: User | null;
};

export default function DashboardPage() {
  const router = useRouter(); // Инициализируем router
  const [globalFeed, setGlobalFeed] = useState<PostWithUser[]>([]);
  const [personalFeed, setPersonalFeed] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    imageURL: ""
  });

  useEffect(() => {
    fetchFeeds();
  }, []);

  async function fetchFeeds() {
    setLoading(true);
    setError(null);

    const globalUrl = new URL("http://localhost:8083/feed/global");
    globalUrl.searchParams.set("limit", "10");
    globalUrl.searchParams.set("offset", "0");

    const personalUrl = new URL("http://localhost:8083/feed/personal");
    personalUrl.searchParams.set("userid", "1");
    personalUrl.searchParams.set("limit", "10");
    personalUrl.searchParams.set("offset", "0");

    try {
      const [globalRes, personalRes] = await Promise.all([
        fetch(globalUrl.toString()),
        fetch(personalUrl.toString()),
      ]);

      if (!globalRes.ok || !personalRes.ok) {
        throw new Error("Ошибка при загрузке ленты");
      }

      const globalData: Post[] = await globalRes.json();
      const personalData: Post[] = await personalRes.json();

      const userIds = new Set([
        ...globalData.map((p) => p.userID),
        ...personalData.map((p) => p.userID),
      ]);

      const userMap: Record<number, User> = {};
      await Promise.all(
        Array.from(userIds).map(async (id) => {
          const res = await fetch(`http://localhost:8083/users/${id}`);
          if (res.ok) {
            const user = await res.json();
            userMap[id] = user;
          }
        })
      );

      const enrichPosts = (posts: Post[]) =>
        posts.map((post) => ({
          ...post,
          user: userMap[post.userID] ?? null,
        }));

      setGlobalFeed(enrichPosts(globalData));
      setPersonalFeed(enrichPosts(personalData));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePost = async () => {
    try {
      const response = await fetch("http://localhost:8083/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPost.content,
          id: 1, // текущий пользователь
          imageURL: newPost.imageURL
        })
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании поста");
      }

      // Закрываем модальное окно и очищаем форму
      setIsModalOpen(false);
      setNewPost({ content: "", imageURL: "" });
      
      // Обновляем страницу
      router.push('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Остальной код остается без изменений
  const renderPost = (post: PostWithUser) => (
    <li 
      key={post.postID} 
      className="bg-white rounded-3xl drop-shadow-2xl overflow-hidden w-[900px] h-[900px] mb-6 flex flex-col"
    >
      <div className="flex items-center p-6 gap-4 rounded-3xl">
        <div className="flex items-center p-2 gap-4 rounded-2xl border-1 w-full">
          {post.user?.userAvatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0">
              <Image
                src={post.user.userAvatar}
                alt="User avatar"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0">
              ?
            </div>
          )}
          <div className="font-semibold text-xl">
            {post.user?.userName || `Пользователь ${post.userID}`}
          </div>
        </div>
      </div>

      {post.imageURL && (
        <div className="w-[870px] h-[650px] mx-auto relative overflow-hidden p-2">
          <img
            src={post.imageURL}
            alt="Post image"
            className="w-[860px] h-[630px] rounded-2xl"
          />
        </div>
      )}

      <div className="p-6 flex-1">
        <div className="flex p-2 gap-4 rounded-2xl border-1 w-full h-24">
          <p className="text-lg">{post.content}</p>
        </div>
      </div>
    </li>
  );

  if (loading) return <div className="p-6">Загрузка ленты...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* Sidebar */}
      <div className="w-40 h-36 bg-[#C5E3FF] shadow-md pt-6 p-4 mt-7 rounded-tr-2xl rounded-br-2xl">
        <div className="flex flex-col gap-3">
          <Link href="/profile">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden relative">
                <Image
                  src="/images/user-square-2.svg"
                  alt="Профиль"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <div className="text-lg font-semibold">Профиль</div>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 overflow-hidden relative">
                <Image
                  src="/images/newspaper.svg"
                  alt="Лента"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="text-lg font-semibold">Лента</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with buttons */}
          <div className="flex items-center gap-110">
            <h2 className="text-2xl min-w-62 min-h-12 font-bold mb-6 rounded-3xl pl-4 pt-2 bg-[#C5E3FF] mt-5">
              Глобальная лента
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="min-h-12 text-2xl px-6 font-bold rounded-3xl bg-[#C5E3FF] hover:bg-[#B0D4FF] transition-colors"
            >
              Создать пост
            </button>
          </div>

          {/* Posts */}
          {globalFeed.length > 0 && (
            <ul className="space-y-8">
              {globalFeed.map(renderPost)}
            </ul>
          )}

          {/* Personal Feed */}
          {personalFeed.length > 0 && (
            <div>
              <h2 className="text-2xl max-w-72 min-h-12 font-bold mb-6 rounded-3xl pl-4 pt-2 bg-[#C5E3FF]">
                Персональная лента
              </h2>
              <ul className="space-y-8">
                {personalFeed.map(renderPost)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Создать новый пост</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Содержание</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ссылка на изображение</label>
                <input
                  type="text"
                  value={newPost.imageURL}
                  onChange={(e) => setNewPost({...newPost, imageURL: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 rounded-lg bg-[#C5E3FF] hover:bg-[#B0D4FF] font-medium"
                disabled={!newPost.content}
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}