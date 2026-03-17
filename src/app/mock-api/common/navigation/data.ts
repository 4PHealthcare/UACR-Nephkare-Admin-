/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboard',
        subtitle: 'For admin management',
        type    : 'group',  
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Overview',
                key:  'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/dashboards/project'
            },
            // {
            //     id   : 'dashboards.payments',
            //     title: 'Payments',
            //     key:  'Payments',
            //     type : 'basic',
            //     icon : 'heroicons_outline:cash',
            //     link : '/dashboards/payments'
            // },
            
            // {
            //     id   : 'apps.notes',
            //     title: 'Notes',
            //     key:  'Notes',
            //     type : 'basic',
            //     icon : 'heroicons_outline:pencil-alt',
            //     link : '/pages/notes'
            // },
            // {
            //     id   : 'dashboards.hubspot',
            //     title: 'Hub spot',
            //     key:  'Hubspot',
            //     type : 'basic',
            //     icon : 'heroicons_outline:pencil-alt',
            //     link : '/dashboards/hubspot'
            // },
            // {
            //     id   : 'apps.academy',
            //     title: 'Service Management',
            //     key  :  'Service Management',
            //     type : 'basic',
            //     icon : 'checklist',
            //     link : '/apps/academy'
            // },
            // {
            //     id      : 'apps.users',
            //     title   : 'Patient List',
            //     key     :  'Patient List',
            //     type    : 'basic',
            //     icon    : 'heroicons_outline:users',
            //     link : '/apps/users'
            // },
            // {
            //     id   : 'apps.tasks',
            //     title: 'Offers',
            //     key  :  'Offers',
            //     type : 'basic',
            //     icon : 'heroicons_outline:check-circle',
            //     link : '/apps/tasks'
            // }
            
        ]
    },
    // {
    //     id      : 'apps',
    //     title   : 'Hello Kidney Old',
    //     subtitle: 'Manage team',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:home',
    //     children: [
           
    //         // {
    //         //     id      : 'apps.customersupport',
    //         //     title   : 'Customer Support',
    //         //     key     :  'Customer Support',
    //         //     type    : 'basic',
    //         //     icon    : 'mat_solid:support_agent',
    //         //     link : '/apps/customersupport'
    //         // }, 

    //         // {
    //         //     id   : 'apps.care-team',
    //         //     title: 'Care Coordinator',
    //         //     key  :  'Care Coordinator',
    //         //     type : 'basic',
    //         //     icon : 'health_and_safety',
    //         //     link : '/apps/care-team'
    //         // },
    //         // {
    //         //     id   : 'apps.health-coach',
    //         //     title: 'Health Coach',
    //         //     key  :  'Health Coach',
    //         //     type : 'basic',
    //         //     icon : 'health_and_safety',
    //         //     link : '/apps/health-coach'
    //         // },

    //         {
    //             id   : 'apps.doctors',
    //             title: 'Doctors',
    //             key  :  'Doctors',
    //             type : 'basic',
    //             icon : 'heroicons_solid:user-add',
    //             link : '/apps/doctors'
    //         },
           

            
             
            
    //         // {
    //         //     id   : 'apps.scrumboard',
    //         //     title: 'Scrumboard',
    //         //     type : 'basic',
    //         //     icon : 'heroicons_outline:view-boards',
    //         //     link : '/apps/scrumboard'
    //         // }
            
    //     ]
    // },
    {
        id      : 'apps',
        title   : 'Nephkare',
        subtitle: 'Manage team',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.Health Workers',
                title: 'Create Licence',
                key  :  'Workers',
                type : 'basic',
                icon : 'heroicons_solid:office-building',
                link : '/apps/health-workers'
            }            
        ]
    },
    
    // {
    //     id      : 'apps',
    //     title   : 'ClinTel',
    //     subtitle: 'Manage team',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:home',
    //     children: [
    //         {
    //             id   : 'apps.license',
    //             title: 'Hospital License',
    //             key  :  'License',
    //             type : 'basic',
    //             icon : 'heroicons_solid:office-building',
    //             link : '/apps/license'
    //         }            
    //     ]
    // },
    {
        id      : 'pages',
        title   : 'More',
        subtitle: 'Account activities',
        type    : 'group',
        icon    : 'heroicons_outline:document',
        children: [
            // {
            //     id   : 'pages.chat',
            //     title: 'Chat',
            //     type : 'basic',
            //     icon : 'heroicons_outline:chat-alt',
            //     link : '/pages/chat'
            // },
            // {
            //     id   : 'pages.activities',
            //     title: 'Activities',
            //     key  :  'Activities',
            //     type : 'basic',
            //     icon : 'heroicons_outline:menu-alt-2',
            //     link : '/pages/activities'
            // },
            // {
            //     id   : 'pages.roles',
            //     title: 'Roles',
            //     type : 'basic',
            //     icon : 'heroicons_outline:menu-alt-2',
            //     link : '/pages/roles'
            // },
            // {
            //     id   : 'pages.profile',
            //     title: 'Profile',
            //     type : 'basic',
            //     icon : 'heroicons_outline:user-circle',
            //     link : '/pages/profile'
            // },
            {
                id   : 'pages.settings',
                title: 'Settings',
                key  :  'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : '/pages/settings'
            },

            {
                id   : 'pages.blogs',
                title: 'Blogs',
                type : 'basic',
                key  :  'Blogs',
                icon : 'heroicons_outline:newspaper',
                link : '/pages/blogs'
            }, 

            // {
            //     id   : 'pages.blogs',
            //     title: 'Community',
            //     type : 'basic',
            //     key  :  'Community',
            //     icon : 'heroicons_outline:user-group',
            //     link : '/pages/community'
            // }
            
            // {
            //     id      : 'apps.help-center',
            //     title   : 'Help Center',
            //     type    : 'collapsable',
            //     icon    : 'heroicons_outline:support',
            //     link    : '/apps/help-center',
            //     children: [ 
            //         {
            //             id        : 'apps.help-center.home',
            //             title     : 'Home',
            //             type      : 'basic',
            //             link      : '/apps/help-center',
            //             exactMatch: true
            //         },
            //         {
            //             id   : 'apps.help-center.faqs',
            //             title: 'FAQs',
            //             type : 'basic',
            //             link : '/apps/help-center/faqs'
            //         },
            //         {
            //             id   : 'apps.help-center.guides',
            //             title: 'Guides',
            //             type : 'basic',
            //             link : '/apps/help-center/guides'
            //         },
            //         {
            //             id   : 'apps.help-center.support',
            //             title: 'Support',
            //             type : 'basic',
            //             link : '/apps/help-center/support'
            //         }
            //     ]
            // },
            // {
            //     id      : 'pages.error',
            //     title   : 'Error',
            //     type    : 'collapsable',
            //     icon    : 'heroicons_outline:exclamation-circle',
            //     children: [
            //         {
            //             id   : 'pages.error.404',
            //             title: '404',
            //             type : 'basic',
            //             link : '/pages/error/404'
            //         },
            //         {
            //             id   : 'pages.error.500',
            //             title: '500',
            //             type : 'basic',
            //             link : '/pages/error/500'
            //         }
            //     ]
            // },
            // {
            //     id      : 'pages.invoice',
            //     title   : 'Invoice',
            //     type    : 'collapsable',
            //     icon    : 'heroicons_outline:calculator',
            //     children: [
            //         {
            //             id      : 'pages.invoice.printable',
            //             title   : 'Printable',
            //             type    : 'collapsable',
            //             children: [
            //                 {
            //                     id   : 'pages.invoice.printable.compact',
            //                     title: 'Compact',
            //                     type : 'basic',
            //                     link : '/pages/invoice/printable/compact'
            //                 },
            //                 {
            //                     id   : 'pages.invoice.printable.modern',
            //                     title: 'Modern',
            //                     type : 'basic',
            //                     link : '/pages/invoice/printable/modern'
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     id   : 'apps.file-manager',
            //     title: 'File Manager',
            //     type : 'basic',
            //     icon : 'heroicons_outline:cloud',
            //     link : '/apps/file-manager'
            // },
            
        ]
    },
    
    
    
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        tooltip : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    
    
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group'
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    
   
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    
    
];
