import{W as w,b as q,g as G}from"./chunk-MXZOQRY5.js";import{$a as d,Ab as k,Bb as W,Ca as U,D as A,Dc as Y,Ha as I,J as N,Ka as j,Mc as F,N as T,R as M,Ub as $,Vb as B,W as b,ba as v,ea as L,eb as g,f as y,fa as O,ha as E,ja as m,ka as x,lc as V,oa as P,pa as D,r as f,rb as z,s as R,x as u,xb as H}from"./chunk-55L6EDGV.js";var tt=["*"],S;function et(){if(S===void 0&&(S=null,typeof window<"u")){let r=window;r.trustedTypes!==void 0&&(S=r.trustedTypes.createPolicy("angular#components",{createHTML:c=>c}))}return S}function _(r){return et()?.createHTML(r)||r}function J(r){return Error(`Unable to find icon with the name "${r}"`)}function nt(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function K(r){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${r}".`)}function Q(r){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${r}".`)}var a=class{constructor(c,t,e){this.url=c,this.svgText=t,this.options=e}},it=(()=>{class r{constructor(t,e,n,i){this._httpClient=t,this._sanitizer=e,this._errorHandler=i,this._svgIconConfigs=new Map,this._iconSetConfigs=new Map,this._cachedIconsByUrl=new Map,this._inProgressUrlFetches=new Map,this._fontCssClassesByAlias=new Map,this._resolvers=[],this._defaultFontSetClass=["material-icons","mat-ligature-font"],this._document=n}addSvgIcon(t,e,n){return this.addSvgIconInNamespace("",t,e,n)}addSvgIconLiteral(t,e,n){return this.addSvgIconLiteralInNamespace("",t,e,n)}addSvgIconInNamespace(t,e,n,i){return this._addSvgIconConfig(t,e,new a(n,null,i))}addSvgIconResolver(t){return this._resolvers.push(t),this}addSvgIconLiteralInNamespace(t,e,n,i){let o=this._sanitizer.sanitize(d.HTML,n);if(!o)throw Q(n);let s=_(o);return this._addSvgIconConfig(t,e,new a("",s,i))}addSvgIconSet(t,e){return this.addSvgIconSetInNamespace("",t,e)}addSvgIconSetLiteral(t,e){return this.addSvgIconSetLiteralInNamespace("",t,e)}addSvgIconSetInNamespace(t,e,n){return this._addSvgIconSetConfig(t,new a(e,null,n))}addSvgIconSetLiteralInNamespace(t,e,n){let i=this._sanitizer.sanitize(d.HTML,e);if(!i)throw Q(e);let o=_(i);return this._addSvgIconSetConfig(t,new a("",o,n))}registerFontClassAlias(t,e=t){return this._fontCssClassesByAlias.set(t,e),this}classNameForFontAlias(t){return this._fontCssClassesByAlias.get(t)||t}setDefaultFontSetClass(...t){return this._defaultFontSetClass=t,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(t){let e=this._sanitizer.sanitize(d.RESOURCE_URL,t);if(!e)throw K(t);let n=this._cachedIconsByUrl.get(e);return n?f(C(n)):this._loadSvgIconFromConfig(new a(t,null)).pipe(v(i=>this._cachedIconsByUrl.set(e,i)),u(i=>C(i)))}getNamedSvgIcon(t,e=""){let n=X(e,t),i=this._svgIconConfigs.get(n);if(i)return this._getSvgFromConfig(i);if(i=this._getIconConfigFromResolvers(e,t),i)return this._svgIconConfigs.set(n,i),this._getSvgFromConfig(i);let o=this._iconSetConfigs.get(e);return o?this._getSvgFromIconSetConfigs(t,o):R(J(n))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(t){return t.svgText?f(C(this._svgElementFromConfig(t))):this._loadSvgIconFromConfig(t).pipe(u(e=>C(e)))}_getSvgFromIconSetConfigs(t,e){let n=this._extractIconWithNameFromAnySet(t,e);if(n)return f(n);let i=e.filter(o=>!o.svgText).map(o=>this._loadSvgIconSetFromConfig(o).pipe(N(s=>{let h=`Loading icon set URL: ${this._sanitizer.sanitize(d.RESOURCE_URL,o.url)} failed: ${s.message}`;return this._errorHandler.handleError(new Error(h)),f(null)})));return A(i).pipe(u(()=>{let o=this._extractIconWithNameFromAnySet(t,e);if(!o)throw J(t);return o}))}_extractIconWithNameFromAnySet(t,e){for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.svgText&&i.svgText.toString().indexOf(t)>-1){let o=this._svgElementFromConfig(i),s=this._extractSvgIconFromSet(o,t,i.options);if(s)return s}}return null}_loadSvgIconFromConfig(t){return this._fetchIcon(t).pipe(v(e=>t.svgText=e),u(()=>this._svgElementFromConfig(t)))}_loadSvgIconSetFromConfig(t){return t.svgText?f(null):this._fetchIcon(t).pipe(v(e=>t.svgText=e))}_extractSvgIconFromSet(t,e,n){let i=t.querySelector(`[id="${e}"]`);if(!i)return null;let o=i.cloneNode(!0);if(o.removeAttribute("id"),o.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(o,n);if(o.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(o),n);let s=this._svgElementFromString(_("<svg></svg>"));return s.appendChild(o),this._setSvgAttributes(s,n)}_svgElementFromString(t){let e=this._document.createElement("DIV");e.innerHTML=t;let n=e.querySelector("svg");if(!n)throw Error("<svg> tag not found");return n}_toSvgElement(t){let e=this._svgElementFromString(_("<svg></svg>")),n=t.attributes;for(let i=0;i<n.length;i++){let{name:o,value:s}=n[i];o!=="id"&&e.setAttribute(o,s)}for(let i=0;i<t.childNodes.length;i++)t.childNodes[i].nodeType===this._document.ELEMENT_NODE&&e.appendChild(t.childNodes[i].cloneNode(!0));return e}_setSvgAttributes(t,e){return t.setAttribute("fit",""),t.setAttribute("height","100%"),t.setAttribute("width","100%"),t.setAttribute("preserveAspectRatio","xMidYMid meet"),t.setAttribute("focusable","false"),e&&e.viewBox&&t.setAttribute("viewBox",e.viewBox),t}_fetchIcon(t){let{url:e,options:n}=t,i=n?.withCredentials??!1;if(!this._httpClient)throw nt();if(e==null)throw Error(`Cannot fetch icon from URL "${e}".`);let o=this._sanitizer.sanitize(d.RESOURCE_URL,e);if(!o)throw K(e);let s=this._inProgressUrlFetches.get(o);if(s)return s;let l=this._httpClient.get(o,{responseType:"text",withCredentials:i}).pipe(u(h=>_(h)),M(()=>this._inProgressUrlFetches.delete(o)),b());return this._inProgressUrlFetches.set(o,l),l}_addSvgIconConfig(t,e,n){return this._svgIconConfigs.set(X(t,e),n),this}_addSvgIconSetConfig(t,e){let n=this._iconSetConfigs.get(t);return n?n.push(e):this._iconSetConfigs.set(t,[e]),this}_svgElementFromConfig(t){if(!t.svgElement){let e=this._svgElementFromString(t.svgText);this._setSvgAttributes(e,t.options),t.svgElement=e}return t.svgElement}_getIconConfigFromResolvers(t,e){for(let n=0;n<this._resolvers.length;n++){let i=this._resolvers[n](e,t);if(i)return ot(i)?new a(i.url,null,i.options):new a(i,null)}}static{this.\u0275fac=function(e){return new(e||r)(m(q,8),m(G),m(F,8),m(I))}}static{this.\u0275prov=L({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})();function C(r){return r.cloneNode(!0)}function X(r,c){return r+":"+c}function ot(r){return!!(r.url&&r.options)}var rt=new E("MAT_ICON_DEFAULT_OPTIONS"),st=new E("mat-icon-location",{providedIn:"root",factory:ct});function ct(){let r=x(F),c=r?r.location:null;return{getPathname:()=>c?c.pathname+c.search:""}}var Z=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],at=Z.map(r=>`[${r}]`).join(", "),lt=/^url\(['"]?#(.*?)['"]?\)$/,Nt=(()=>{class r{get color(){return this._color||this._defaultColor}set color(t){this._color=t}get svgIcon(){return this._svgIcon}set svgIcon(t){t!==this._svgIcon&&(t?this._updateSvgIcon(t):this._svgIcon&&this._clearSvgElement(),this._svgIcon=t)}get fontSet(){return this._fontSet}set fontSet(t){let e=this._cleanupFontValue(t);e!==this._fontSet&&(this._fontSet=e,this._updateFontIconClasses())}get fontIcon(){return this._fontIcon}set fontIcon(t){let e=this._cleanupFontValue(t);e!==this._fontIcon&&(this._fontIcon=e,this._updateFontIconClasses())}constructor(t,e,n,i,o,s){this._elementRef=t,this._iconRegistry=e,this._location=i,this._errorHandler=o,this.inline=!1,this._previousFontSetClass=[],this._currentIconFetch=y.EMPTY,s&&(s.color&&(this.color=this._defaultColor=s.color),s.fontSet&&(this.fontSet=s.fontSet)),n||t.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(t){if(!t)return["",""];let e=t.split(":");switch(e.length){case 1:return["",e[0]];case 2:return e;default:throw Error(`Invalid icon name: "${t}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let t=this._elementsWithExternalReferences;if(t&&t.size){let e=this._location.getPathname();e!==this._previousPath&&(this._previousPath=e,this._prependPathToReferences(e))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(t){this._clearSvgElement();let e=this._location.getPathname();this._previousPath=e,this._cacheChildrenWithExternalReferences(t),this._prependPathToReferences(e),this._elementRef.nativeElement.appendChild(t)}_clearSvgElement(){let t=this._elementRef.nativeElement,e=t.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();e--;){let n=t.childNodes[e];(n.nodeType!==1||n.nodeName.toLowerCase()==="svg")&&n.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let t=this._elementRef.nativeElement,e=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(n=>n.length>0);this._previousFontSetClass.forEach(n=>t.classList.remove(n)),e.forEach(n=>t.classList.add(n)),this._previousFontSetClass=e,this.fontIcon!==this._previousFontIconClass&&!e.includes("mat-ligature-font")&&(this._previousFontIconClass&&t.classList.remove(this._previousFontIconClass),this.fontIcon&&t.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(t){return typeof t=="string"?t.trim().split(" ")[0]:t}_prependPathToReferences(t){let e=this._elementsWithExternalReferences;e&&e.forEach((n,i)=>{n.forEach(o=>{i.setAttribute(o.name,`url('${t}#${o.value}')`)})})}_cacheChildrenWithExternalReferences(t){let e=t.querySelectorAll(at),n=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let i=0;i<e.length;i++)Z.forEach(o=>{let s=e[i],l=s.getAttribute(o),h=l?l.match(lt):null;if(h){let p=n.get(s);p||(p=[],n.set(s,p)),p.push({name:o,value:h[1]})}})}_updateSvgIcon(t){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),t){let[e,n]=this._splitIconName(t);e&&(this._svgNamespace=e),n&&(this._svgName=n),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(n,e).pipe(T(1)).subscribe(i=>this._setSvgElement(i),i=>{let o=`Error retrieving icon ${e}:${n}! ${i.message}`;this._errorHandler.handleError(new Error(o))})}}static{this.\u0275fac=function(e){return new(e||r)(g(j),g(it),U("aria-hidden"),g(st),g(I),g(rt,8))}}static{this.\u0275cmp=P({type:r,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(e,n){e&2&&(H("data-mat-icon-type",n._usingFontIcon()?"font":"svg")("data-mat-icon-name",n._svgName||n.fontIcon)("data-mat-icon-namespace",n._svgNamespace||n.fontSet)("fontIcon",n._usingFontIcon()?n.fontIcon:null),W(n.color?"mat-"+n.color:""),k("mat-icon-inline",n.inline)("mat-icon-no-color",n.color!=="primary"&&n.color!=="accent"&&n.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",Y],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],standalone:!0,features:[z,V],ngContentSelectors:tt,decls:1,vars:0,template:function(e,n){e&1&&($(),B(0))},styles:["mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}"],encapsulation:2,changeDetection:0})}}return r})(),Tt=(()=>{class r{static{this.\u0275fac=function(e){return new(e||r)}}static{this.\u0275mod=D({type:r})}static{this.\u0275inj=O({imports:[w,w]})}}return r})();export{Nt as a,Tt as b};
