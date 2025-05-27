"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import authStore from "@/stores/AuthStore"
import Link from "next/link";

type User = {
  userID: number;
  userName: string;
  userEmail: string;
  userPassword: string;
  userAvatar: string;
};

type Post = {
  postID: number;
  userID: number;
  content: string;
  imageURL: string;
};

type Follow = {
  ID: number;
  FollowerID: number;
  FollowedID: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followedUsers, setFollowedUsers] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  const handleLogout = () => {
    authStore.logout()
    router.push('/')
  }

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        // Получаем данные пользователя
        const userRes = await fetch("http://localhost:8083/users/1");
        if (!userRes.ok) throw new Error("Ошибка при загрузке данных пользователя");
        const userData: User = await userRes.json();

        // Получаем посты пользователя
        const postsUrl = new URL("http://localhost:8083/posts/user");
        postsUrl.searchParams.set("userid", "1");
        postsUrl.searchParams.set("limit", "10");
        postsUrl.searchParams.set("offset", "0");

        const postsRes = await fetch(postsUrl.toString());
        if (!postsRes.ok) throw new Error("Ошибка при загрузке постов пользователя");
        const postsData: Post[] = await postsRes.json();

        // Получаем подписки (кого пользователь подписан)
        const followRes = await fetch("http://localhost:8083/follow/1");
        if (!followRes.ok) throw new Error("Ошибка при загрузке подписок");
        const followData: Follow[] = await followRes.json();

        // Получаем подписчиков (кто подписан на пользователя)
        const followersRes = await fetch("http://localhost:8083/followers/1");
        if (!followersRes.ok) throw new Error("Ошибка при загрузке подписчиков");
        const followersData: Follow[] = await followersRes.json();

        async function fetchUsersByIds(ids: number[]): Promise<User[]> {
          const uniqueIds = Array.from(new Set(ids));
          const usersPromises = uniqueIds.map((id) =>
            fetch(`http://localhost:8083/users/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Ошибка при загрузке пользователя ${id}`);
              return res.json();
            })
          );
          return Promise.all(usersPromises);
        }

        const followedIds = followData.map((f) => f.FollowedID);
        const followedUsersData = await fetchUsersByIds(followedIds);

        const followersIds = followersData.map((f) => f.FollowerID);
        const followersUsersData = await fetchUsersByIds(followersIds);

        setUser(userData);
        setPosts(postsData);
        setFollowedUsers(followedUsersData);
        setFollowers(followersUsersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Загрузка профиля...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;
  if (!user) return <div className="p-6">Пользователь не найден.</div>;

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* Sidebar (оставляем как было) */}
      <div className="w-40 h-36 bg-[#C5E3FF] shadow-md pt-6 p-4 mt-7 rounded-tr-2xl rounded-br-2xl">
        <div className="flex flex-col gap-3">
          <Link href="/profile">
            {/* Профиль */}
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
            {/* Лента */}
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
            <div className="text-lg font-semibold ">Лента</div>
          </div>
          </Link>
        </div>
      </div>
      
      {/* Основное содержимое - увеличен max-w-4xl */}
      <div className="flex-1 flex flex-col items-center pt-10 px-4">
        {/* Аватар и информация пользователя - теперь шире */}
        <div className="flex items-center gap-8 w-full max-w-4xl bg-[#F2F3F4] p-6 rounded-2xl">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 relative flex-shrink-0">
            {user.userAvatar ? (
              <Image
                src={user.userAvatar}
                alt={`${user.userName} avatar`}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-4xl font-bold">
                {user.userName[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{user.userName}</h1>
            <p className="text-gray-600 mt-2">{user.userEmail}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-48 h-10 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Выйти из профиля
          </button>
        </div>

        {/* Статистика - теперь в одну строку с отступами */}
        <div className="flex justify-between w-full max-w-4xl my-8 bg-white p-6 rounded-2xl shadow-sm">
          <div className="text-center px-4">
            <div className="text-3xl font-bold">{posts.length}</div>
            <div className="text-gray-600 mt-2">Посты</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-bold">{followedUsers.length}</div>
            <div className="text-gray-600 mt-2">Подписки</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-bold">{followers.length}</div>
            <div className="text-gray-600 mt-2">Подписчики</div>
          </div>
        </div>

        {/* Списки подписок и подписчиков - теперь в одной строке */}
        <div className="flex gap-6 w-full max-w-4xl mb-8">
          {/* Подписки */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Подписки</h3>
            {followedUsers.length === 0 ? (
              <p className="text-gray-500">Нет подписок</p>
            ) : (
              <ul className="space-y-3">
                {followedUsers.map((u) => (
                  <li key={u.userID} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-300">
                      {u.userAvatar ? (
                        <Image
                          src={u.userAvatar}
                          alt={`${u.userName} avatar`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                          {u.userName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span>{u.userName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Подписчики */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Подписчики</h3>
            {followers.length === 0 ? (
              <p className="text-gray-500">Нет подписчиков</p>
            ) : (
              <ul className="space-y-3">
                {followers.map((u) => (
                  <li key={u.userID} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded drop-shadow-3xl">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-300">
                      {u.userAvatar ? (
                        <Image
                          src={u.userAvatar}
                          alt={`${u.userName} avatar`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                          {u.userName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span>{u.userName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Посты пользователя - теперь шире */}
        <div className="w-full max-w-4xl mb-10">
          <h2 className="text-2xl font-semibold mb-6">Посты пользователя</h2>
          {posts.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-500">
              Постов пока нет
            </div>
          ) : (
            <ul className="space-y-12">
              {posts.map((post) => (
                <li
                  key={post.postID}
                  className="rounded-2xl p-6 bg-white drop-shadow-2xl"
                >
                  <div className="flex items-center pb-2 gap-4 rounded-3xl">
                    <div className="flex items-center p-2 gap-4 rounded-2xl border-1 w-full">
                      <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0">
                      {user.userAvatar ? (
                        <Image
                          src={user.userAvatar}
                          alt={`${user.userName} avatar`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                          {user.userName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-xl">{user.userName}</div>
                    </div>
                    </div>
                  </div>
                  {post.imageURL && (
                    <div className="w-[850px] h-[650px] mx-auto relative overflow-hidden p-2 rounded-2xl">
                      <img
                        src={post.imageURL}
                        alt="Пост изображение"
                        sizes="w-[860px] h-[630px]"
                      />
                    </div>
                  )}
                  <div className="pt-2 flex-1">
                    <div className="flex p-2 gap-4 rounded-2xl border-1 w-full h-24">
                      <p className="text-lg">{post.content}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}