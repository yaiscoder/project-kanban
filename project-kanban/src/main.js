import { router } from "./router";

router();

window.addEventListener('popstate', router);