'use client';
import { useSyncExternalStore } from 'react';
import {
  BottomNavigation,
  BottomNavigationHighlight,
  BottomNavigationHighlightItem,
  BottomNavigationItem,
  BottomNavigationLabel,
} from '@animate-ui/react/primitives/bottom-navigation';

const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="size-[22px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.75]"
  >
    {children}
  </svg>
);

const ITEMS = [
  { value: 'home', href: '/', label: 'Home', icon: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" /> },
  {
    value: 'library',
    href: '/library',
    label: 'Library',
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="2" />
        <rect x="13" y="4" width="7" height="7" rx="2" />
        <rect x="4" y="13" width="7" height="7" rx="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" />
      </>
    ),
  },
  {
    value: 'components',
    href: '/components',
    label: 'Components',
    icon: (
      <>
        <path d="m12 4 8 4-8 4-8-4z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </>
    ),
  },
  {
    value: 'builder',
    href: '/builder',
    label: 'Builder',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M12 8.5v7M8.5 12h7" />
      </>
    ),
  },
  {
    value: 'plans',
    href: '/plans',
    label: 'Plans',
    icon: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="3" />
        <path d="M3.5 10h17M7 14.5h3" />
      </>
    ),
  },
];

// Phone tab bar (under 768px), built on Animate UI's Bottom Navigation.
// The highlight slides to the current page; scrolling down shrinks the bar to its icons
// and scrolling up brings the labels back. Reduced motion makes both instant.
const PHONE = '(max-width: 767px)';
const subscribe = (cb) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const usePhone = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(PHONE).matches, () => false);

export default function CueTabBar({ active, nav }) {
  // Only mounted on phones: its animations must not run on a bar that is not shown.
  const phone = usePhone();
  if (!phone) return null;
  return (
    <BottomNavigation
      value={active}
      scrollBehavior="minimize"
      aria-label="Main"
      className="cue-tabbar fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-60 mx-auto w-fit"
    >
      <BottomNavigationHighlight className="absolute inset-y-1.5 inset-x-0 rounded-full bg-raised">
        <ul className="m-0 flex list-none rounded-full border border-raised bg-[rgba(10,10,10,.82)] p-1.5 backdrop-blur-[14px]">
          {ITEMS.map((item) => (
            <li key={item.value}>
              <BottomNavigationHighlightItem value={item.value}>
                <BottomNavigationItem
                  value={item.value}
                  href={item.href}
                  onClick={nav[item.value]}
                  className="flex h-[52px] w-[min(4.25rem,calc((100vw-48px)/5))] flex-col items-center justify-center rounded-full pt-[3px] text-muted no-underline transition-colors duration-150 data-[state=active]:text-accent data-[minimized]:h-11 data-[minimized]:w-12 data-[minimized]:pt-0"
                >
                  <Icon>{item.icon}</Icon>
                  <BottomNavigationLabel className="block pt-[3px] text-[11px] leading-none font-medium">
                    {item.label}
                  </BottomNavigationLabel>
                </BottomNavigationItem>
              </BottomNavigationHighlightItem>
            </li>
          ))}
        </ul>
      </BottomNavigationHighlight>
    </BottomNavigation>
  );
}
