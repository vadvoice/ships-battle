'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function User() {
  const { push } = useRouter();
  const initialUser = {
    nickname: '',
    avatarUrl: '',
    preview: '',
  };
  const [user, setUser] = useState(initialUser);

  const handleSubmit = (event) => {
    event.preventDefault();
    // get user data from form
    const { nickname, avatarUrl } = event.target.elements;

    // create user object
    const body = {
      nickname: nickname.value,
      avatarUrl: user.preview,
    };
    // store user object in local storage
    window.localStorage.setItem('user', JSON.stringify(body));

    // redirect to home page
    push('/');
  };

  const imageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64StringUS = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');

      setUser({
        ...user,
        avatarUrl: 'data:image/png;base64,' + base64StringUS,
        preview: 'data:image/png;base64,' + base64StringUS,
      });
    };
    reader.readAsDataURL(file);
  };

  const getBase64ImageSource = () => {
    // const myImage = localStorage.getItem('avatarUrl');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return user.avatarUrl || '/avatar.png';
  };

  useEffect(() => {
    // const blobUrl = getBase64ImageSource();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // set avatar to state in blob format
      setUser({
        ...initialUser,
        ...user
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // TODO: reset user data
  return (
    <div className="flex flex-1 justify-center items-center bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-400 to-gray-900">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-bold font-medium">
            Nickname
            <input
              defaultValue={user.nickname}
              name="nickname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Custom nick name"
              required
            />
          </label>
        </div>
        <div className="mb-6 flex items-center">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <input
              accept="image/*"
              name="avatarUrl"
              type="file"
              onChange={imageUpload}
            />
          </label>

          {user.avatarUrl ? (
            <Image
              className="rounded-full"
              width={100}
              height={100}
              src={user.avatarUrl || '/avatar.png'}
              alt="user avatar"
            />
          ) : null}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
