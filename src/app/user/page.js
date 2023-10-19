'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function User() {
  const { push } = useRouter();
  const [user, setUser] = useState({
    nickname: '',
    avatarUrl: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // get user data from form
    const { nickname, avatarUrl } = event.target.elements;
    // create user object
    const user = {
      nickname: nickname.value,
    };
    // store user object in local storage
    window.localStorage.setItem('user', JSON.stringify(user));

    // redirect to home page
    push('/');
  };

  // const handleUploadImageToLocalStorage = (event) => {
  //   event.preventDefault();
  //   const file = event.target.files[0];

  //   // check file size; max 2 MB
  //   if (file.size > 2 * 1024 * 1024) {
  //     alert('File size should be less than 2 MB');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     window.localStorage.setItem('avatar', reader.result);
  //   };
  // };

  // const getAvatarBlobUrl = () => {
  //   const avatar = window.localStorage.getItem('avatar');
  //   const blob = new Blob([avatar], { type: 'image/png' });
  //   console.log('blob', blob);
  //   // convert blob to url
  //   const blobUrl = URL.createObjectURL(blob);
  //   return blobUrl;
  // };

  // useEffect(() => {
  //   const blobUrl = getAvatarBlobUrl();
  //   // set avatar to state in blob format
  //   setUser({
  //     ...user,
  //     avatarUrl: blobUrl,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nickname
            <input
              name="nickname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Custom nick name"
              required
            />
          </label>
        </div>
        {/* <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Avatar
            <input
              accept="image/*"
              name="avatarUrl"
              type="file"
              onChange={handleUploadImageToLocalStorage}
            />
          </label>
          <Image
            loader={getAvatarBlobUrl}
            unoptimized={false}
            src={user.avatarUrl}
            alt="user avatar"
          />
        </div> */}

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
