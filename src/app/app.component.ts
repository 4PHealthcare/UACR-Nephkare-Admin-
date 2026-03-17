import { Component } from '@angular/core';
import {
    Router,
    NavigationEnd,
    
  } from "@angular/router";

  import { filter } from "rxjs/operators";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(public router: Router,)
    {
       
    }
    ngOnInit(): void
    {
        
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event) => {
            if(!event['url'].includes('/chat')) {
              if(window['HubSpotConversations']){ 
                window['HubSpotConversations'].widget.remove();
              }
            }
        });
    }
}
