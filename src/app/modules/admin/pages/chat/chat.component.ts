import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation  : ViewEncapsulation.None,

})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   
  }
  ngAfterViewInit() {
    if(window['HubSpotConversations']){
      window['hsConversationsSettings'] = {
        loadImmediately: true,
        inlineEmbedSelector: '#hubspot-conversations-inline-parent',
        enableWidgetCookieBanner: true,
        disableAttachment: true
      };
      
      window['HubSpotConversations'].widget.load();    
    }
  }

  ngOnDestroy(): void {
    if(window['HubSpotConversations']){ 
      window['HubSpotConversations'].widget.remove();
    }
  }


}
