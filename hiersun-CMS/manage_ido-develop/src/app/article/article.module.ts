import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { HttpModule, JsonpModule } from '@angular/http';

import { ArtComponent } from './art/art.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from 'ng2-ckeditor';
import { routes } from './article-routing.module';
import { SensitiveComponent } from './sensitive/sensitive.component';
import { ArtsnodifyComponent } from './artsmodify/artsmodify.component';

import { SwiperadminComponent } from './swiperadmin/swiperadmin.component';
import { AddswiperComponent } from './addswiper/addswiper.component';
import { CompileComponent } from './compile/compile.component';


import { ArtaddtypeComponent } from './artaddtype/artaddtype.component';
import { ArtaddComponent } from './artadd/artadd.component';
import { ArtmodifysubclassesComponent } from './artmodifysubclasses/artmodifysubclasses.component';
import { ArtmodifyComponent } from './artmodify/artmodify.component';
import { ArtClassifyComponent } from './artlists/artlists.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CommentComponent } from './comment/comment.component';
import { ArttagComponent } from './arttag/arttag.component';
import { AddartagComponent } from './arttag/addartag/addartag.component';
import { ArtactivityComponent } from './artactivity/artactivity.component';
import { AddartactivityComponent } from './artactivity/addartactivity/addartactivity.component';

@NgModule({
    imports : [
        CommonModule,
        FormsModule,
        CKEditorModule,
        NgZorroAntdModule,
        ColorPickerModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        RouterModule.forChild(routes)
    ],
    declarations : [
        ArtComponent,
        SensitiveComponent,
        ArtaddtypeComponent,
        ArtaddComponent,
        ArtmodifysubclassesComponent,
        ArtmodifyComponent,
        ArtClassifyComponent,
        CommentComponent,
        ArtsnodifyComponent,

        SwiperadminComponent,
        AddswiperComponent,
        CompileComponent,
        StatisticsComponent,
        ArttagComponent,
        AddartagComponent,
        ArtactivityComponent,
        AddartactivityComponent
    ]
})

export class ArticleModule {  }
