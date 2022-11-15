import React from 'react';

const course = React.lazy(() => import('./views/Course/view'))
const term = React.lazy(() => import('./views/Term/View'))
const home = React.lazy(() => import('./views/Home'))
const EditProfile = React.lazy(() => import('./views/EditProfile/EditProfile'))
const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'))
const dashboard_C = React.lazy(() => import('./views/Dashboard/Dashboard-Course'))
const teaching = React.lazy(() => import('./views/Teaching/View'))
const teaching_video = React.lazy(() => import('./views/Teaching/ViewVideo'))

const routes = [
    { path: '/', exact: true, name: 'Home', component: home },
    { path: '/EditProfile', exact: true, name: 'EditProfile', component: EditProfile },
    { path: '/Dashboard-C/:course_key', exact: true, name: 'Dashboard-Course', component: dashboard_C },
    { path: '/course/:course_key', exact: true, name: 'Course', component: course },
    { path: '/course/term/:course_key/:term_key', exact: true, name: 'Term', component: term },
    { path: '/course/term/dashboard/:course_key/:term_key/:teaching_key', exact: true, name: 'Dashboard', component: dashboard },
    { path: '/course/term/teaching/:course_key/:term_key/:teaching_key', exact: true, name: 'Teaching', component: teaching },
    { path: '/course/term/teaching-video/:course_key/:term_key/:teaching_key', exact: true, name: 'TeachingVideo', component: teaching_video },
];

export default routes;