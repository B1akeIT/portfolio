// import { INavData } from '@coreui/angular';
import { INavData } from '@app/components/coreui';

export const navItemsAdmin: INavData[] = [
  {
    // title: true,
    name: 'APP.MENU.administrator',
    // url: '/administrator-group',
    children: [
      {
        name: 'APP.MENU.tenants',
        url: '/tenants',
        // icon: 'icon-layers'
        ionicon: 'server-outline'
      },
      {
        name: 'APP.MENU.roles-permissions',
        url: '/roles-permissions',
        // icon: 'icon-shield'
        ionicon: 'shield-checkmark-outline'
      },
      {
        name: 'APP.MENU.users',
        url: '/users',
        // icon: 'icon-user'
        ionicon: 'people-outline'
      },
      {
        name: 'APP.MENU.companies',
        url: '/companies',
        ionicon: 'business-outline'
      }
    ]
  }
];

export const navItemsDashboard: INavData[] = [
  {
    name: 'APP.MENU.dashboard',
    url: '/dashboard',
    // icon: 'icon-speedometer',
    ionicon: 'speedometer-outline',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // },
    permission: 'PUBLIC'
  },
  // {
  //   name: 'APP.MENU.activities',
  //   url: '/activities',
  //   // icon: 'icon-calendar',
  //   ionicon: 'calendar-outline',
  //   // badge: {
  //   //   variant: 'info',
  //   //   text: 'NEW'
  //   // },
  //   permission: 'PUBLIC'
  // }
];

export const navItemsUsers: INavData[] = [
  {
    // title: true,
    name: 'APP.MENU.contacts',
    // url: '/contacts-group',
    permission: 'MODULOCONTATTO',
    children: [
      {
        name: 'APP.MENU.contacts',
        url: '/contacts',
        icon: 'cui-contact',
        // ionicon: 'business-outline',
        attributes: { disabled: false },
        permission: 'MENUCONTATTO'
      }
    ]
  },
  {
    // title: true,
    name: 'APP.MENU.warehouse',
    // url: '/warehouse-group',
    permission: 'MODULOMAGAZZINO',
    children: [
      {
        name: 'APP.MENU.price-lists',
        url: '/price-lists',
        ionicon: 'list-outline',
        attributes: { disabled: true },
        permission: 'MENULISTINI'
      },
      {
        name: 'APP.MENU.warehouse-items',
        url: '/warehouse',
        ionicon: 'cube-outline',
        attributes: { disabled: true },
        permission: 'MENUARTICOLO'
      },
      {
        name: 'APP.MENU.item-history',
        url: '/warehouse',
        ionicon: 'timer-outline',
        attributes: { disabled: true },
        permission: 'MENUARTICOLO'
      },
      {
        name: 'APP.MENU.movements',
        url: '/warehouse',
        ionicon: 'move-outline',
        attributes: { disabled: true },
        permission: 'MENUARTICOLO'
      },
      {
        name: 'APP.MENU.packing-lists',
        url: '/packing-lists',
        ionicon: 'barcode-outline',
        attributes: { disabled: true },
        permission: 'MENUARTICOLO'
      },
    ]
  },
  {
    // title: true,
    name: 'APP.MENU.quotes',
    // url: '/quotes-group',
    permission: 'MODULOPREVENTIVI',
    children: [
      {
        name: 'APP.MENU.quotes',
        url: '/quotes',
        ionicon: 'wallet-outline',
        attributes: { disabled: false },
        permission: 'MENUPREVENTIVO'
      }
    ]
  },
  {
    // title: true,
    name: 'APP.MENU.orders',
    // url: '/orders-group',
    permission: 'MODULOORDINI',
    children: [
      {
        name: 'APP.MENU.client_orders',
        url: '/client-orders',
        ionicon: 'cart-outline',
        attributes: { disabled: false },
        permission: 'MENUORDINECLI'
      },
      {
        name: 'APP.MENU.orders_suppliers',
        url: '/orders-suppliers',
        ionicon: 'cart-outline',
        attributes: { disabled: false },
        permission: 'MENUORDINEFOR'
      }
    ]
  },
  // {
  //   name: 'APP.MENU.adv-campaigns',
  //   url: '/campaigns',
  //   ionicon: 'people-circle-outline',
  //   attributes: { disabled: true },
  // },
  {
    // title: true,
    name: 'APP.MENU.transport-documents',
    // url: '/quotes-group',
    permission: 'MODULODDT',
    children: [
      {
        name: 'APP.MENU.transport-documents',
        url: '/ddt',
        ionicon: 'document-text-outline',
        attributes: { disabled: false },
        permission: 'MENUDDT'
      }
    ]
  },
  {
    // title: true,
    name: 'APP.MENU.invoices',
    // url: '/quotes-group',
    permission: 'MODULOFATTURA',
    children: [
      {
        name: 'APP.MENU.invoices',
        url: '/invoices',
        ionicon: 'logo-euro',
        attributes: { disabled: false },
        permission: 'MENUFATTURA'
      },
      {
        name: 'APP.MENU.deadlines',
        url: '/deadlines',
        ionicon: 'today-outline',
        attributes: { disabled: true },
        permission: 'MENUARTICOLO'
      },
    ]
  },
  {
    // title: true,
    name: 'APP.MENU.configuration',
    // url: '/configuration-group',
    permission: 'MODULOCONFIGURAZIONE',
    children: [
      {
        name: 'APP.MENU.configuration',
        url: '/tables',
        // icon: 'icon-outline',
        ionicon: 'list-outline',
        permission: 'MODULOCONFIGURAZIONE'
      }
    ]
  }
];

export const navItemsDevelop: INavData[] = [
  {
    divider: true
  },
  {
    name: 'Develop',
    url: '/develop',
    icon: 'icon-bulb'
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cards',
        url: '/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Navbars',
        url: '/base/navbars',
        icon: 'icon-puzzle'
      },
      {
        name: 'Pagination',
        url: '/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/base/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/base/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Brand Buttons',
        url: '/buttons/brand-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Disabled',
    url: '/dashboard',
    icon: 'icon-ban',
    badge: {
      variant: 'secondary',
      text: 'NEW'
    },
    attributes: { disabled: true },
  }
];
