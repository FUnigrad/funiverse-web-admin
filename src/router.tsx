import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(lazy(() => import('src/content/applications/Messenger')));
const Transactions = Loader(lazy(() => import('src/content/applications/Transactions')));
const UserProfile = Loader(lazy(() => import('src/content/applications/Users/profile')));
const UserSettings = Loader(lazy(() => import('src/content/applications/Users/settings')));

// Components

const Buttons = Loader(lazy(() => import('src/content/pages/Components/Buttons')));
const Modals = Loader(lazy(() => import('src/content/pages/Components/Modals')));
const Accordions = Loader(lazy(() => import('src/content/pages/Components/Accordions')));
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(lazy(() => import('src/content/pages/Components/Badges')));
const Tooltips = Loader(lazy(() => import('src/content/pages/Components/Tooltips')));
const Avatars = Loader(lazy(() => import('src/content/pages/Components/Avatars')));
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status

const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));

// FUniverse
const GroupPage = Loader(lazy(() => import('src/pages/Group')));
const UserPage = Loader(lazy(() => import('src/pages/User')));
const CurriculumPage = Loader(lazy(() => import('src/pages/Curriculum')));
const CurriculumFormPage = Loader(lazy(() => import('src/pages/Curriculum/CurriculumForm')));
const CurriculumDetailPage = Loader(lazy(() => import('src/pages/Curriculum/CurriculumDetail')));
const SyllabusPage = Loader(lazy(() => import('src/pages/Syllabus')));
const SyllabusFormPage = Loader(lazy(() => import('src/pages/Syllabus/SyllabusForm')));
const SyllabusDetailPage = Loader(lazy(() => import('src/pages/Syllabus/SyllabusDetail')));
const SubjectPage = Loader(lazy(() => import('src/pages/Subject')));
const MajorPage = Loader(lazy(() => import('src/pages/Major')));
const SpecializationPage = Loader(lazy(() => import('src/pages/Specialization')));
const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/groups" replace />,
      },
      // {
      //   path: 'overview',
      //   element: <Navigate to="/" replace />,
      // },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />,
          },
          {
            path: '404',
            element: <Status404 />,
          },
          {
            path: '500',
            element: <Status500 />,
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />,
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />,
          },
        ],
      },
      {
        path: '*',
        element: <Status404 />,
      },
    ],
  },
  {
    path: 'groups',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <GroupPage />,
      },
    ],
  },
  {
    path: 'users',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <UserPage />,
      },
    ],
  },
  {
    path: 'subjects',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SubjectPage />,
      },
    ],
  },
  {
    path: 'majors',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <MajorPage />,
      },
    ],
  },
  {
    path: 'specializations',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SpecializationPage />,
      },
    ],
  },
  {
    path: 'syllabi',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SyllabusPage />,
      },
      {
        path: ':slug',
        element: <SyllabusDetailPage />,
      },
      {
        path: 'create',
        element: <SyllabusFormPage />,
      },
      {
        path: ':slug/edit',
        element: <SyllabusFormPage />,
      },
    ],
  },
  {
    path: 'curriculums',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <CurriculumPage />,
      },
      {
        path: ':slug',
        element: <CurriculumDetailPage />,
      },
      {
        path: 'create',
        element: <CurriculumFormPage />,
      },
      {
        path: ':slug/edit',
        element: <CurriculumFormPage />,
      },
    ],
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="crypto" replace />,
      },
      {
        path: 'crypto',
        element: <Crypto />,
      },
      {
        path: 'messenger',
        element: <Messenger />,
      },
    ],
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="transactions" replace />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />,
          },
          {
            path: 'details',
            element: <UserProfile />,
          },
          {
            path: 'settings',
            element: <UserSettings />,
          },
        ],
      },
    ],
  },
  {
    path: '/components',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="buttons" replace />,
      },
      {
        path: 'buttons',
        element: <Buttons />,
      },
      {
        path: 'modals',
        element: <Modals />,
      },
      {
        path: 'accordions',
        element: <Accordions />,
      },
      {
        path: 'tabs',
        element: <Tabs />,
      },
      {
        path: 'badges',
        element: <Badges />,
      },
      {
        path: 'tooltips',
        element: <Tooltips />,
      },
      {
        path: 'avatars',
        element: <Avatars />,
      },
      {
        path: 'cards',
        element: <Cards />,
      },
      {
        path: 'forms',
        element: <Forms />,
      },
    ],
  },
];

export default routes;
