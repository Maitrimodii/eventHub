  import React, { useEffect, useMemo, useState } from 'react';
  import { Link } from 'react-router-dom';
  import { Dialog } from '@headlessui/react';
  import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
  import { useDispatch, useSelector } from 'react-redux';
  import Notifications from './Notifications';
  import { addNotification } from '../actions/notificationActions';
  import { clearSocket, setSocket } from '../actions/socketActions';
  import io from 'socket.io-client';

  const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.userLogin.userInfo);
    const userRole = isAuthenticated ? isAuthenticated.role : null;
    const isChatOpen = useSelector((state) => state.chat.isChatOpen);
    
    const userLogin = useSelector((state) => state.userLogin);
    const userInfo = userLogin.userInfo;
  
    console.log(isChatOpen);
    const navigation = [
      { name: 'Home', href: '/' },
      { name: 'SignUp', href: '/signup' },
      { name: 'Login', href: '/login' },
    ];

    const organiserRoutes = [
      { name: 'My Event', href: '/MyEvent' },
      { name: 'Create Event', href: '/create-event' },
      { name: 'Scan',href:'/scanQr'},
      { name: 'Upload File', href: '/upload-file'},
      { name: 'Resources', href: '/view-resources'},
      { name: 'Chat', href: '/chat'}
    ];

    const attendeeRoutes = [
      { name: 'View Events', href: '/AllEvent' },
      { name: 'Resources', href: '/view-resources' },
      { name: 'Chat', href: '/chat'},
      { name: 'Calendar', href: '/calendar'},
    ];
    // const socketUrl = 'http://localhost:5000';
    // const socket = useMemo(() => io(socketUrl), []);
  
    useEffect(() => {
      const socketUrl = 'http://localhost:5000';
      const socket = io(socketUrl);
      dispatch(setSocket(socket));

      console.log(socket);
      socket.on('connection', () => {
        console.log('Connected to server');
      });

      if(userInfo){
      socket.emit('addUser', userInfo._id);
      console.log('Emitting addUser for current user:', userInfo._id);
      }
      socket.on('getMessage', ({ senderId, message: newMessage }) => {
        console.log('Received message:', newMessage, 'from sender:', senderId);

        if (!isChatOpen) {
          dispatch(addNotification({
            senderId,
            message: 'You have a new message',
          }));
          console.log("Notifications")
        }
      });
    
      return () => {
        socket.disconnect();
        dispatch(clearSocket());
      };
    }, [dispatch, isChatOpen]);

    return (
      <div >
       <header className="z-50 inset-x-0 top-0 bg-white text-darkerSecondary shadow-md px-6 lg:px-12 ">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link to='/' className="text-xl font-semibold leading-6"><div class="font-bold text-gray-700 uppercase">Event<span className='text-darkerSecondary'>Hub</span></div></Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4 px-6 lg:px-0">
              {isAuthenticated ? (
                <>
                  {userRole === 'organiser' && organiserRoutes.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm font-semibold leading-6 text-darkerSecondary hover:text-secondary px-2 py-1 rounded-md transition duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Notifications />
                  {userRole === 'attendee' && attendeeRoutes.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm font-semibold leading-6 text-darkerSecondary hover:text-secondary px-2 py-1 rounded-md transition duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm font-semibold leading-6 text-darkerSecondary hover:text-secondary px-2 py-1 rounded-md transition duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </nav>
          <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6 text-darkerSecondary" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                  {isAuthenticated ? (
                <>
                {userRole === 'organiser' && organiserRoutes.map((item) => (
                    <Link key={item.name} to={item.href} className=" block rounded-lg px-3 py-2 text-darkerSecondary font-semibold leading-7 hover:bg-gray-50">
                      {item.name}
                    </Link>
                  ))}
                  {userRole === 'attendee' && attendeeRoutes.map((item) => (
                    <Link key={item.name} to={item.href} className="block rounded-lg px-3 py-2 text-darkerSecondary font-semibold leading-7 hover:bg-gray-50 ">
                      {item.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {navigation.map((item) => (
                    <Link key={item.name} to={item.href} className="block rounded-lg px-3 py-2 text-darkerSecondary font-semibold leading-7 hover:bg-gray-50">
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
      </div>
    );
  };

  export default Header;