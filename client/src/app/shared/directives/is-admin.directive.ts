import { Directive, effect, inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../core/services/account.service';

@Directive({
  selector: '[appIsAdmin]', //*appIsAdmin
  standalone: true
})
export class IsAdminDirective{

  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  constructor() {
    effect(()=>{
      if(this.accountService.isAdmin())
        {
          // allows element to be displayed in browser
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
        else{
          this.viewContainerRef.clear();
        }
    });
   }

}
