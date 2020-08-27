/***
 * IPv6
***/
!function(t,e){"use strict";"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):t.IPv6=e(t)}(this,function(t){"use strict";function e(t){var e=t.toLowerCase(),i=e.split(":"),n=i.length,r=8;""===i[0]&&""===i[1]&&""===i[2]?(i.shift(),i.shift()):""===i[0]&&""===i[1]?i.shift():""===i[n-1]&&""===i[n-2]&&i.pop(),n=i.length,-1!==i[n-1].indexOf(".")&&(r=7);var o;for(o=0;n>o&&""!==i[o];o++);if(r>o){for(i.splice(o,1,"0000");i.length<r;)i.splice(o,0,"0000");n=i.length}for(var f,s=0;r>s;s++){f=i[s].split("");for(var l=0;3>l&&("0"===f[0]&&f.length>1);l++)f.splice(0,1);i[s]=f.join("")}var c=-1,h=0,p=0,u=-1,v=!1;for(s=0;r>s;s++)v?"0"===i[s]?p+=1:(v=!1,p>h&&(c=u,h=p)):"0"===i[s]&&(v=!0,u=s,p=1);p>h&&(c=u,h=p),h>1&&i.splice(c,h,""),n=i.length;var a="";for(""===i[0]&&(a=":"),s=0;n>s&&(a+=i[s],s!==n-1);s++)a+=":";return""===i[n-1]&&(a+=":"),a}function i(){return t.IPv6===this&&(t.IPv6=n),this}var n=t&&t.IPv6;return{best:e,noConflict:i}});

/***
 * punycode
***/
!function(o){function e(o){throw RangeError(L[o])}function n(o,e){for(var n=o.length;n--;)o[n]=e(o[n]);return o}function t(o,e){return n(o.split(S),e).join(".")}function r(o){for(var e,n,t=[],r=0,u=o.length;u>r;)e=o.charCodeAt(r++),e>=55296&&56319>=e&&u>r?(n=o.charCodeAt(r++),56320==(64512&n)?t.push(((1023&e)<<10)+(1023&n)+65536):(t.push(e),r--)):t.push(e);return t}function u(o){return n(o,function(o){var e="";return o>65535&&(o-=65536,e+=R(o>>>10&1023|55296),o=56320|1023&o),e+=R(o)}).join("")}function i(o){return 10>o-48?o-22:26>o-65?o-65:26>o-97?o-97:x}function f(o,e){return o+22+75*(26>o)-((0!=e)<<5)}function c(o,e,n){var t=0;for(o=n?P(o/m):o>>1,o+=P(o/e);o>M*y>>1;t+=x)o=P(o/M);return P(t+(M+1)*o/(o+j))}function l(o){var n,t,r,f,l,d,s,a,p,h,v=[],g=o.length,w=0,j=I,m=A;for(t=o.lastIndexOf(F),0>t&&(t=0),r=0;t>r;++r)o.charCodeAt(r)>=128&&e("not-basic"),v.push(o.charCodeAt(r));for(f=t>0?t+1:0;g>f;){for(l=w,d=1,s=x;f>=g&&e("invalid-input"),a=i(o.charCodeAt(f++)),(a>=x||a>P((b-w)/d))&&e("overflow"),w+=a*d,p=m>=s?C:s>=m+y?y:s-m,!(p>a);s+=x)h=x-p,d>P(b/h)&&e("overflow"),d*=h;n=v.length+1,m=c(w-l,n,0==l),P(w/n)>b-j&&e("overflow"),j+=P(w/n),w%=n,v.splice(w++,0,j)}return u(v)}function d(o){var n,t,u,i,l,d,s,a,p,h,v,g,w,j,m,E=[];for(o=r(o),g=o.length,n=I,t=0,l=A,d=0;g>d;++d)v=o[d],128>v&&E.push(R(v));for(u=i=E.length,i&&E.push(F);g>u;){for(s=b,d=0;g>d;++d)v=o[d],v>=n&&s>v&&(s=v);for(w=u+1,s-n>P((b-t)/w)&&e("overflow"),t+=(s-n)*w,n=s,d=0;g>d;++d)if(v=o[d],n>v&&++t>b&&e("overflow"),v==n){for(a=t,p=x;h=l>=p?C:p>=l+y?y:p-l,!(h>a);p+=x)m=a-h,j=x-h,E.push(R(f(h+m%j,0))),a=P(m/j);E.push(R(f(a,0))),l=c(t,w,u==i),t=0,++u}++t,++n}return E.join("")}function s(o){return t(o,function(o){return E.test(o)?l(o.slice(4).toLowerCase()):o})}function a(o){return t(o,function(o){return O.test(o)?"xn--"+d(o):o})}var p="object"==typeof exports&&exports,h="object"==typeof module&&module&&module.exports==p&&module,v="object"==typeof global&&global;(v.global===v||v.window===v)&&(o=v);var g,w,b=2147483647,x=36,C=1,y=26,j=38,m=700,A=72,I=128,F="-",E=/^xn--/,O=/[^ -~]/,S=/\x2E|\u3002|\uFF0E|\uFF61/g,L={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},M=x-C,P=Math.floor,R=String.fromCharCode;if(g={version:"1.2.3",ucs2:{decode:r,encode:u},decode:l,encode:d,toASCII:a,toUnicode:s},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define(function(){return g});else if(p&&!p.nodeType)if(h)h.exports=g;else for(w in g)g.hasOwnProperty(w)&&(p[w]=g[w]);else o.punycode=g}(this);

/***
 * SecondLevelDomains
***/
!function(o,e){"use strict";"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):o.SecondLevelDomains=e(o)}(this,function(o){"use strict";var e=o&&o.SecondLevelDomains,n={list:{ac:" com gov mil net org ",ae:" ac co gov mil name net org pro sch ",af:" com edu gov net org ",al:" com edu gov mil net org ",ao:" co ed gv it og pb ",ar:" com edu gob gov int mil net org tur ",at:" ac co gv or ",au:" asn com csiro edu gov id net org ",ba:" co com edu gov mil net org rs unbi unmo unsa untz unze ",bb:" biz co com edu gov info net org store tv ",bh:" biz cc com edu gov info net org ",bn:" com edu gov net org ",bo:" com edu gob gov int mil net org tv ",br:" adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",bs:" com edu gov net org ",bz:" du et om ov rg ",ca:" ab bc mb nb nf nl ns nt nu on pe qc sk yk ",ck:" biz co edu gen gov info net org ",cn:" ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",co:" com edu gov mil net nom org ",cr:" ac c co ed fi go or sa ",cy:" ac biz com ekloges gov ltd name net org parliament press pro tm ","do":" art com edu gob gov mil net org sld web ",dz:" art asso com edu gov net org pol ",ec:" com edu fin gov info med mil net org pro ",eg:" com edu eun gov mil name net org sci ",er:" com edu gov ind mil net org rochest w ",es:" com edu gob nom org ",et:" biz com edu gov info name net org ",fj:" ac biz com info mil name net org pro ",fk:" ac co gov net nom org ",fr:" asso com f gouv nom prd presse tm ",gg:" co net org ",gh:" com edu gov mil org ",gn:" ac com gov net org ",gr:" com edu gov mil net org ",gt:" com edu gob ind mil net org ",gu:" com edu gov net org ",hk:" com edu gov idv net org ",hu:" 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",id:" ac co go mil net or sch web ",il:" ac co gov idf k12 muni net org ","in":" ac co edu ernet firm gen gov i ind mil net nic org res ",iq:" com edu gov i mil net org ",ir:" ac co dnssec gov i id net org sch ",it:" edu gov ",je:" co net org ",jo:" com edu gov mil name net org sch ",jp:" ac ad co ed go gr lg ne or ",ke:" ac co go info me mobi ne or sc ",kh:" com edu gov mil net org per ",ki:" biz com de edu gov info mob net org tel ",km:" asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",kn:" edu gov net org ",kr:" ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",kw:" com edu gov net org ",ky:" com edu gov net org ",kz:" com edu gov mil net org ",lb:" com edu gov net org ",lk:" assn com edu gov grp hotel int ltd net ngo org sch soc web ",lr:" com edu gov net org ",lv:" asn com conf edu gov id mil net org ",ly:" com edu gov id med net org plc sch ",ma:" ac co gov m net org press ",mc:" asso tm ",me:" ac co edu gov its net org priv ",mg:" com edu gov mil nom org prd tm ",mk:" com edu gov inf name net org pro ",ml:" com edu gov net org presse ",mn:" edu gov org ",mo:" com edu gov net org ",mt:" com edu gov net org ",mv:" aero biz com coop edu gov info int mil museum name net org pro ",mw:" ac co com coop edu gov int museum net org ",mx:" com edu gob net org ",my:" com edu gov mil name net org sch ",nf:" arts com firm info net other per rec store web ",ng:" biz com edu gov mil mobi name net org sch ",ni:" ac co com edu gob mil net nom org ",np:" com edu gov mil net org ",nr:" biz com edu gov info net org ",om:" ac biz co com edu gov med mil museum net org pro sch ",pe:" com edu gob mil net nom org sld ",ph:" com edu gov i mil net ngo org ",pk:" biz com edu fam gob gok gon gop gos gov net org web ",pl:" art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",pr:" ac biz com edu est gov info isla name net org pro prof ",ps:" com edu gov net org plo sec ",pw:" belau co ed go ne or ",ro:" arts com firm info nom nt org rec store tm www ",rs:" ac co edu gov in org ",sb:" com edu gov net org ",sc:" com edu gov net org ",sh:" co com edu gov net nom org ",sl:" com edu gov net org ",st:" co com consulado edu embaixada gov mil net org principe saotome store ",sv:" com edu gob org red ",sz:" ac co org ",tr:" av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",tt:" aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",tw:" club com ebiz edu game gov idv mil net org ",mu:" ac co com gov net or org ",mz:" ac co edu gov org ",na:" co com ",nz:" ac co cri geek gen govt health iwi maori mil net org parliament school ",pa:" abo ac com edu gob ing med net nom org sld ",pt:" com edu gov int net nome org publ ",py:" com edu gov mil net org ",qa:" com edu gov mil net org ",re:" asso com nom ",ru:" ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",rw:" ac co com edu gouv gov int mil net ",sa:" com edu gov med net org pub sch ",sd:" com edu gov info med net org tv ",se:" a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",sg:" com edu gov idn net org per ",sn:" art com edu gouv org perso univ ",sy:" com edu gov mil net news org ",th:" ac co go in mi net or ",tj:" ac biz co com edu go gov info int mil name net nic org test web ",tn:" agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",tz:" ac co go ne or ",ua:" biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",ug:" ac co go ne or org sc ",uk:" ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",us:" dni fed isa kids nsn ",uy:" com edu gub mil net org ",ve:" co com edu gob info mil net org web ",vi:" co com k12 net org ",vn:" ac biz com edu gov health info int name net org pro ",ye:" co com gov ltd me net org plc ",yu:" ac co edu gov org ",za:" ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",zm:" ac co com edu gov net org sch "},has:function(o){var e=o.lastIndexOf(".");if(0>=e||e>=o.length-1)return!1;var r=o.lastIndexOf(".",e-1);if(0>=r||r>=e-1)return!1;var g=n.list[o.slice(e+1)];return g?g.indexOf(" "+o.slice(r+1,e)+" ")>=0:!1},is:function(o){var e=o.lastIndexOf(".");if(0>=e||e>=o.length-1)return!1;var r=o.lastIndexOf(".",e-1);if(r>=0)return!1;var g=n.list[o.slice(e+1)];return g?g.indexOf(" "+o.slice(0,e)+" ")>=0:!1},get:function(o){var e=o.lastIndexOf(".");if(0>=e||e>=o.length-1)return null;var r=o.lastIndexOf(".",e-1);if(0>=r||r>=e-1)return null;var g=n.list[o.slice(e+1)];return g?g.indexOf(" "+o.slice(r+1,e)+" ")<0?null:o.slice(r+1):null},noConflict:function(){return o.SecondLevelDomains===this&&(o.SecondLevelDomains=e),this}};return n});

/***
 * URI
***/
!function(t,e){"use strict";"object"==typeof exports?module.exports=e(require("./punycode"),require("./IPv6"),require("./SecondLevelDomains")):"function"==typeof define&&define.amd?define(["./punycode","./IPv6","./SecondLevelDomains"],e):t.URI=e(t.punycode,t.IPv6,t.SecondLevelDomains,t)}(this,function(t,e,r,s){"use strict";function n(t,e){return this instanceof n?(void 0===t&&(t="undefined"!=typeof location?location.href+"":""),this.href(t),void 0!==e?this.absoluteTo(e):this):new n(t,e)}function i(t){return t.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")}function a(t){return void 0===t?"Undefined":String(Object.prototype.toString.call(t)).slice(8,-1)}function o(t){return"Array"===a(t)}function h(t,e){var r,s,n={};if(o(e))for(r=0,s=e.length;s>r;r++)n[e[r]]=!0;else n[e]=!0;for(r=0,s=t.length;s>r;r++)void 0!==n[t[r]]&&(t.splice(r,1),s--,r--);return t}function u(t,e){var r,s;if(o(e)){for(r=0,s=e.length;s>r;r++)if(!u(t,e[r]))return!1;return!0}var n=a(e);for(r=0,s=t.length;s>r;r++)if("RegExp"===n){if("string"==typeof t[r]&&t[r].match(e))return!0}else if(t[r]===e)return!0;return!1}function p(t,e){if(!o(t)||!o(e))return!1;if(t.length!==e.length)return!1;t.sort(),e.sort();for(var r=0,s=t.length;s>r;r++)if(t[r]!==e[r])return!1;return!0}function c(t){return escape(t)}function l(t){return encodeURIComponent(t).replace(/[!'()*]/g,c).replace(/\*/g,"%2A")}var d=s&&s.URI;n.version="1.14.0";var f=n.prototype,m=Object.prototype.hasOwnProperty;n._parts=function(){return{protocol:null,username:null,password:null,hostname:null,urn:null,port:null,path:null,query:null,fragment:null,duplicateQueryParameters:n.duplicateQueryParameters,escapeQuerySpace:n.escapeQuerySpace}},n.duplicateQueryParameters=!1,n.escapeQuerySpace=!0,n.protocol_expression=/^[a-z][a-z0-9.+-]*$/i,n.idn_expression=/[^a-z0-9\.-]/i,n.punycode_expression=/(xn--)/i,n.ip4_expression=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,n.ip6_expression=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,n.find_uri_expression=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi,n.findUri={start:/\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,end:/[\s\r\n]|$/,trim:/[`!()\[\]{};:'".,<>?«»“”„‘’]+$/},n.defaultPorts={http:"80",https:"443",ftp:"21",gopher:"70",ws:"80",wss:"443"},n.invalid_hostname_characters=/[^a-zA-Z0-9\.-]/,n.domAttributes={a:"href",blockquote:"cite",link:"href",base:"href",script:"src",form:"action",img:"src",area:"href",iframe:"src",embed:"src",source:"src",track:"src",input:"src",audio:"src",video:"src"},n.getDomAttribute=function(t){if(!t||!t.nodeName)return void 0;var e=t.nodeName.toLowerCase();return"input"===e&&"image"!==t.type?void 0:n.domAttributes[e]},n.encode=l,n.decode=decodeURIComponent,n.iso8859=function(){n.encode=escape,n.decode=unescape},n.unicode=function(){n.encode=l,n.decode=decodeURIComponent},n.characters={pathname:{encode:{expression:/%(24|26|2B|2C|3B|3D|3A|40)/gi,map:{"%24":"$","%26":"&","%2B":"+","%2C":",","%3B":";","%3D":"=","%3A":":","%40":"@"}},decode:{expression:/[\/\?#]/g,map:{"/":"%2F","?":"%3F","#":"%23"}}},reserved:{encode:{expression:/%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,map:{"%3A":":","%2F":"/","%3F":"?","%23":"#","%5B":"[","%5D":"]","%40":"@","%21":"!","%24":"$","%26":"&","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"="}}}},n.encodeQuery=function(t,e){var r=n.encode(t+"");return void 0===e&&(e=n.escapeQuerySpace),e?r.replace(/%20/g,"+"):r},n.decodeQuery=function(t,e){t+="",void 0===e&&(e=n.escapeQuerySpace);try{return n.decode(e?t.replace(/\+/g,"%20"):t)}catch(r){return t}},n.recodePath=function(t){for(var e=(t+"").split("/"),r=0,s=e.length;s>r;r++)e[r]=n.encodePathSegment(n.decode(e[r]));return e.join("/")},n.decodePath=function(t){for(var e=(t+"").split("/"),r=0,s=e.length;s>r;r++)e[r]=n.decodePathSegment(e[r]);return e.join("/")};var _,y={encode:"encode",decode:"decode"},g=function(t,e){return function(r){try{return n[e](r+"").replace(n.characters[t][e].expression,function(r){return n.characters[t][e].map[r]})}catch(s){return r}}};for(_ in y)n[_+"PathSegment"]=g("pathname",y[_]);n.encodeReserved=g("reserved","encode"),n.parse=function(t,e){var r;return e||(e={}),r=t.indexOf("#"),r>-1&&(e.fragment=t.substring(r+1)||null,t=t.substring(0,r)),r=t.indexOf("?"),r>-1&&(e.query=t.substring(r+1)||null,t=t.substring(0,r)),"//"===t.substring(0,2)?(e.protocol=null,t=t.substring(2),t=n.parseAuthority(t,e)):(r=t.indexOf(":"),r>-1&&(e.protocol=t.substring(0,r)||null,e.protocol&&!e.protocol.match(n.protocol_expression)?e.protocol=void 0:"//"===t.substring(r+1,r+3)?(t=t.substring(r+3),t=n.parseAuthority(t,e)):(t=t.substring(r+1),e.urn=!0))),e.path=t,e},n.parseHost=function(t,e){var r,s,n=t.indexOf("/");return-1===n&&(n=t.length),"["===t.charAt(0)?(r=t.indexOf("]"),e.hostname=t.substring(1,r)||null,e.port=t.substring(r+2,n)||null,"/"===e.port&&(e.port=null)):t.indexOf(":")!==t.lastIndexOf(":")?(e.hostname=t.substring(0,n)||null,e.port=null):(s=t.substring(0,n).split(":"),e.hostname=s[0]||null,e.port=s[1]||null),e.hostname&&"/"!==t.substring(n).charAt(0)&&(n++,t="/"+t),t.substring(n)||"/"},n.parseAuthority=function(t,e){return t=n.parseUserinfo(t,e),n.parseHost(t,e)},n.parseUserinfo=function(t,e){var r,s=t.indexOf("/"),i=t.lastIndexOf("@",s>-1?s:t.length-1);return i>-1&&(-1===s||s>i)?(r=t.substring(0,i).split(":"),e.username=r[0]?n.decode(r[0]):null,r.shift(),e.password=r[0]?n.decode(r.join(":")):null,t=t.substring(i+1)):(e.username=null,e.password=null),t},n.parseQuery=function(t,e){if(!t)return{};if(t=t.replace(/&+/g,"&").replace(/^\?*&*|&+$/g,""),!t)return{};for(var r,s,i,a={},o=t.split("&"),h=o.length,u=0;h>u;u++)r=o[u].split("="),s=n.decodeQuery(r.shift(),e),i=r.length?n.decodeQuery(r.join("="),e):null,a[s]?("string"==typeof a[s]&&(a[s]=[a[s]]),a[s].push(i)):a[s]=i;return a},n.build=function(t){var e="";return t.protocol&&(e+=t.protocol+":"),t.urn||!e&&!t.hostname||(e+="//"),e+=n.buildAuthority(t)||"","string"==typeof t.path&&("/"!==t.path.charAt(0)&&"string"==typeof t.hostname&&(e+="/"),e+=t.path),"string"==typeof t.query&&t.query&&(e+="?"+t.query),"string"==typeof t.fragment&&t.fragment&&(e+="#"+t.fragment),e},n.buildHost=function(t){var e="";return t.hostname?(e+=n.ip6_expression.test(t.hostname)?"["+t.hostname+"]":t.hostname,t.port&&(e+=":"+t.port),e):""},n.buildAuthority=function(t){return n.buildUserinfo(t)+n.buildHost(t)},n.buildUserinfo=function(t){var e="";return t.username&&(e+=n.encode(t.username),t.password&&(e+=":"+n.encode(t.password)),e+="@"),e},n.buildQuery=function(t,e,r){var s,i,a,h,u="";for(i in t)if(m.call(t,i)&&i)if(o(t[i]))for(s={},a=0,h=t[i].length;h>a;a++)void 0!==t[i][a]&&void 0===s[t[i][a]+""]&&(u+="&"+n.buildQueryParameter(i,t[i][a],r),e!==!0&&(s[t[i][a]+""]=!0));else void 0!==t[i]&&(u+="&"+n.buildQueryParameter(i,t[i],r));return u.substring(1)},n.buildQueryParameter=function(t,e,r){return n.encodeQuery(t,r)+(null!==e?"="+n.encodeQuery(e,r):"")},n.addQuery=function(t,e,r){if("object"==typeof e)for(var s in e)m.call(e,s)&&n.addQuery(t,s,e[s]);else{if("string"!=typeof e)throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");if(void 0===t[e])return void(t[e]=r);"string"==typeof t[e]&&(t[e]=[t[e]]),o(r)||(r=[r]),t[e]=t[e].concat(r)}},n.removeQuery=function(t,e,r){var s,i,a;if(o(e))for(s=0,i=e.length;i>s;s++)t[e[s]]=void 0;else if("object"==typeof e)for(a in e)m.call(e,a)&&n.removeQuery(t,a,e[a]);else{if("string"!=typeof e)throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");void 0!==r?t[e]===r?t[e]=void 0:o(t[e])&&(t[e]=h(t[e],r)):t[e]=void 0}},n.hasQuery=function(t,e,r,s){if("object"==typeof e){for(var i in e)if(m.call(e,i)&&!n.hasQuery(t,i,e[i]))return!1;return!0}if("string"!=typeof e)throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");switch(a(r)){case"Undefined":return e in t;case"Boolean":var h=Boolean(o(t[e])?t[e].length:t[e]);return r===h;case"Function":return!!r(t[e],e,t);case"Array":if(!o(t[e]))return!1;var c=s?u:p;return c(t[e],r);case"RegExp":return o(t[e])?s?u(t[e],r):!1:Boolean(t[e]&&t[e].match(r));case"Number":r=String(r);case"String":return o(t[e])?s?u(t[e],r):!1:t[e]===r;default:throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter")}},n.commonPath=function(t,e){var r,s=Math.min(t.length,e.length);for(r=0;s>r;r++)if(t.charAt(r)!==e.charAt(r)){r--;break}return 1>r?t.charAt(0)===e.charAt(0)&&"/"===t.charAt(0)?"/":"":(("/"!==t.charAt(r)||"/"!==e.charAt(r))&&(r=t.substring(0,r).lastIndexOf("/")),t.substring(0,r+1))},n.withinString=function(t,e,r){r||(r={});var s=r.start||n.findUri.start,i=r.end||n.findUri.end,a=r.trim||n.findUri.trim,o=/[a-z0-9-]=["']?$/i;for(s.lastIndex=0;;){var h=s.exec(t);if(!h)break;var u=h.index;if(r.ignoreHtml){var p=t.slice(Math.max(u-3,0),u);if(p&&o.test(p))continue}var c=u+t.slice(u).search(i),l=t.slice(u,c).replace(a,"");if(!r.ignore||!r.ignore.test(l)){c=u+l.length;var d=e(l,u,c,t);t=t.slice(0,u)+d+t.slice(c),s.lastIndex=u+d.length}}return s.lastIndex=0,t},n.ensureValidHostname=function(e){if(e.match(n.invalid_hostname_characters)){if(!t)throw new TypeError('Hostname "'+e+'" contains characters other than [A-Z0-9.-] and Punycode.js is not available');if(t.toASCII(e).match(n.invalid_hostname_characters))throw new TypeError('Hostname "'+e+'" contains characters other than [A-Z0-9.-]')}},n.noConflict=function(t){if(t){var e={URI:this.noConflict()};return s.URITemplate&&"function"==typeof s.URITemplate.noConflict&&(e.URITemplate=s.URITemplate.noConflict()),s.IPv6&&"function"==typeof s.IPv6.noConflict&&(e.IPv6=s.IPv6.noConflict()),s.SecondLevelDomains&&"function"==typeof s.SecondLevelDomains.noConflict&&(e.SecondLevelDomains=s.SecondLevelDomains.noConflict()),e}return s.URI===this&&(s.URI=d),this},f.build=function(t){return t===!0?this._deferred_build=!0:(void 0===t||this._deferred_build)&&(this._string=n.build(this._parts),this._deferred_build=!1),this},f.clone=function(){return new n(this)},f.valueOf=f.toString=function(){return this.build(!1)._string},y={protocol:"protocol",username:"username",password:"password",hostname:"hostname",port:"port"},g=function(t){return function(e,r){return void 0===e?this._parts[t]||"":(this._parts[t]=e||null,this.build(!r),this)}};for(_ in y)f[_]=g(y[_]);y={query:"?",fragment:"#"},g=function(t,e){return function(r,s){return void 0===r?this._parts[t]||"":(null!==r&&(r+="",r.charAt(0)===e&&(r=r.substring(1))),this._parts[t]=r,this.build(!s),this)}};for(_ in y)f[_]=g(_,y[_]);y={search:["?","query"],hash:["#","fragment"]},g=function(t,e){return function(r,s){var n=this[t](r,s);return"string"==typeof n&&n.length?e+n:n}};for(_ in y)f[_]=g(y[_][1],y[_][0]);f.pathname=function(t,e){if(void 0===t||t===!0){var r=this._parts.path||(this._parts.hostname?"/":"");return t?n.decodePath(r):r}return this._parts.path=t?n.recodePath(t):"/",this.build(!e),this},f.path=f.pathname,f.href=function(t,e){var r;if(void 0===t)return this.toString();this._string="",this._parts=n._parts();var s=t instanceof n,i="object"==typeof t&&(t.hostname||t.path||t.pathname);if(t.nodeName){var a=n.getDomAttribute(t);t=t[a]||"",i=!1}if(!s&&i&&void 0!==t.pathname&&(t=t.toString()),"string"==typeof t)this._parts=n.parse(t,this._parts);else{if(!s&&!i)throw new TypeError("invalid input");var o=s?t._parts:t;for(r in o)m.call(this._parts,r)&&(this._parts[r]=o[r])}return this.build(!e),this},f.is=function(t){var e=!1,s=!1,i=!1,a=!1,o=!1,h=!1,u=!1,p=!this._parts.urn;switch(this._parts.hostname&&(p=!1,s=n.ip4_expression.test(this._parts.hostname),i=n.ip6_expression.test(this._parts.hostname),e=s||i,a=!e,o=a&&r&&r.has(this._parts.hostname),h=a&&n.idn_expression.test(this._parts.hostname),u=a&&n.punycode_expression.test(this._parts.hostname)),t.toLowerCase()){case"relative":return p;case"absolute":return!p;case"domain":case"name":return a;case"sld":return o;case"ip":return e;case"ip4":case"ipv4":case"inet4":return s;case"ip6":case"ipv6":case"inet6":return i;case"idn":return h;case"url":return!this._parts.urn;case"urn":return!!this._parts.urn;case"punycode":return u}return null};var v=f.protocol,b=f.port,Q=f.hostname;f.protocol=function(t,e){if(void 0!==t&&t&&(t=t.replace(/:(\/\/)?$/,""),!t.match(n.protocol_expression)))throw new TypeError('Protocol "'+t+"\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");return v.call(this,t,e)},f.scheme=f.protocol,f.port=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0!==t&&(0===t&&(t=null),t&&(t+="",":"===t.charAt(0)&&(t=t.substring(1)),t.match(/[^0-9]/))))throw new TypeError('Port "'+t+'" contains characters other than [0-9]');return b.call(this,t,e)},f.hostname=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0!==t){var r={};n.parseHost(t,r),t=r.hostname}return Q.call(this,t,e)},f.host=function(t,e){return this._parts.urn?void 0===t?"":this:void 0===t?this._parts.hostname?n.buildHost(this._parts):"":(n.parseHost(t,this._parts),this.build(!e),this)},f.authority=function(t,e){return this._parts.urn?void 0===t?"":this:void 0===t?this._parts.hostname?n.buildAuthority(this._parts):"":(n.parseAuthority(t,this._parts),this.build(!e),this)},f.userinfo=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0===t){if(!this._parts.username)return"";var r=n.buildUserinfo(this._parts);return r.substring(0,r.length-1)}return"@"!==t[t.length-1]&&(t+="@"),n.parseUserinfo(t,this._parts),this.build(!e),this},f.resource=function(t,e){var r;return void 0===t?this.path()+this.search()+this.hash():(r=n.parse(t),this._parts.path=r.path,this._parts.query=r.query,this._parts.fragment=r.fragment,this.build(!e),this)},f.subdomain=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0===t){if(!this._parts.hostname||this.is("IP"))return"";var r=this._parts.hostname.length-this.domain().length-1;return this._parts.hostname.substring(0,r)||""}var s=this._parts.hostname.length-this.domain().length,a=this._parts.hostname.substring(0,s),o=new RegExp("^"+i(a));return t&&"."!==t.charAt(t.length-1)&&(t+="."),t&&n.ensureValidHostname(t),this._parts.hostname=this._parts.hostname.replace(o,t),this.build(!e),this},f.domain=function(t,e){if(this._parts.urn)return void 0===t?"":this;if("boolean"==typeof t&&(e=t,t=void 0),void 0===t){if(!this._parts.hostname||this.is("IP"))return"";var r=this._parts.hostname.match(/\./g);if(r&&r.length<2)return this._parts.hostname;var s=this._parts.hostname.length-this.tld(e).length-1;return s=this._parts.hostname.lastIndexOf(".",s-1)+1,this._parts.hostname.substring(s)||""}if(!t)throw new TypeError("cannot set domain empty");if(n.ensureValidHostname(t),!this._parts.hostname||this.is("IP"))this._parts.hostname=t;else{var a=new RegExp(i(this.domain())+"$");this._parts.hostname=this._parts.hostname.replace(a,t)}return this.build(!e),this},f.tld=function(t,e){if(this._parts.urn)return void 0===t?"":this;if("boolean"==typeof t&&(e=t,t=void 0),void 0===t){if(!this._parts.hostname||this.is("IP"))return"";var s=this._parts.hostname.lastIndexOf("."),n=this._parts.hostname.substring(s+1);return e!==!0&&r&&r.list[n.toLowerCase()]?r.get(this._parts.hostname)||n:n}var a;if(!t)throw new TypeError("cannot set TLD empty");if(t.match(/[^a-zA-Z0-9-]/)){if(!r||!r.is(t))throw new TypeError('TLD "'+t+'" contains characters other than [A-Z0-9]');a=new RegExp(i(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(a,t)}else{if(!this._parts.hostname||this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");a=new RegExp(i(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(a,t)}return this.build(!e),this},f.directory=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0===t||t===!0){if(!this._parts.path&&!this._parts.hostname)return"";if("/"===this._parts.path)return"/";var r=this._parts.path.length-this.filename().length-1,s=this._parts.path.substring(0,r)||(this._parts.hostname?"/":"");return t?n.decodePath(s):s}var a=this._parts.path.length-this.filename().length,o=this._parts.path.substring(0,a),h=new RegExp("^"+i(o));return this.is("relative")||(t||(t="/"),"/"!==t.charAt(0)&&(t="/"+t)),t&&"/"!==t.charAt(t.length-1)&&(t+="/"),t=n.recodePath(t),this._parts.path=this._parts.path.replace(h,t),this.build(!e),this},f.filename=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0===t||t===!0){if(!this._parts.path||"/"===this._parts.path)return"";var r=this._parts.path.lastIndexOf("/"),s=this._parts.path.substring(r+1);return t?n.decodePathSegment(s):s}var a=!1;"/"===t.charAt(0)&&(t=t.substring(1)),t.match(/\.?\//)&&(a=!0);var o=new RegExp(i(this.filename())+"$");return t=n.recodePath(t),this._parts.path=this._parts.path.replace(o,t),a?this.normalizePath(e):this.build(!e),this},f.suffix=function(t,e){if(this._parts.urn)return void 0===t?"":this;if(void 0===t||t===!0){if(!this._parts.path||"/"===this._parts.path)return"";var r,s,a=this.filename(),o=a.lastIndexOf(".");return-1===o?"":(r=a.substring(o+1),s=/^[a-z0-9%]+$/i.test(r)?r:"",t?n.decodePathSegment(s):s)}"."===t.charAt(0)&&(t=t.substring(1));var h,u=this.suffix();if(u)h=new RegExp(t?i(u)+"$":i("."+u)+"$");else{if(!t)return this;this._parts.path+="."+n.recodePath(t)}return h&&(t=n.recodePath(t),this._parts.path=this._parts.path.replace(h,t)),this.build(!e),this},f.segment=function(t,e,r){var s=this._parts.urn?":":"/",n=this.path(),i="/"===n.substring(0,1),a=n.split(s);if(void 0!==t&&"number"!=typeof t&&(r=e,e=t,t=void 0),void 0!==t&&"number"!=typeof t)throw new Error('Bad segment "'+t+'", must be 0-based integer');if(i&&a.shift(),0>t&&(t=Math.max(a.length+t,0)),void 0===e)return void 0===t?a:a[t];if(null===t||void 0===a[t])if(o(e)){a=[];for(var h=0,u=e.length;u>h;h++)(e[h].length||a.length&&a[a.length-1].length)&&(a.length&&!a[a.length-1].length&&a.pop(),a.push(e[h]))}else(e||"string"==typeof e)&&(""===a[a.length-1]?a[a.length-1]=e:a.push(e));else e||"string"==typeof e&&e.length?a[t]=e:a.splice(t,1);return i&&a.unshift(""),this.path(a.join(s),r)},f.segmentCoded=function(t,e,r){var s,i,a;if("number"!=typeof t&&(r=e,e=t,t=void 0),void 0===e){if(s=this.segment(t,e,r),o(s))for(i=0,a=s.length;a>i;i++)s[i]=n.decode(s[i]);else s=void 0!==s?n.decode(s):void 0;return s}if(o(e))for(i=0,a=e.length;a>i;i++)e[i]=n.decode(e[i]);else e="string"==typeof e?n.encode(e):e;return this.segment(t,e,r)};var w=f.query;return f.query=function(t,e){if(t===!0)return n.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("function"==typeof t){var r=n.parseQuery(this._parts.query,this._parts.escapeQuerySpace),s=t.call(this,r);return this._parts.query=n.buildQuery(s||r,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!e),this}return void 0!==t&&"string"!=typeof t?(this._parts.query=n.buildQuery(t,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!e),this):w.call(this,t,e)},f.setQuery=function(t,e,r){var s=n.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("object"==typeof t)for(var i in t)m.call(t,i)&&(s[i]=t[i]);else{if("string"!=typeof t)throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");s[t]=void 0!==e?e:null}return this._parts.query=n.buildQuery(s,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof t&&(r=e),this.build(!r),this},f.addQuery=function(t,e,r){var s=n.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return n.addQuery(s,t,void 0===e?null:e),this._parts.query=n.buildQuery(s,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof t&&(r=e),this.build(!r),this},f.removeQuery=function(t,e,r){var s=n.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return n.removeQuery(s,t,e),this._parts.query=n.buildQuery(s,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof t&&(r=e),this.build(!r),this},f.hasQuery=function(t,e,r){var s=n.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return n.hasQuery(s,t,e,r)},f.setSearch=f.setQuery,f.addSearch=f.addQuery,f.removeSearch=f.removeQuery,f.hasSearch=f.hasQuery,f.normalize=function(){return this._parts.urn?this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build():this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()},f.normalizeProtocol=function(t){return"string"==typeof this._parts.protocol&&(this._parts.protocol=this._parts.protocol.toLowerCase(),this.build(!t)),this},f.normalizeHostname=function(r){return this._parts.hostname&&(this.is("IDN")&&t?this._parts.hostname=t.toASCII(this._parts.hostname):this.is("IPv6")&&e&&(this._parts.hostname=e.best(this._parts.hostname)),this._parts.hostname=this._parts.hostname.toLowerCase(),this.build(!r)),this},f.normalizePort=function(t){return"string"==typeof this._parts.protocol&&this._parts.port===n.defaultPorts[this._parts.protocol]&&(this._parts.port=null,this.build(!t)),this},f.normalizePath=function(t){if(this._parts.urn)return this;if(!this._parts.path||"/"===this._parts.path)return this;var e,r,s,i=this._parts.path,a="";for("/"!==i.charAt(0)&&(e=!0,i="/"+i),i=i.replace(/(\/(\.\/)+)|(\/\.$)/g,"/").replace(/\/{2,}/g,"/"),e&&(a=i.substring(1).match(/^(\.\.\/)+/)||"",a&&(a=a[0]));;){if(r=i.indexOf("/.."),-1===r)break;0!==r?(s=i.substring(0,r).lastIndexOf("/"),-1===s&&(s=r),i=i.substring(0,s)+i.substring(r+3)):i=i.substring(3)}return e&&this.is("relative")&&(i=a+i.substring(1)),i=n.recodePath(i),this._parts.path=i,this.build(!t),this},f.normalizePathname=f.normalizePath,f.normalizeQuery=function(t){return"string"==typeof this._parts.query&&(this._parts.query.length?this.query(n.parseQuery(this._parts.query,this._parts.escapeQuerySpace)):this._parts.query=null,this.build(!t)),this},f.normalizeFragment=function(t){return this._parts.fragment||(this._parts.fragment=null,this.build(!t)),this},f.normalizeSearch=f.normalizeQuery,f.normalizeHash=f.normalizeFragment,f.iso8859=function(){var t=n.encode,e=n.decode;return n.encode=escape,n.decode=decodeURIComponent,this.normalize(),n.encode=t,n.decode=e,this},f.unicode=function(){var t=n.encode,e=n.decode;return n.encode=l,n.decode=unescape,this.normalize(),n.encode=t,n.decode=e,this},f.readable=function(){var e=this.clone();e.username("").password("").normalize();var r="";if(e._parts.protocol&&(r+=e._parts.protocol+"://"),e._parts.hostname&&(e.is("punycode")&&t?(r+=t.toUnicode(e._parts.hostname),e._parts.port&&(r+=":"+e._parts.port)):r+=e.host()),e._parts.hostname&&e._parts.path&&"/"!==e._parts.path.charAt(0)&&(r+="/"),r+=e.path(!0),e._parts.query){for(var s="",i=0,a=e._parts.query.split("&"),o=a.length;o>i;i++){var h=(a[i]||"").split("=");s+="&"+n.decodeQuery(h[0],this._parts.escapeQuerySpace).replace(/&/g,"%26"),void 0!==h[1]&&(s+="="+n.decodeQuery(h[1],this._parts.escapeQuerySpace).replace(/&/g,"%26"))}r+="?"+s.substring(1)}return r+=n.decodeQuery(e.hash(),!0)},f.absoluteTo=function(t){var e,r,s,i=this.clone(),a=["protocol","username","password","hostname","port"];if(this._parts.urn)throw new Error("URNs do not have any generally defined hierarchical components");if(t instanceof n||(t=new n(t)),i._parts.protocol||(i._parts.protocol=t._parts.protocol),this._parts.hostname)return i;for(r=0;s=a[r];r++)i._parts[s]=t._parts[s];return i._parts.path?".."===i._parts.path.substring(-2)&&(i._parts.path+="/"):(i._parts.path=t._parts.path,i._parts.query||(i._parts.query=t._parts.query)),"/"!==i.path().charAt(0)&&(e=t.directory(),i._parts.path=(e?e+"/":"")+i._parts.path,i.normalizePath()),i.build(),i},f.relativeTo=function(t){var e,r,s,i,a,o=this.clone().normalize();if(o._parts.urn)throw new Error("URNs do not have any generally defined hierarchical components");if(t=new n(t).normalize(),e=o._parts,r=t._parts,i=o.path(),a=t.path(),"/"!==i.charAt(0))throw new Error("URI is already relative");if("/"!==a.charAt(0))throw new Error("Cannot calculate a URI relative to another relative URI");if(e.protocol===r.protocol&&(e.protocol=null),e.username!==r.username||e.password!==r.password)return o.build();if(null!==e.protocol||null!==e.username||null!==e.password)return o.build();if(e.hostname!==r.hostname||e.port!==r.port)return o.build();if(e.hostname=null,e.port=null,i===a)return e.path="",o.build();if(s=n.commonPath(o.path(),t.path()),!s)return o.build();var h=r.path.substring(s.length).replace(/[^\/]*$/,"").replace(/.*?\//g,"../");return e.path=h+e.path.substring(s.length),o.build()},f.equals=function(t){var e,r,s,i=this.clone(),a=new n(t),h={},u={},c={};if(i.normalize(),a.normalize(),i.toString()===a.toString())return!0;if(e=i.query(),r=a.query(),i.query(""),a.query(""),i.toString()!==a.toString())return!1;if(e.length!==r.length)return!1;h=n.parseQuery(e,this._parts.escapeQuerySpace),u=n.parseQuery(r,this._parts.escapeQuerySpace);for(s in h)if(m.call(h,s)){if(o(h[s])){if(!p(h[s],u[s]))return!1}else if(h[s]!==u[s])return!1;c[s]=!0}for(s in u)if(m.call(u,s)&&!c[s])return!1;return!0},f.duplicateQueryParameters=function(t){return this._parts.duplicateQueryParameters=!!t,this},f.escapeQuerySpace=function(t){return this._parts.escapeQuerySpace=!!t,this},n});

/***
 * URITemplate
***/
!function(e,t){"use strict";"object"==typeof exports?module.exports=t(require("./URI")):"function"==typeof define&&define.amd?define(["./URI"],t):e.URITemplate=t(e.URI,e)}(this,function(e,t){"use strict";function n(e){return n._cache[e]?n._cache[e]:this instanceof n?(this.expression=e,n._cache[e]=this,this):new n(e)}function r(e){this.data=e,this.cache={}}var a=t&&t.URITemplate,o=Object.prototype.hasOwnProperty,p=n.prototype,i={"":{prefix:"",separator:",",named:!1,empty_name_separator:!1,encode:"encode"},"+":{prefix:"",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},"#":{prefix:"#",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},".":{prefix:".",separator:".",named:!1,empty_name_separator:!1,encode:"encode"},"/":{prefix:"/",separator:"/",named:!1,empty_name_separator:!1,encode:"encode"},";":{prefix:";",separator:";",named:!0,empty_name_separator:!1,encode:"encode"},"?":{prefix:"?",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"},"&":{prefix:"&",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"}};return n._cache={},n.EXPRESSION_PATTERN=/\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g,n.VARIABLE_PATTERN=/^([^*:]+)((\*)|:(\d+))?$/,n.VARIABLE_NAME_PATTERN=/[^a-zA-Z0-9%_]/,n.expand=function(e,t){var r,a,o,p=i[e.operator],s=p.named?"Named":"Unnamed",c=e.variables,l=[];for(o=0;a=c[o];o++)r=t.get(a.name),r.val.length?l.push(n["expand"+s](r,p,a.explode,a.explode&&p.separator||",",a.maxlength,a.name)):r.type&&l.push("");return l.length?p.prefix+l.join(p.separator):""},n.expandNamed=function(t,n,r,a,o,p){var i,s,c,l="",d=n.encode,h=n.empty_name_separator,u=!t[d].length,f=2===t.type?"":e[d](p);for(s=0,c=t.val.length;c>s;s++)o?(i=e[d](t.val[s][1].substring(0,o)),2===t.type&&(f=e[d](t.val[s][0].substring(0,o)))):u?(i=e[d](t.val[s][1]),2===t.type?(f=e[d](t.val[s][0]),t[d].push([f,i])):t[d].push([void 0,i])):(i=t[d][s][1],2===t.type&&(f=t[d][s][0])),l&&(l+=a),r?l+=f+(h||i?"=":"")+i:(s||(l+=e[d](p)+(h||i?"=":"")),2===t.type&&(l+=f+","),l+=i);return l},n.expandUnnamed=function(t,n,r,a,o){var p,i,s,c,l="",d=n.encode,h=n.empty_name_separator,u=!t[d].length;for(s=0,c=t.val.length;c>s;s++)o?i=e[d](t.val[s][1].substring(0,o)):u?(i=e[d](t.val[s][1]),t[d].push([2===t.type?e[d](t.val[s][0]):void 0,i])):i=t[d][s][1],l&&(l+=a),2===t.type&&(p=o?e[d](t.val[s][0].substring(0,o)):t[d][s][0],l+=p,l+=r?h||i?"=":"":","),l+=i;return l},n.noConflict=function(){return t.URITemplate===n&&(t.URITemplate=a),n},p.expand=function(e){var t="";this.parts&&this.parts.length||this.parse(),e instanceof r||(e=new r(e));for(var a=0,o=this.parts.length;o>a;a++)t+="string"==typeof this.parts[a]?this.parts[a]:n.expand(this.parts[a],e);return t},p.parse=function(){var e,t,r,a=this.expression,o=n.EXPRESSION_PATTERN,p=n.VARIABLE_PATTERN,s=n.VARIABLE_NAME_PATTERN,c=[],l=0;for(o.lastIndex=0;;){if(t=o.exec(a),null===t){c.push(a.substring(l));break}if(c.push(a.substring(l,t.index)),l=t.index+t[0].length,!i[t[1]])throw new Error('Unknown Operator "'+t[1]+'" in "'+t[0]+'"');if(!t[3])throw new Error('Unclosed Expression "'+t[0]+'"');e=t[2].split(",");for(var d=0,h=e.length;h>d;d++){if(r=e[d].match(p),null===r)throw new Error('Invalid Variable "'+e[d]+'" in "'+t[0]+'"');if(r[1].match(s))throw new Error('Invalid Variable Name "'+r[1]+'" in "'+t[0]+'"');e[d]={name:r[1],explode:!!r[3],maxlength:r[4]&&parseInt(r[4],10)}}if(!e.length)throw new Error('Expression Missing Variable(s) "'+t[0]+'"');c.push({expression:t[0],operator:t[1],variables:e})}return c.length||c.push(a),this.parts=c,this},r.prototype.get=function(e){var t,n,r,a=this.data,p={type:0,val:[],encode:[],encodeReserved:[]};if(void 0!==this.cache[e])return this.cache[e];if(this.cache[e]=p,r="[object Function]"===String(Object.prototype.toString.call(a))?a(e):"[object Function]"===String(Object.prototype.toString.call(a[e]))?a[e](e):a[e],void 0===r||null===r)return p;if("[object Array]"===String(Object.prototype.toString.call(r))){for(t=0,n=r.length;n>t;t++)void 0!==r[t]&&null!==r[t]&&p.val.push([void 0,String(r[t])]);p.val.length&&(p.type=3)}else if("[object Object]"===String(Object.prototype.toString.call(r))){for(t in r)o.call(r,t)&&void 0!==r[t]&&null!==r[t]&&p.val.push([t,String(r[t])]);p.val.length&&(p.type=2)}else p.type=1,p.val.push([void 0,String(r)]);return p},e.expand=function(t,r){var a=new n(t),o=a.expand(r);return new e(o)},n});

/***
 * Dtf
***/
var a = function() {
	var r20 = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
	var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var rreturn = /[^-+\dA-Z]/g;
	var pad = function(val, len) {
		val = String(val);
		len = len || 2;
		for (; val.length < len;) {
			val = "0" + val;
		}
		return val;
	};
	return function(date, mask, utc) {
		var dF = a;
		if (arguments.length == 1 && (Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date))) {
			mask = date;
			date = undefined;
		}
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) {
			throw SyntaxError("invalid date");
		}
		mask = String(dF.masks[mask] || (mask || dF.masks["default"]));
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
		var _ = utc ? "getUTC" : "get";
		var d = date[_ + "Date"]();
		var D = date[_ + "Day"]();
		var m = date[_ + "Month"]();
		var y = date[_ + "FullYear"]();
		var H = date[_ + "Hours"]();
		var M = date[_ + "Minutes"]();
		var s = date[_ + "Seconds"]();
		var L = date[_ + "Milliseconds"]();
		var o = utc ? 0 : date.getTimezoneOffset();
		var flags = {
			d: d,
			dd: pad(d),
			ddd: dF.i18n.dayNames[D],
			dddd: dF.i18n.dayNames[D + 7],
			m: m + 1,
			mm: pad(m + 1),
			mmm: dF.i18n.monthNames[m],
			mmmm: dF.i18n.monthNames[m + 12],
			yy: String(y).slice(2),
			yyyy: y,
			h: H % 12 || 12,
			hh: pad(H % 12 || 12),
			H: H,
			HH: pad(H),
			M: M,
			MM: pad(M),
			s: s,
			ss: pad(s),
			l: pad(L, 3),
			L: pad(L > 99 ? Math.round(L / 10) : L),
			t: H < 12 ? "a" : "p",
			tt: H < 12 ? "am" : "pm",
			T: H < 12 ? "A" : "P",
			TT: H < 12 ? "AM" : "PM",
			Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(rreturn, ""),
			o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
		};
		return mask.replace(r20, function($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
a.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "h:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
a.i18n = {
	dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
Date.prototype.format = function(node, next) {
	return a(this, node, next);
};

/***
 * CKEDITOR
***/
CKEDITOR.plugins.add("doksoft_backup", {
	lang: ["en", "vi"],
	icons: "doksoft_backup_load",
	init: function(editor) {
		var index = -1;
		var b = false;
		var uri = new URI;
		uri.normalize();
		var name = "doksoft_backup/" + uri.href() + "/" + editor.name + "/" + editor.config["doksoft_backup_additional_id"];
		var destroy = function() {
			return editor.elementMode == 3;
		};
		var f = -1;
		var set = function() {
			if (localStorage.getItem(name) == undefined) {
				localStorage.setItem(name, "{}");
			}
			var results = $();
			var html = editor.getSnapshot();
			var brokenFormAttributeGetter = true;
			var q = [];
			var bulk = -1;
			var index = -1;
			var fn = -1;
			var cDigit;
			for (cDigit in results) {
				fn++;
				if (bulk == -1 || parseInt(cDigit) > parseInt(index)) {
					bulk = fn;
					index = cDigit;
				}
			}
			if (bulk > -1) {
				var s = results[index].html;
				brokenFormAttributeGetter = html != s;
			}
			var file = Date.now();
			var tmp = document.createElement("DIV");
			tmp.innerHTML = html;
			var buf = tmp.textContent || (tmp.innerText || "");
			var r20 = /\s+/gi;
			var codeSegments = buf.trim().replace(r20, " ").split(" ");
			var words = 0;
			var prevChunksLen = 0;
			var i = codeSegments.length - 1;
			for (; i >= 0; i--) {
				if (codeSegments[i].trim().length > 0) {
					words++;
					prevChunksLen += codeSegments[i].trim().length;
				}
			}
			var content = {
				html: html,
				symbols: prevChunksLen,
				words: words
			};
			if (!brokenFormAttributeGetter) {
				delete results[index];
			}
			results[file] = content;
			f = Date.now();
			done(results);
		};
		var done = function(data) {
			if (data == null || data.length == 0) {
				localStorage.removeItem(name);
			} else {
				var keys = [];
				var k;
				for (k in data) {
					keys.push(k);
				}
				keys.sort().reverse();
				for (; keys.length > editor.config["doksoft_backup_snapshots_limit"];) {
					delete data[keys.pop()];
				}
				for (; true;) {
					try {
						localStorage.setItem(name, JSON.stringify(data));
						return;
					} catch (o) {
						console.log("Local storage limit reached, trying to remove one element");
						if (keys.length == 0) {
							console.log("Backup is too big for local storage");
							return;
						}
						delete data[keys.pop()];
					}
				}
			}
		};
		var $ = function() {
			var value = localStorage.getItem(name);
			if (typeof value === "undefined" || value == null) {
				return null;
			}
			return JSON.parse(value);
		};
		var g = -1;
		CKEDITOR.dialog.add("doksoft_backup-load-" + editor.name, function(editor) {
			return {
				title: editor.lang["doksoft_backup"]["load"],
				minWidth: 750,
				minHeight: 550,
				resizable: false,
				buttons: [{
						id: "remove_snap",
						label: editor.lang["doksoft_backup"].remove_all,
						align: "left",
						title: "",
						disabled: false,
						type: "button",
						onClick: function() {
							if (confirm(editor.lang["doksoft_backup"].confirm_remove_all)) {
								done([]);
								CKEDITOR.dialog.getCurrent().hide();
								b = false;
							}
						}
					},
					CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
				],
				onOk: function() {
					if (index == -1) {
						alert(editor.lang["doksoft_backup"].msg_select);
						return false;
					}
					var data = $()[index].html;
					if (editor.config["doksoft_backup_save_before_load"]) {
						set();
					}
					editor.loadSnapshot(data);
					b = false;
				},
				onCancel: function() {
					b = false;
				},
				onShow: function() {
					b = true;
					g = -1;
					var script = document.getElementById("doksoft_backup-load-backups-" + editor.name);
					var msgElm = document.getElementById("doksoft_backup-load-preview-" + editor.name);
					var r20 = CKEDITOR.tools.addFunction(function(key) {
						var label = $()[key];
						if (label == null) {
							return;
						}
						var part = null;
						var resultItems = document.getElementsByClassName("doksoft_backup-load-backup");
						var i = 0;
						for (; i < resultItems.length; i++) {
							if (resultItems[i].getAttribute("data-date") == key) {
								part = resultItems[i];
							} else {
								resultItems[i].style.backgroundColor = "white";
							}
						}
						part.style.backgroundColor = "rgb(216, 241, 255)";
						var node = document.getElementById("doksoft_backup-load-preview-frame-" + editor.name);
						var block = document.getElementById("doksoft_backup-load-preview-" + editor.name);
						if (node != null) {
							block.removeChild(node);
						}
						node = document.createElement("iframe");
						node.id = "doksoft_backup-load-preview-frame-" + editor.name;
						block.innerHTML = "";
						block.appendChild(node);
						var classList = editor.document.$.body.classList;
						var optsData = "";
						var doc = node.contentWindow.document;
						var codeSegments = editor.document.$.getElementsByTagName("link");
						i = 0;
						for (; i < codeSegments.length; i++) {
							optsData += '<link rel="stylesheet" type="text/css" href="' + codeSegments[i].href + '"/>';
						}
						var styles = editor.document.$.getElementsByTagName("style");
						i = 0;
						for (; i < styles.length; i++) {
							optsData += '<style type="text/css">' + styles[i].innerHTML + "</style>";
						}
						var data = "<html><head>" + optsData + '</head><body><div style="width:' + editor.document.getDocumentElement().$.offsetWidth + 'px"><div class="' + classList + '">' + label.html + "</div></div></body></html>";
						node.style.width = "100%";
						node.src = "data:text/html;charset=utf-8," + data;
						index = key;
					});
					var helper = $();
					if (helper == null) {
						script.innerHTML = '<div style="vertical-align: middle; text-align: center; padding-top: 250px">' + editor.lang["doksoft_backup"].no_backups + "</div>";
						msgElm = document.getElementById("doksoft_backup-load-preview-" + editor.name);
						msgElm.innerHTML = '<div style="vertical-align: middle; text-align: center; padding-top: 250px">' + editor.lang["doksoft_backup"].no_backups_desc + "</div>";
					} else {
						var keys = [];
						var key;
						for (key in helper) {
							keys.push(key);
						}
						keys.sort();
						var code = "";
						var i = 0;
						for (; i < keys.length; i++) {
							key = keys[i];
							var results = helper[key];
							var lastWeek = new Date(parseInt(key));
							var line = '<div class="doksoft_backup-load-backup" data-date="' + key + '" onclick="CKEDITOR.tools.callFunction(' + r20 + ", " + key + ')">' + '<div class="doksoft_backup-load-backup-img"></div>' + '<div class="doksoft_backup-load-backup-data">' + '<div class="doksoft_backup-load-backup-data-date">' + lastWeek.format(editor.config["doksoft_backup_date_format"]) + "</div>" + '<div class="doksoft_backup-load-backup-data-counts">' + '<div class="doksoft_backup-load-backup-data-count-name">' + editor.lang["doksoft_backup"].html_length + ':</div><div class="doksoft_backup-load-backup-data-count-value">' + results.html.length + "</div><br/>" + '<div class="doksoft_backup-load-backup-data-count-name">' + editor.lang["doksoft_backup"].symbol_count + ':</div><div class="doksoft_backup-load-backup-data-count-value">' + results.symbols + "</div><br/>" + '<div class="doksoft_backup-load-backup-data-count-name">' + editor.lang["doksoft_backup"].word_count + ':</div><div class="doksoft_backup-load-backup-data-count-value">' + results.words + "</div>" + "</div>" + "</div>" + "</div>";
							code = line + code;
						}
						code = '<div class="doksoft_backup-load-backups-wrap">' + code + "</div>";
						script.innerHTML = code;
						CKEDITOR.tools.callFunction(r20, keys[keys.length - 1]);
					}
				},
				contents: [{
					id: "doksoft_backup-load-tab-" + editor.name,
					label: "",
					title: "",
					expand: true,
					padding: 0,
					elements: [{
						id: "doksoft_backup-load-panel-" + editor.name,
						type: "html",
						html: '<style type="text/css">' + ".doksoft_backup-load-backups-wrap { overflow:scroll;overflow-y:scroll;overflow-x: hidden; width: 100%; height: 100%; }" + ".doksoft_backup-load-backup { cursor: pointer; border-bottom: 1px silver solid; padding: 8px 0; margin-right:7px;-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none; }" + ".doksoft_backup-load-backup:last-child { border-bottom: none; }" + ".doksoft_backup-load-backup:hover { background-color: rgb(240, 250, 255); } " + ".doksoft_backup-load-backup-img { cursor: pointer; width:55px;float:left;display:inline-block;background-image: url(" + CKEDITOR.plugins.getPath("doksoft_backup") + "img/backup.png);height: 60px;background-repeat: no-repeat;background-position-x: 8px;background-position-y: 10px; }" + ".doksoft_backup-load-backup-date { cursor: pointer; margin-left:50px }" + ".doksoft_backup-load-backup-data-date { cursor: pointer; font-size:16px; padding-bottom: 4px; }" + ".doksoft_backup-load-backup-data-counts { cursor: pointer; font-size:12px }" + ".doksoft_backup-load-backup-data-count-name { cursor: pointer; display:inline-block;width:90px }" + ".doksoft_backup-load-backup-data-count-value { cursor: pointer; display:inline-block; font-weight: bold } " + ".doksoft_backup-load-preview { max-width: 500px; height: 100%; overflow: hidden; }" + ".doksoft_backup-load-preview iframe { height: 100% }" + "</style>" + '<div style="height:525px;float:left;width:260px;" id="doksoft_backup-load-backups-' + editor.name + '"></div>' + '<div style="height:525px;margin-left:260px" id="doksoft_backup-load-preview-' + editor.name + '" class="doksoft_backup-load-preview"></div>'
					}]
				}]
			};
		});
		editor.addCommand("doksoft_backup-load", new CKEDITOR.dialogCommand("doksoft_backup-load-" + editor.name));
		editor.ui.addButton("doksoft_backup_load", {
			icon: this.path + "icons/doksoft_backup_load.png",
			label: editor.lang.doksoft_backup.label,
			title: editor.lang["doksoft_backup"]["load"] + "...",
			command: "doksoft_backup-load"
		});
		editor.addCommand("doksoft_backup-save-" + editor.name, {
			exec: function(jumpToNext) {
				set();
			}
		});
		editor.ui.addButton("doksoft_backup_save", {
			icon: this.path + "icons/doksoft_backup_save.png",
			title: editor.lang["doksoft_backup"]["save"],
			command: "doksoft_backup-save-" + editor.name
		});
		editor.on("instanceReady", function(dataAndEvents) {
			if (editor.config["doksoft_backup_add_text_to_load_button"]) {
				var args = editor.container.$.getElementsByClassName("cke_button__doksoft_backup_load_label");
				var i = 0;
				for (; i < args.length; i++) {
					args[i].setAttribute("style", "display: inline-block !important");
				}
			}
			if (!destroy() && editor.config["doksoft_backup_move_to_footer"]) {
				args = [];
				var valArr = editor.container.$.getElementsByClassName("cke_button__doksoft_backup_save");
				if (valArr != null && valArr.length > 0) {
					args.push(valArr[0]);
				}
				valArr = editor.container.$.getElementsByClassName("cke_button__doksoft_backup_load");
				if (valArr != null && valArr.length > 0) {
					args.push(valArr[0]);
				}
				if (args.length > 0) {
					var node = args[0].parentElement;
					var parent = document.getElementById(editor.id + "_bottom");
					var element = document.createElement("span");
					if (editor.config["doksoft_backup_add_background_in_footer"]) {
						element.className = "cke_toolgroup";
					}
					element.style["float"] = "right";
					element.style.margin = "-3px 10px 0 0";
					parent.appendChild(element);
					i = 0;
					for (; i < args.length; i++) {
						var script = args[i];
						node.removeChild(script);
						element.appendChild(script);
					}
					if (node.childNodes.length == 0) {
						node.parentElement.removeChild(node);
					}
				}
			}
			if (CKEDITOR.config["doksoft_backup_interval"] > 0) {
				setInterval(function() {
					if (!b) {
						set();
					}
				}, CKEDITOR.config["doksoft_backup_interval"]);
			}
		});
	}
});
CKEDITOR.config["doksoft_backup_date_format"] = "HH:MM mmm d, yyyy";
CKEDITOR.config["doksoft_backup_additional_id"] = "";
CKEDITOR.config["doksoft_backup_snapshots_limit"] = 20;
CKEDITOR.config["doksoft_backup_save_before_load"] = true;
CKEDITOR.config["doksoft_backup_add_text_to_load_button"] = true;
CKEDITOR.config["doksoft_backup_interval"] = 3E4;
CKEDITOR.config["doksoft_backup_move_to_footer"] = true;
CKEDITOR.config["doksoft_backup_add_background_in_footer"] = true;