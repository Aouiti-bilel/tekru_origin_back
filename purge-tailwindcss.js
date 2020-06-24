const Purgecss = require('purgecss');
const fs = require('fs');
const path = require('path');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content)
    {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

const purgecss = new Purgecss({
  content: ["./src/**/*.js"],
  css: ["./src/styles/tailwind.css"],
  whitelist: [
    "pl-24",
    "pl-40",
    "pl-56",
    "pl-72",
    "pl-80",
    "text-black",
    "text-gray",
    "text-orange",
    "text-yellow",
    "text-yellow-700",
    "text-green",
    "text-teal",
    "text-blue",
    "text-indigo",
    "text-purple",
    "text-pink",
    "bg-black",
    "bg-gray",
    "bg-orange",
    "bg-yellow",
    "bg-yellow-700",
    "bg-green",
    "bg-teal",
    "bg-blue",
    "bg-indigo",
    "bg-purple",
    "bg-pink",
  ],
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ["html", "js"],
    },
  ],
});

const result = purgecss.purge();

result.forEach(out => {
    fs.writeFileSync(path.resolve(__dirname, out.file), out.css, 'utf-8');
});

console.log('src/styles/tailwind.css successfully purged.');
