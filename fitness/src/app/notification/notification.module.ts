import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationRoutingModule } from './notification-routing-module';
import { SharedModule } from '../shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    NotificationComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ]
})
export class NotificationModule { }
