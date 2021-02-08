import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppinitService {

  constructor() { }

  Init() {
    return new Promise<void>((resolve, reject) => {
      console.log("App Init Starts ===>>>", new Date().getMilliseconds());
      ////do your initialisation stuff here
      setTimeout(() => {
        console.log('App Init Finished ===>>>', new Date().getMilliseconds());
        resolve();
      }, 2000);
    });
  }

}
