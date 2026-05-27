import { loginPage } from "./pages/login";
import { boardPage } from "./pages/board";

const routes = {
  '/': loginPage,
  '/dashboard': boardPage
}

export function router(){
  let path = window.location.pathname;

  const auth = localStorage.getItem('user');
  if(path === '/'){
    if (auth){
      path = '/dashboard'
      history.pushState(null, null, path);
    }
  } 

  if(path === '/dashboard'){
    if(!auth){
      path = '/'
      history.pushState(null,null,path);
    }
  }

  const page = routes[path] || {
    render: () => '<h1>404</h1>',
    mounted: () => {}
  };

  document.getElementById('app').innerHTML = page.render();

  page.mounted();
}