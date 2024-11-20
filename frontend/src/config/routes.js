export const routes = [
    {
      path: '/',
      name: 'Dashboard',
      icon: 'HomeIcon',
    },
    {
      path: '/devices',
      name: 'Device Registration',
      icon: 'BarcodeIcon',
    },
    {
      path: '/boxing',
      name: 'Boxing Process',
      icon: 'BoxIcon',
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: 'ChartBarIcon',
    },
  ];
  
  export const getRoute = (path) => routes.find(route => route.path === path);