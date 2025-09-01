import { type Plugin } from "vite";

import { displayName, description, homepage } from "../package.json";

const html = (): Plugin => ({
  name: "html",
  transformIndexHtml(html) {
    return html
      .replace(/__DISPLAY_NAME__/g, displayName)
      .replace(/__DESCRIPTION__/g, description)
      .replace(/__HOME_URL__/g, homepage)
      .replace(/__SCREENSHOT_URL__/g, `${homepage}/screenshot.png`);
  }
});

export default html;
