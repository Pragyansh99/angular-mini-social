import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../providers/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  postText ='';
  title = '';
  post: Post;
  post_form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId

  constructor(private postService: PostService, public routes: ActivatedRoute) { }

  ngOnInit(): void {
    this.post_form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {
        validators:[Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.routes.paramMap.subscribe((params: ParamMap) => {
      if(params.has('postId')) {
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.postService.getPost(this.postId).subscribe((response) => {
          this.post = response.data
          this.post_form.patchValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        }, (error) => {
          this.post = null;
        })
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  uploadPost() {
    if(this.post_form.invalid) { return; }
    if(this.mode == 'create') {
      this.postService.addPost(this.post_form.value.title, this.post_form.value.content, this.post_form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.post_form.value.title, this.post_form.value.content, this.post_form.value.image);
    }
    this.post_form.reset();
  }

  cancelUplaod() { this.post_form.reset(); }

  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.post_form.patchValue({ 'image':file });
    this.post_form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
