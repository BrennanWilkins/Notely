(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{12:function(e,t,a){"use strict";a.d(t,"b",(function(){return o})),a.d(t,"a",(function(){return s}));var r=a(27),n=a.n(r),o=n.a.create({baseURL:"https://notely-app.herokuapp.com/api/"}),s=n.a.create({baseURL:"https://notely-app.herokuapp.com/api/auth/"})},4:function(e,t,a){"use strict";a.d(t,"h",(function(){return r})),a.d(t,"p",(function(){return n})),a.d(t,"n",(function(){return o})),a.d(t,"l",(function(){return s})),a.d(t,"m",(function(){return i})),a.d(t,"k",(function(){return c})),a.d(t,"a",(function(){return l})),a.d(t,"g",(function(){return u})),a.d(t,"o",(function(){return m})),a.d(t,"f",(function(){return d})),a.d(t,"e",(function(){return g})),a.d(t,"d",(function(){return p})),a.d(t,"b",(function(){return f})),a.d(t,"i",(function(){return h})),a.d(t,"j",(function(){return b})),a.d(t,"c",(function(){return E})),a.d(t,"r",(function(){return O})),a.d(t,"q",(function(){return v}));var r="RESET_STOPWATCH",n="STOP_STOPWATCH",o="STOPWATCH_START",s="SET_STOPWATCH_TIME",i="STOPWATCH_FIRST_START",c="SET_LAP_TIME",l="CHANGE_POMODORO",u="RESET_POMODORO",m="STOP_POMODORO",d="POMODORO_START",g="POMODORO_FINISHED",p="POMODORO_CYCLE_END",f="CHANGE_TIMER",h="RESET_TIMER",b="SET_FIRST_START",E="PAUSE_TIMER",O="TIMER_START",v="TIMER_CYCLE_END"},42:function(e,t,a){e.exports={Error:"ErrorDisplay_Error__1pJNu"}},43:function(e,t,a){e.exports={loader:"Spinner_loader__3Czad",load4:"Spinner_load4__1oANX"}},47:function(e,t,a){e.exports=a(74)},5:function(e,t,a){e.exports={Container:"Auth_Container__1Ogsq",FormContainer:"Auth_FormContainer__3Dgx8",Header:"Auth_Header__1NxGa",Form:"Auth_Form__1iIZa",Demo:"Auth_Demo__Z0xvL",MessageLogin:"Auth_MessageLogin__2Vy-F",MessageSignup:"Auth_MessageSignup__blaIw",Remember:"Auth_Remember__3qafN",ErrorMsg:"Auth_ErrorMsg__OwVeC",MoveError:"Auth_MoveError__2o6IY",Move:"Auth_Move__3gfsg"}},52:function(e,t,a){},74:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a.n(r),o=a(22),s=a.n(o),i=(a(52),a(13)),c=a(14),l=a(16),u=a(15),m=a(42),d=a.n(m),g=a(11),p=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(i.a)(this,a);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(e=t.call.apply(t,[this].concat(n))).state={hasError:!1},e}return Object(c.a)(a,[{key:"componentDidCatch",value:function(e,t){this.setState({hasError:!0}),console.log(e,t)}},{key:"render",value:function(){return this.state.hasError?n.a.createElement("div",{className:d.a.Error},n.a.createElement("h1",null,"Something went wrong."),n.a.createElement(g.b,{to:"/"},n.a.createElement("button",null,"Back to Notely Home"))):this.props.children}}]),a}(n.a.Component),f=a(1),h=a(5),b=a.n(h),E=a(43),O=a.n(E),v=function(e){return n.a.createElement("div",{className:O.a.loader},"Loading...")},S=a(12),I=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(i.a)(this,a);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(e=t.call.apply(t,[this].concat(n))).state={loginInfo:{email:"",password:""},signupInfo:{email:"",password:"",confirmPassword:""},error:!1,errorMsg:"",loading:!1,remember:!1},e.checkValidity=function(){var t=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;if(e.props.login){if(0===e.state.loginInfo.email.length||0===e.state.loginInfo.password.length)return e.setState({error:!0,errorMsg:"Email and password must not be empty."}),!0;if(!t.test(e.state.loginInfo.email)||e.state.loginInfo.email.length>70||e.state.loginInfo.password.length>70)return e.setState({error:!0,errorMsg:"There is no account for the email you entered."}),!0}else{if(!t.test(e.state.signupInfo.email))return e.setState({error:!0,errorMsg:"Please enter a valid email address."}),!0;if(0===e.state.signupInfo.email.length||0===e.state.signupInfo.password.length)return e.setState({error:!0,errorMsg:"Email and password must not be empty."}),!0;if(e.state.signupInfo.password.length>70)return e.setState({error:!0,errorMsg:"Password must be less than 70 characters."}),!0;if(e.state.signupInfo.password.length<7)return e.setState({error:!0,errorMsg:"Password must be at least 7 characters long."}),!0;if(e.state.signupInfo.password!==e.state.signupInfo.confirmPassword)return e.setState({error:!0,errorMsg:"Confirm password must be equal to password."}),!0}return!1},e.toggleLoading=function(){e.setState((function(e){return{loading:!e.loading,error:!1,errorMsg:""}}))},e.authFailed=function(t){e.setState({loading:!1,error:!0,errorMsg:t})},e.loginHandler=function(t){if(t.preventDefault(),!e.state.loading&&!e.checkValidity()){e.toggleLoading();var a={email:e.state.loginInfo.email,password:e.state.loginInfo.password};S.a.post("login",a).then((function(t){if(200===t.status)return localStorage.setItem("token",t.data.token),S.b.defaults.headers.common["x-auth-token"]=t.data.token,localStorage.setItem("userId",t.data.userId),localStorage.setItem("remember",e.state.remember),localStorage.setItem("email",e.state.loginInfo.email),e.props.isAuth();e.authFailed(t.data.message)})).catch((function(t){e.authFailed("There was an error logging in.")}))}},e.signupHandler=function(t){if(t.preventDefault(),!e.state.loading&&!e.checkValidity()){e.toggleLoading();var a={email:e.state.signupInfo.email,password:e.state.signupInfo.password,confirmPassword:e.state.signupInfo.confirmPassword};S.a.post("signup",a).then((function(t){if(200===t.status){var a={email:e.state.signupInfo.email,password:e.state.signupInfo.password};S.a.post("login",a).then((function(t){return 200===t.status?(localStorage.setItem("token",t.data.token),S.b.defaults.headers.common["x-auth-token"]=t.data.token,localStorage.setItem("userId",t.data.userId),localStorage.setItem("remember",e.state.remember),localStorage.setItem("email",e.state.signupInfo.email),e.props.isAuth()):e.authFailed("There was an error signing up.")})).catch((function(t){e.authFailed("There was an error signing up.")}))}e.authFailed("There was an error signing up.")})).catch((function(t){e.authFailed("There was an error signing up.")}))}},e.changeLoginInfo=function(t){if(!e.state.loading){var a=Object(f.a)({},e.state.loginInfo);a[t.target.name]=t.target.value,e.setState({loginInfo:a,error:!1,errorMsg:""})}},e.changeSignupInfo=function(t){if(!e.state.loading){var a=Object(f.a)({},e.state.signupInfo);a[t.target.name]=t.target.value,e.setState({signupInfo:a,error:!1,errorMsg:""})}},e.clearFields=function(){e.setState({loginInfo:{email:"",password:""},signupInfo:{email:"",password:"",confirmPassword:""},loading:!1,error:!1,errorMsg:"",remember:!1})},e.toggleRemember=function(){e.setState((function(e){return{remember:!e.remember}}))},e}return Object(c.a)(a,[{key:"render",value:function(){var e=n.a.createElement("div",{className:this.state.error?[b.a.Remember,b.a.Move].join(" "):b.a.Remember},n.a.createElement("input",{type:"checkbox",onChange:this.toggleRemember,checked:this.state.remember}),n.a.createElement("p",null,"Remember me")),t=this.props.login?n.a.createElement(n.a.Fragment,null,n.a.createElement("form",{className:b.a.Form,onSubmit:this.loginHandler},n.a.createElement("input",{type:"text",placeholder:"Email",name:"email",value:this.state.loginInfo.email,onChange:this.changeLoginInfo}),n.a.createElement("input",{type:"password",placeholder:"Password",name:"password",value:this.state.loginInfo.password,onChange:this.changeLoginInfo}),n.a.createElement("p",{className:this.state.error?[b.a.ErrorMsg,b.a.MoveError].join(" "):b.a.ErrorMsg},this.state.errorMsg),n.a.createElement("button",{className:this.state.error?b.a.Move:void 0},this.props.login?"login":"create")),e):n.a.createElement(n.a.Fragment,null,n.a.createElement("form",{className:b.a.Form,onSubmit:this.signupHandler},n.a.createElement("input",{type:"text",placeholder:"Email",name:"email",value:this.state.signupInfo.email,onChange:this.changeSignupInfo}),n.a.createElement("input",{type:"password",placeholder:"Password",name:"password",value:this.state.signupInfo.password,onChange:this.changeSignupInfo}),n.a.createElement("input",{type:"password",placeholder:"Confirm Password",name:"confirmPassword",value:this.state.signupInfo.confirmPassword,onChange:this.changeSignupInfo}),n.a.createElement("p",{className:this.state.error?[b.a.ErrorMsg,b.a.MoveError].join(" "):b.a.ErrorMsg},this.state.errorMsg),n.a.createElement("button",{className:this.state.error?b.a.Move:void 0},this.props.login?"login":"create")),e),a=this.props.login?n.a.createElement("p",{className:b.a.MessageSignup},"Not registered? ",n.a.createElement(g.b,{to:"/signup",onClick:this.clearFields},"Create an account")):n.a.createElement("p",{className:b.a.MessageLogin},"Already registered? ",n.a.createElement(g.b,{to:"/login",onClick:this.clearFields},"Login"));return n.a.createElement("div",{className:b.a.Container},n.a.createElement("div",{className:b.a.FormContainer},n.a.createElement("p",{className:b.a.Demo},"See a demo ",n.a.createElement(g.b,{to:"/demo",onClick:this.clearFields},"here")),n.a.createElement("h1",{className:b.a.Header},"Notely"),t,this.state.loading&&n.a.createElement(v,null),a))}}]),a}(r.Component),T=a(3),j=a(18),w=a(31),M=a(45),_=a(4),y={displayTime:"25:00",pomodoroCount:0,currentMax:25,sec:0,min:25,started:!1},x=function(e,t){var a="".concat(t.time,":00");return Object(f.a)(Object(f.a)({},e),{},{min:t.time,sec:0,started:!1,currentMax:t.time,displayTime:a})},A=function(e,t){var a="".concat(e.currentMax,":00");return Object(f.a)(Object(f.a)({},e),{},{started:!1,min:e.currentMax,sec:0,displayTime:a})},C=function(e,t){var a="".concat(e.currentMax,":00"),r=e.pomodoroCount+1;return Object(f.a)(Object(f.a)({},e),{},{started:!1,min:e.currentMax,sec:0,displayTime:a,pomodoroCount:r})},k=function(e,t){return Object(f.a)(Object(f.a)({},e),{},{displayTime:t.displayTime,sec:t.sec,min:t.min})},R=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case _.a:return x(e,t);case _.g:return A(e);case _.o:return Object(f.a)(Object(f.a)({},e),{},{started:!1});case _.f:return Object(f.a)(Object(f.a)({},e),{},{started:!0});case _.e:return C(e);case _.d:return k(e,t);default:return e}},P=a(20),N={displayTime:"",hours:0,maxHours:0,min:0,maxMin:0,sec:0,maxSec:0,started:!1,firstStart:!1},H=function(e,t){var a=e.maxSec<10?"0"+e.maxSec:e.maxSec,r=e.maxMin<10?"0"+e.maxMin:e.maxMin,n=0===e.maxHours?"".concat(e.min,":").concat(a):"".concat(e.hours,":").concat(r,":").concat(a);return Object(f.a)(Object(f.a)({},e),{},{firstStart:!0,displayTime:n})},F=function(e,t){var a=e.maxSec<10?"0"+e.maxSec:e.maxSec,r=e.maxMin<10?"0"+e.maxMin:e.maxMin,n=0===e.maxHours?"".concat(e.maxMin,":").concat(a):"".concat(e.maxHours,":").concat(r,":").concat(a);return Object(f.a)(Object(f.a)({},e),{},{started:!1,firstStart:!1,hours:e.maxHours,min:e.maxMin,sec:e.maxSec,displayTime:n})},D=function(e,t){var a=t.sec<10?"0"+t.sec:t.sec,r=t.min<10?"0"+t.min:t.min,n=0===t.hours?"".concat(t.min,":").concat(a):"".concat(t.hours,":").concat(r,":").concat(a);return Object(f.a)(Object(f.a)({},e),{},{hours:t.hours,min:t.min,sec:t.sec,displayTime:n})},L=function(e,t){var a;if(t.e.value<0)return Object(f.a)({},e);var r="maxHours"===t.e.name?"hours":"maxMin"===t.e.name?"min":"sec",n=Number(t.e.value);return Object(f.a)(Object(f.a)({},e),{},(a={},Object(P.a)(a,t.e.name,n),Object(P.a)(a,r,n),a))},W=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:N,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case _.j:return H(e);case _.c:return Object(f.a)(Object(f.a)({},e),{},{started:!1});case _.r:return Object(f.a)(Object(f.a)({},e),{},{started:!0});case _.i:return F(e);case _.q:return D(e,t);case _.b:return L(e,t);default:return e}},q=a(41),V={displayTime:"00:00.0",lapDisplayTime:"00:00.0",time:{fractionSec:0,sec:0,min:0,started:!1},lapTime:{fractionSec:0,sec:0,min:0,started:!1},laps:[],firstStart:!1},z=function(e,t){if(!e.time.started){var a=Object(f.a)({},e.time);a.fractionSec=0,a.sec=0,a.min=0,a.started=!1;var r=Object(f.a)({},e.lapTime);return r.fractionSec=0,r.sec=0,r.min=0,r.started=!1,Object(f.a)(Object(f.a)({},e),{},{time:a,lapTime:r,displayTime:"00:00.0",laps:[],firstStart:!1})}var n=Object(f.a)({},e.lapTime),o=n.sec<10?"0"+n.sec:n.sec,s=n.min<10?"0"+n.min:n.min,i="".concat(s,":").concat(o,".").concat(n.fractionSec);n.fractionSec=0,n.sec=0,n.min=0,n.started=!1;var c=Object(q.a)(e.laps);return c.unshift(e.lapDisplayTime),Object(f.a)(Object(f.a)({},e),{},{lapTime:n,lapDisplayTime:i,laps:c})},U=function(e,t){var a=Object(f.a)({},e.time);return a.started=!1,Object(f.a)(Object(f.a)({},e),{},{time:a})},Z=function(e,t){var a=Object(f.a)({},e.time);a.started=!0;var r=Object(f.a)({},e.lapTime);return r.started=!0,Object(f.a)(Object(f.a)({},e),{},{time:a,lapTime:r})},B=function(e,t){return Object(f.a)(Object(f.a)({},e),{},{time:t.time,displayTime:t.displayTime})},G=function(e,t){return Object(f.a)(Object(f.a)({},e),{},{firstStart:!0})},J=function(e,t){return Object(f.a)(Object(f.a)({},e),{},{lapTime:t.lapTime,lapDisplayTime:t.lapDisplayTime})},Y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:V,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case _.h:return z(e);case _.p:return U(e);case _.n:return Z(e);case _.l:return B(e,t);case _.m:return G(e);case _.k:return J(e,t);default:return e}},$=n.a.lazy((function(){return Promise.all([a.e(2),a.e(3)]).then(a.bind(null,284))})),X=Object(j.c)({stopwatch:Y,pomodoro:R,timer:W}),K=Object(j.d)(X,Object(j.a)(M.a)),Q=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(i.a)(this,a);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(e=t.call.apply(t,[this].concat(n))).state={isAuth:!1},e.handleWindowClose=function(){"false"===localStorage.remember&&(localStorage.removeItem("token"),localStorage.removeItem("userId"),localStorage.removeItem("remember"),localStorage.removeItem("email"))},e.logout=function(){localStorage.removeItem("token"),localStorage.removeItem("userId"),localStorage.removeItem("remember"),localStorage.removeItem("email"),e.setState({isAuth:!1})},e.isAuthHandler=function(){e.setState({isAuth:!0})},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("beforeunload",this.handleWindowClose);var e=localStorage.token,t=localStorage.userId;e&&t&&(S.b.defaults.headers.common["x-auth-token"]=e,this.setState({isAuth:!0}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("beforeunload",this.handleWindowClose)}},{key:"render",value:function(){var e=this,t=this.state.isAuth?n.a.createElement(T.d,null,n.a.createElement(T.b,{exact:!0,path:"/",render:function(){return n.a.createElement(r.Suspense,{fallback:n.a.createElement(v,null)},n.a.createElement($,{userId:localStorage.userId,logout:e.logout,demo:!1}))}}),n.a.createElement(T.a,{to:"/"})):n.a.createElement(T.d,null,n.a.createElement(T.b,{exact:!0,path:"/login",render:function(){return n.a.createElement(I,{login:!0,isAuth:e.isAuthHandler})}}),n.a.createElement(T.b,{exact:!0,path:"/signup",render:function(){return n.a.createElement(I,{login:!1,isAuth:e.isAuthHandler})}}),n.a.createElement(T.b,{exact:!0,path:"/demo",render:function(){return n.a.createElement(r.Suspense,{fallback:n.a.createElement(v,null)},n.a.createElement($,{demo:!0}))}}),n.a.createElement(T.a,{to:"/login"}));return n.a.createElement(w.a,{store:K},n.a.createElement(g.a,null,n.a.createElement(p,null,t)))}}]),a}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(Q,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[47,1,4]]]);
//# sourceMappingURL=main.e6638825.chunk.js.map