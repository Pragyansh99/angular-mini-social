import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { Post } from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private _posts: Post[] = [];
  private _updatedPosts = new Subject<{ posts:Post[], postCount:number}>();

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getPostsListner() {
    return this._updatedPosts.asObservable();
  }

  getPosts(pagesize: number, page: number) {
    const queryParams =`?currentpage=${page}&pagesize=${pagesize}`;
    this.http.get<{ message: string, data: Post[], postCount: number }>(this.baseUrl + 'api/posts' + queryParams)
      .subscribe(response => {
        this.toastr.success(response.message);
        this._posts = response.data;
        this._updatedPosts.next({ posts:[...this._posts], postCount:response.postCount });
      }, error => {
        // this.toastr.error(error.message)
      })
  }

  getPost(postId: string) {
    return this.http.get<{ message: string, data: Post }>(this.baseUrl + 'api/posts/'+postId)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);
    this.http.post<{ message: string, post: Post }>(this.baseUrl + 'api/posts', postData)
      .subscribe((response) => {
        this.toastr.success(response.message);
        // const post: Post = { _id: response.post._id, title: title, content: content, imagePath: response.post.imagePath };
        // this._posts.push(post);
        // this._updatedPosts.next([...this._posts]);
        this.router.navigate(['/'])
      }, (error) => {
        // this.toastr.error(error.error.message)
      })
  }

  updatePost(id:string,  title:string, content:string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) == 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { _id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http.put<{ message: string, post: Post  }>(this.baseUrl + 'api/posts/'+id, postData)
      .subscribe((response) => {
        this.toastr.success(response.message);
        // const post: Post = { _id: id, title: title, content: content, imagePath: response.post.imagePath };
        // const updatePost = [...this._posts];
        // const oldPostIndex = updatePost.findIndex(x => x._id === id);
        // updatePost[oldPostIndex] = post;
        // this._posts = updatePost;
        // this._updatedPosts.next([...this._posts]);
        this.router.navigate(['/'])
      }, (error) => {
        // this.toastr.error(error.error.message)
      })
  }

  deletePost(id: string) {
    return this.http.delete(this.baseUrl + 'api/posts/' + id)
      // .subscribe(response => {
      //   const updatedPosts = this._posts.filter(x => x._id !== id);
      //   this._posts = updatedPosts
      //   this._updatedPosts.next([...this._posts]);
      // }, error => { })
  }

}
