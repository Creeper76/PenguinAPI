const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const categories_DONT_USE = ["anime", "real"]; /* USED BY RANDOM ENDPOINT */
const categories = ["anime", "real", "random"];

app.get("/api/img/anime", sendRandomImage("/img/anime/"));
app.get("/api/img/real", sendRandomImage("/img/real/"));

app.get('/api/img/random', (req, res) => {
    const randomCategory = categories_DONT_USE[Math.floor(Math.random() * categories_DONT_USE.length)];

    const images = getImagesFromCategory(randomCategory);

    const randomImage = images[Math.floor(Math.random() * images.length)];

    res.sendFile(randomImage);
});

function getImagesFromCategory(category) {
    const dirPath = path.join(__dirname, `/img/${category}`);

    const files = fs.readdirSync(dirPath);

    return files.map(file => path.join(dirPath, file));
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <!-- If you're on mobile, then it looks like shit. Simple fix: get a computer. -->
      <head>
          <title>Penguin API</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet"> 
          <style>
              .background {
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 100%;
                  width: 100%;
                  background: url(/api/img/random) no-repeat center center fixed;
                  -webkit-background-size: cover;
                  -moz-background-size: cover;
                  -o-background-size: cover;
                  background-size: cover;
                  filter: blur(8px);
                  -webkit-filter: blur(8px);
                  z-index: -1;
              }
              .title {
                  position: absolute;
                  top: 10%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 5em;
                  font-weight: bold;
                  color: white;
                  text-align: center;
                  font-family: 'Roboto', sans-serif;
                  text-shadow: 2px 2px 20px rgba(0, 0, 0, 1);
              }
              .instructions {
                    position: absolute;
                    top: 75%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2em;
                    color: white;
                    text-align: center;
                    font-family: 'Roboto', sans-serif;
                    background-color: rgba(0, 0, 0, 0.7);
                    border-radius: 20px;
                    padding: 20px;
                }
                .disclaimer { /* not trying to get sued lol */
                    position: absolute;
                    top: 97%;
                    left: 21%; /* why 21%? idk */
                    transform: translate(-50%, -50%);s
                    color: white;
                    font-size: 0.9em;
                    font-family: 'Roboto', sans-serif;
                    background-color: rgba(0, 0, 0, 0.7);
                    border-radius: 20px;
                    padding: 5px;
                }
                .highlight {
                    color: #b3d8ff; /* Love this blue */
                }
                .highlight a {
                    color: inherit;
                    text-decoration: none;
                }
                #overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    z-index: 9999;
                    display: none;
                }
                #overlay.show {
                    display: block;
                    pointer-events: auto;
                }
                #mobile-popup {
                    z-index: 10000;
                    font-size: 4em;
                }
                #continue-button {
                    font-size: 2em;
                }
          </style>
      </head>
      <body>
          <div id="overlay" style="display: none;">
              <div class="background"></div>
              <div class="title">Penguin API</div>
              <div class="instructions">
                  How to use: <br><br>
                  http://127.0.0.1:5292/api/img/<span class="highlight">category</span>/
                  <br><br>
                  Categories: 
                  <div id="category-list">
                      ${categories.map(category => `<span class="highlight"><a href="http://127.0.0.1:5292/api/img/${category}/">${category}</a></span>`).join(', ')}
                  </div>
              </div>
              <div class="disclaimer">
                  *all these images are licensed under the <span class="highlight"><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a></span>
              </div>
          </div>
          <div id="mobile-popup" style="display: none;">
              Whoa, this isn't meant for mobile, but you can try to load it anyway. If you're on a computer, try making the window larger. Once clicking this, it won't show up again for 5 minutes.
              <button id="continue-button">Continue to page</button>
          </div>
      </body>
      <script>
        window.onload = function() {
          var overlay = document.getElementById('overlay');
          var mobilePopup = document.getElementById('mobile-popup');
          var continueButton = document.getElementById('continue-button');
      
          var lastClickTime = localStorage.getItem('lastClickTime');
          console.log(Date.now() - lastClickTime + " which is " + (Date.now() - lastClickTime)/1000 + " seconds or " + (Date.now() - lastClickTime)/60000 + " minutes.");
          if (window.innerWidth <= 1000) {
            if (!lastClickTime || Date.now() - lastClickTime > 300000) {
              overlay.classList.add('show');
              mobilePopup.style.display = 'block';
            }else{
              overlay.classList.remove('show');
              overlay.style.display = 'block';
            }
          }else{
            overlay.classList.remove('show');
            overlay.style.display = 'block';
          }
      
          continueButton.onclick = function() {
            overlay.classList.remove('show');
            overlay.style.display = 'block';
            mobilePopup.style.display = 'none';
            localStorage.setItem('lastClickTime', Date.now());
          };
        };
      </script>
  </html>
    `);
});

function sendRandomImage(dir) {
  return (req, res) => {
    const dirPath = path.join(__dirname, dir);

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      const file = files[Math.floor(Math.random() * files.length)];

      res.sendFile(path.join(dirPath, file));
    });
  };
}

const port = process.env.PORT || 5292;
app.listen(port, () => console.log(`Server running on port ${port}`));
