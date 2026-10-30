// One route per view. The app keeps its state across them (see CueShell).
export const VIEW_TO_PATH = {
  home: '/',
  library: '/library',
  components: '/components',
  builder: '/builder',
  why: '/plans',
};

export function pathToView(pathname) {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  const hit = Object.entries(VIEW_TO_PATH).find(([, path]) => path === p);
  return hit ? hit[0] : 'home';
}
