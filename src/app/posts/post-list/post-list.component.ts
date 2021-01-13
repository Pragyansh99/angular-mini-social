import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostService } from '../../providers/post.service';
import { AuthService } from '../../providers/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {


  private authListnerSubscription: Subscription

  isUserAuthenticated = false;
  posts: Post[] = [];
  postSub: Subscription;
  userId: string;
  totalPost = 10;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];

  constructor(private postService: PostService, private auth: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.auth.getUserId();
    this.postSub = this.postService.getPostsListner()
      .subscribe((postsData: { posts:Post[], postCount:number}) => {
        this.posts = postsData.posts;
        this.totalPost = postsData.postCount;
      });
    this.isUserAuthenticated = this.auth.getIsAuthenticated();
    this.authListnerSubscription = this.auth.getAuthStatus().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated
      this.userId = this.auth.getUserId();
    });

  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListnerSubscription.unsubscribe();
  }

  onDelete(id) {
    this.postService.deletePost(id).subscribe((response) => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    }, error => { this.toastr.error(error.error.message) })
  }

  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

}
