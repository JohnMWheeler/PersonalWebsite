# PersonalWebsite

A responsive academic website for John Wheeler, a second-year mathematics Ph.D. student at the University at Albany, SUNY, working with Marco Varisco. All styles and scripts are included in `index.html`; no dependencies or build process are required.

## View it

Open `index.html` in a browser. The page also works with JavaScript disabled; JavaScript adds a theme switcher and updates the copyright year.

## Content

The page includes an academic biography, research interests, a manuscript in progress, related research questions, expository interests, and a public GitHub contact link. Research descriptions concern ongoing work; the page does not list these projects as publications or provide manuscript downloads.

Edit `index.html` to maintain the biography, research descriptions, notes, and public contact links. Update the year of study as needed. Theme colors are defined at the top of the `<style>` block.

## Publish with GitHub Pages

The site files belong in the root of the `main` branch of [JohnMWheeler/PersonalWebsite](https://github.com/JohnMWheeler/PersonalWebsite).

1. Open the repository's [Settings → Pages](https://github.com/JohnMWheeler/PersonalWebsite/settings/pages).
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/ (root)**, then click **Save**.
4. Wait for GitHub Pages to finish deployment. The Pages settings show the published URL.

The expected website address is **https://johnmwheeler.github.io/PersonalWebsite/**. This address will work after Pages is enabled and its first deployment succeeds. Future commits to `main` will update the site automatically.

Opening an HTML file in GitHub shows its source. Use the GitHub Pages address to view the rendered website.

GitHub Pages must be enabled in the repository settings; uploading HTML alone does not enable hosting. The `.nojekyll` file tells Pages to serve the static files directly. All in-page links work when the site is served from `/PersonalWebsite/` or opened locally.
