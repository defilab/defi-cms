export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Auth/Login' },
      { path: '/user/register', component: './Auth/Register' },
      { path: '/user/register-result', component: './Auth/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['none'], // TODO: change this role on server side
    routes: [
      { path: '/', redirect: '/organizations' },
      {
        path: '/organizations',
        name: 'organization',
        icon: 'profile',
        component: './Organization/List'
      },
      {
        path: '/organizations/:namespace',
        component: './Organization/Layout',
        routes: [
          {
            path: '/organizations/:namespace',
            redirect: '/organizations/:namespace/info'
          },
          {
            path: '/organizations/:namespace/info',
            component: './Organization/Info/View'
          },
          {
            path: '/organizations/:namespace/specs',
            component: './Organization/DataSpec/List'
          },
          {
            path: '/organizations/:namespace/specs/:spec',
            component: './Organization/DataSpec/View'
          },
          {
            path: '/organizations/:namespace/specs/:spec/edit',
            component: './Organization/DataSpec/Edit'
          },
          {
            path: '/organizations/:namespace/requests',
            component: './Organization/Request/List'
          },
          {
            path: '/organizations/:namespace/responses',
            component: './Organization/Response/List'
          },
          {
            path: '/organizations/:namespace/transactions',
            component: './Organization/Transaction/List'
          }
        ]
      },
    ],
  },
];
