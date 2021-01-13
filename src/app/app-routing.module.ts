import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './providers/auth.guard';

const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'feeds' },
  { path:'feeds', component: PostListComponent, canActivate: [AuthGuard] },
  { path:'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path:'edit/:postId', component: PostCreateComponent },
  { path:'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path:'**', redirectTo:"login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
