import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  {
    name: 'HRM',
    icon: UsersIcon,
    children: [
      { name: 'Employees', href: '/hrm/employees', icon: UsersIcon },
      { name: 'Departments', href: '/hrm/departments', icon: BuildingOfficeIcon },
      { name: 'Positions', href: '/hrm/positions', icon: BriefcaseIcon },
      { name: 'Attendance', href: '/hrm/attendance', icon: ClockIcon },
      { name: 'Leave', href: '/hrm/leave', icon: CalendarIcon },
      { name: 'Payroll', href: '/hrm/payroll', icon: BanknotesIcon },
    ],
  },
  {
    name: 'FRM',
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Expenses', href: '/frm/expenses', icon: ReceiptPercentIcon },
      { name: 'Personal Loans', href: '/frm/personal-loans', icon: DocumentTextIcon },
      { name: 'Office Loans', href: '/frm/office-loans', icon: BanknotesIcon },
      { name: 'Profits', href: '/frm/profits', icon: ChartBarIcon },
    ],
  },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="/logo.svg"
                      alt="Xyvin ERP"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              {!item.children ? (
                                <NavLink
                                  to={item.href}
                                  className={({ isActive }) =>
                                    `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                      isActive
                                        ? 'bg-gray-50 text-primary-600'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`
                                  }
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </NavLink>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700">
                                    <item.icon
                                      className="h-6 w-6 shrink-0"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </div>
                                  <ul role="list" className="pl-8 space-y-1">
                                    {item.children.map((child) => (
                                      <li key={child.name}>
                                        <NavLink
                                          to={child.href}
                                          className={({ isActive }) =>
                                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                              isActive
                                                ? 'bg-gray-50 text-primary-600'
                                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                            }`
                                          }
                                        >
                                          <child.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                          />
                                          {child.name}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Xyvin ERP"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              isActive
                                ? 'bg-gray-50 text-primary-600'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                            }`
                          }
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700">
                            <item.icon
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </div>
                          <ul role="list" className="pl-8 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <NavLink
                                  to={child.href}
                                  className={({ isActive }) =>
                                    `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                      isActive
                                        ? 'bg-gray-50 text-primary-600'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`
                                  }
                                >
                                  <child.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {child.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 