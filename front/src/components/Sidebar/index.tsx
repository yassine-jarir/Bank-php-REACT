import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
 import Logo from '../../images/bank.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
  
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 pb-0">
        <NavLink to="/AddAccount" className="flex gap-4 justify-center items-center" style={{    display: "flex",justifyContent: "center",alignItems: "center",width: "100%"}}>

        <img width={80} height={80} src={Logo} alt="bank logo" />
        <strong className=' text-[1.9rem] text-white'>NeoBank</strong>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
        <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M617.1 671.2H148.2c-46.3 0-83.9-37.6-83.9-83.9v-307c0-46.3 37.6-83.9 83.9-83.9h468.9c46.3 0 83.9 37.6 83.9 83.9v306.9c0 46.4-37.5 84-83.9 84z" fill="#248CBE"></path><path d="M64.3 302.3h636.8v96.1H64.3z" fill="#183351"></path><path d="M304 531.8H128.3c-12.1 0-22-9.9-22-22s9.9-22 22-22H304c12.1 0 22 9.9 22 22s-9.9 22-22 22zM437.4 601.2H128.3c-12.1 0-22-9.9-22-22s9.9-22 22-22h309.1c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#FBFAEE"></path><path d="M875.8 827.6H406.9c-46.3 0-83.9-37.6-83.9-83.9v-307c0-46.3 37.6-83.9 83.9-83.9h468.9c46.3 0 83.9 37.6 83.9 83.9v306.9c0 46.4-37.5 84-83.9 84z" fill="#F5DB6F"></path><path d="M788.3 607.2H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h401.3c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#AEB8C4"></path><path d="M562.7 688.2H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h175.8c12.1 0 22 9.9 22 22-0.1 12.1-10 22-22.1 22zM696.1 757.6H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h309.1c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#FBFAEE"></path><path d="M510.4 520.3H401.8c-20.3 0-36.8-16.5-36.8-36.8v-50.8c0-20.3 16.5-36.8 36.8-36.8h108.6c20.3 0 36.8 16.5 36.8 36.8v50.8c0 20.3-16.5 36.8-36.8 36.8z" fill="#F3C262"></path><path d="M547.2 438.1h-34.3v-42.2H479v124.4h33.9v-47.7h34.3zM402.6 395.9v42.2H365v34.5h37.6v47.7h33.9V395.9z" fill="#F7A04D"></path><path d="M959.7 577.8V484c-80.6-0.3-148.2-56.4-166.1-131.6h-95.5c19.2 127.2 129.2 225.1 261.6 225.4z" fill="#F7F9DD"></path></g></svg>
        </button>
      </div>
 

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
       
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
  
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              
              <li>
                <NavLink
                  to="/AddAccount"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('AddAccount') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                        <svg viewBox="0 0 1024 1024" className="icon w-6" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M617.1 671.2H148.2c-46.3 0-83.9-37.6-83.9-83.9v-307c0-46.3 37.6-83.9 83.9-83.9h468.9c46.3 0 83.9 37.6 83.9 83.9v306.9c0 46.4-37.5 84-83.9 84z" fill="#248CBE"></path><path d="M64.3 302.3h636.8v96.1H64.3z" fill="#183351"></path><path d="M304 531.8H128.3c-12.1 0-22-9.9-22-22s9.9-22 22-22H304c12.1 0 22 9.9 22 22s-9.9 22-22 22zM437.4 601.2H128.3c-12.1 0-22-9.9-22-22s9.9-22 22-22h309.1c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#FBFAEE"></path><path d="M875.8 827.6H406.9c-46.3 0-83.9-37.6-83.9-83.9v-307c0-46.3 37.6-83.9 83.9-83.9h468.9c46.3 0 83.9 37.6 83.9 83.9v306.9c0 46.4-37.5 84-83.9 84z" fill="#F5DB6F"></path><path d="M788.3 607.2H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h401.3c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#AEB8C4"></path><path d="M562.7 688.2H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h175.8c12.1 0 22 9.9 22 22-0.1 12.1-10 22-22.1 22zM696.1 757.6H387c-12.1 0-22-9.9-22-22s9.9-22 22-22h309.1c12.1 0 22 9.9 22 22s-9.9 22-22 22z" fill="#FBFAEE"></path><path d="M510.4 520.3H401.8c-20.3 0-36.8-16.5-36.8-36.8v-50.8c0-20.3 16.5-36.8 36.8-36.8h108.6c20.3 0 36.8 16.5 36.8 36.8v50.8c0 20.3-16.5 36.8-36.8 36.8z" fill="#F3C262"></path><path d="M547.2 438.1h-34.3v-42.2H479v124.4h33.9v-47.7h34.3zM402.6 395.9v42.2H365v34.5h37.6v47.7h33.9V395.9z" fill="#F7A04D"></path><path d="M959.7 577.8V484c-80.6-0.3-148.2-56.4-166.1-131.6h-95.5c19.2 127.2 129.2 225.1 261.6 225.4z" fill="#F7F9DD"></path></g></svg>

                  Ajouter un Compte
                </NavLink>
              </li>
          
              <li>
                <NavLink
                  to="/SavingAccount"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('SavingAccount') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
             <svg className='w-6' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#394240" d="M60,56h-8V28h8c1.738,0,3.277-1.125,3.809-2.777c0.531-1.656-0.07-3.469-1.484-4.477l-28-20 c-1.391-0.992-3.258-0.992-4.648,0l-28,20c-1.414,1.008-2.016,2.82-1.484,4.477C0.723,26.875,2.262,28,4,28h8v28H4 c-2.211,0-4,1.789-4,4v4h64v-4C64,57.789,62.211,56,60,56z M20,56V28h8v28H20z M36,56V28h8v28H36z M32,8.914L47.52,20H16.48 L32,8.914z"></path> <polygon fill="#F9EBB2" points="32,8.914 47.52,20 16.48,20 "></polygon> <g> <rect x="36" y="28" fill="#506C7F" width="8" height="28"></rect> <rect x="20" y="28" fill="#506C7F" width="8" height="28"></rect> </g> </g> </g></svg>
                  Compte Épargne 
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/CurrentAccount"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('CurrentAccount') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                <svg version="1.0" id="Layer_1" className='w-6' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <rect x="18" y="25" fill="#506C7F" width="4" height="29"></rect> <rect x="30" y="25" fill="#506C7F" width="4" height="29"></rect> <rect x="42" y="25" fill="#506C7F" width="4" height="29"></rect> </g> <g> <rect x="48" y="25" fill="#B4CCB9" width="4" height="29"></rect> <rect x="24" y="25" fill="#B4CCB9" width="4" height="29"></rect> <rect x="36" y="25" fill="#B4CCB9" width="4" height="29"></rect> <rect x="12" y="25" fill="#B4CCB9" width="4" height="29"></rect> </g> <g> <path fill="#F9EBB2" d="M8,56c-1.104,0-2,0.896-2,2h52c0-1.104-0.895-2-2-2H8z"></path> <path fill="#F9EBB2" d="M60,60H4c-1.104,0-2,0.896-2,2h60C62,60.896,61.105,60,60,60z"></path> </g> <path fill="#F9EBB2" d="M4,23h56c0.893,0,1.684-0.601,1.926-1.461c0.24-0.86-0.125-1.785-0.889-2.248l-28-17 C32.725,2.1,32.365,2,32,2c-0.367,0-0.725,0.1-1.037,0.29L2.961,19.291c-0.764,0.463-1.129,1.388-0.888,2.247 C2.315,22.399,3.107,23,4,23z"></path> <g> <path fill="#394240" d="M60,58c0-2.209-1.791-4-4-4h-2V25h6c1.795,0,3.369-1.194,3.852-2.922c0.484-1.728-0.242-3.566-1.775-4.497 l-28-17C33.439,0.193,32.719,0,32,0s-1.438,0.193-2.076,0.581l-28,17c-1.533,0.931-2.26,2.77-1.775,4.497 C0.632,23.806,2.207,25,4,25h6v29H8c-2.209,0-4,1.791-4,4c-2.209,0-4,1.791-4,4v2h64v-2C64,59.791,62.209,58,60,58z M4,23 c-0.893,0-1.685-0.601-1.926-1.462c-0.241-0.859,0.124-1.784,0.888-2.247l28-17.001C31.275,2.1,31.635,2,32,2 c0.367,0,0.725,0.1,1.039,0.291l28,17c0.764,0.463,1.129,1.388,0.887,2.248C61.686,22.399,60.893,23,60,23H4z M52,25v29h-4V25H52z M46,25v29h-4V25H46z M40,25v29h-4V25H40z M34,25v29h-4V25H34z M28,25v29h-4V25H28z M22,25v29h-4V25H22z M16,25v29h-4V25H16z M8,56h48c1.105,0,2,0.896,2,2H6C6,56.896,6.896,56,8,56z M2,62c0-1.104,0.896-2,2-2h56c1.105,0,2,0.896,2,2H2z"></path> <path fill="#394240" d="M32,9c-2.762,0-5,2.238-5,5s2.238,5,5,5s5-2.238,5-5S34.762,9,32,9z M32,17c-1.656,0-3-1.343-3-3 s1.344-3,3-3c1.658,0,3,1.343,3,3S33.658,17,32,17z"></path> </g> <circle fill="#F76D57" cx="32" cy="14" r="3"></circle> </g> </g></svg>
                  Compte Courant 
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/BuisnessAccount"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('BuisnessAccount') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z"
                      fill=""
                    />
                  </svg>
                  Compte Entreprise
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
       </div>
    </aside>
  );
};

export default Sidebar;
