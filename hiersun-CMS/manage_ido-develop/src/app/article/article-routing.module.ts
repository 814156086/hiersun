import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtComponent } from './art/art.component';
import { ArtsnodifyComponent } from './artsmodify/artsmodify.component';
import { SensitiveComponent } from './sensitive/sensitive.component';

import { SwiperadminComponent } from './swiperadmin/swiperadmin.component';
import { AddswiperComponent } from './addswiper/addswiper.component';
import { CompileComponent } from './compile/compile.component';

import { ArtaddtypeComponent } from './artaddtype/artaddtype.component';
import { ArtaddComponent } from './artadd/artadd.component';
import { ArtmodifysubclassesComponent } from './artmodifysubclasses/artmodifysubclasses.component';
import { ArtmodifyComponent } from './artmodify/artmodify.component';
import { ArtClassifyComponent } from './artlists/artlists.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ArttagComponent } from './arttag/arttag.component';
import { AddartagComponent } from './arttag/addartag/addartag.component';
import { CommentComponent } from './comment/comment.component';
import { ArtactivityComponent } from './artactivity/artactivity.component';
import { AddartactivityComponent } from './artactivity/addartactivity/addartactivity.component';


export const routes: Routes = [
    {
        path: 'classify',
        component: ArtComponent
    },
    {
        path: 'sensitive',
        component: SensitiveComponent
    },
    {
        path: 'art/:id',
        component: ArtsnodifyComponent
    },
    {
        path: 'swiperadmin',
        component: SwiperadminComponent
    },
    {
        path: 'addswiper',
        component: AddswiperComponent
    },
    {
        path: 'compile',
        component: CompileComponent
    },
    {

        path: 'addf',
        component: ArtaddtypeComponent
    },
    {
        path: 'addcmt',
        component: ArtaddComponent
    },
    {
        path: 'artc/:id',
        component: ArtmodifysubclassesComponent
    },
    {
        path: 'artd',
        component: ArtmodifyComponent
    },
    {
        path: 'artclassify',
        component: ArtClassifyComponent
    },
    {
        path: 'statistics',
        component: StatisticsComponent
    },
    {
        path: 'arttag',
        component: ArttagComponent
    },
    {
        path: 'arttag/addartag',
        component: AddartagComponent
    },
    {
        path: 'comment',
        component: CommentComponent
    },
    {
        path: 'artactivity',
        component: ArtactivityComponent
    },
    {
        path: 'artactivity/addartactivity',
        component: AddartactivityComponent
    }
];
