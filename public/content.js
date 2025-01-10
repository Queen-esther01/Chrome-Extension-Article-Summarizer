const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
// To ensure the style is applied, we have to add the css file to the manifest.json
if (article) {
  const label = document.createElement("p");
  label.textContent = "This article is ready to be summarized!";
  label.classList.add("insummary-label");
  article.insertAdjacentElement("beforebegin", label);
}