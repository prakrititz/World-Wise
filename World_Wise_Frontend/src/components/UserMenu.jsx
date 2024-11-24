import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserMenu({ user, logout }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center">
        {user.picture && (
          <img 
            src={user.picture} 
            alt="Profile" 
            className="w-8 h-8 rounded-full ring-2 ring-[#146eb4] cursor-pointer hover:opacity-80 transition-opacity duration-200"
          />
        )}
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-[#146eb4]">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          <div className="px-2 py-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-[#146eb4] text-white' : 'text-gray-700'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors duration-150`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )};
  