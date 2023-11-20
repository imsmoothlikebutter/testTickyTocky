<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<div align="center">
<img src="https://github.com/2100711/ICT3103-TickyTocky/assets/94297073/9574393d-1730-4617-94f8-778555470713" width="500" height="500">
</div>
</br>

<h1 align="center"><strong>ICT3103/3203 Group 8</strong></h1>

<!-- GETTING STARTED -->
# Getting Started

The following tools are required to run this application:

1. Docker Deskop: https://www.docker.com/products/docker-desktop/
2. Node.js: https://nodejs.org/en/download/
3. MongoDB Compass: https://www.mongodb.com/try/download/compass

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

[![JavaScript][JavaScript-logo]][JavaScript-url]
[![Node.js][Node-logo]][Node-url]
[![npm][npm-logo]][npm-url]
[![ExpressJS][Express.js]][Expressjs-url]
[![React][React]][React-url]
[![MongoDB][MongoDB]][MongoDB-url]
[![Mocha][Mocha]][Mocha-url]
[![Chai][Chai]][Chai-url]
[![Sinon][Sinon]][Sinon-url]
[![Snyk][Snyk]][Snyk-url]
[![OWASP Dependency-Check][OWASP Dependency-Check]][OWASP Dependency-Check-url]
[![Selenium][Selenium]][Selenium-url]
[![Jenkins][Jenkins]][Jenkins-url]
[![Docker][Docker]][Docker-url]
[![GitHub][GitHub]][GitHub-url]
[![AWS][AWS]][AWS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app locally

To run the project locally, follow these steps:

1. Clone the repository.
2. Navigate to the `/server` directory and run `npm install` to install server dependencies.
3. Create a `.env` file in the `/server` folder with the following contents.

> Note: Replace the values in square brackets with your own values

```env
DB_USER = [Your DB Username]
DB_PASS = [Your DB Password]
EMAIL_NAME = [Your Email Name]
EMAIL_USER = [Your Email Address]
EMAIL_PASS = [Your Email Password]
SECRET = [Your Secret]
CRYPTOSECRET = [Your Crypto Secret]
```
4. Start the server with `npm start`.
5. Open a new terminal, navigate to the `/client` directory, and run `npm install` to install client dependencies.
6. Start the client with `npm start`.
7. Access the application at http://localhost:3000 in your web browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app in Docker (Locally)

To run the project in Docker locally, follow these steps:

1. Navigate into the `root` directory of the project.
2. Run `docker compose up -d` to start the application.
3. Access the application at http://localhost:3000 in your web browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app in Docker (AWS)

To run the project in Docker on AWS, follow these steps using an `Ubuntu CLI` or `WSL2` to run the following commands:



Intial setup of docker and compose:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
# Add the repository to Apt sources:
echo   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Run the following command in the root directory:

```bash
git clone https://github.com/2100711/ICT3103-TickyTocky.git
cd ICT3103-TickyTocky
docker compose up -d
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Testing

To run Selenium tests for frontend and unit tests for backend, use the following command in the `/client` and `/server` directory:

```bash
npm test
```

## Contributors

The involvement of these individuals was crucial for the creation of this project.

[@Terence2389](https://github.com/Terence2389) - [2102389](2102389@sit.singaporetech.edu.sg), [@Elsonnnn](https://github.com/Elsonnnn) - [2101234](2101234@sit.singaporetech.edu.sg), [@joash2808](https://github.com/joash2808) - [2101177](2101177@sit.singaporetech.edu.sg), [@tay-en](https://github.com/tay-en) - [2100928](2100928@sit.singaporetech.edu.sg), [@irfaan96](https://github.com/irfaan96) - [2100701](2100701@sit.singaporetech.edu.sg), [@ZafrullaKamil](https://github.com/ZafrullaKamil) - [2100764](2100764@sit.singaporetech.edu.sg), [@2100711](https://github.com/2100711) - [2100711](2100711@sit.singaporetech.edu.sg)



<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[contributors-url]: https://github.com/2100711/ICT3103-TickyTocky/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[forks-url]: https://github.com/2100711/ICT3103-TickyTocky/network/members
[stars-shield]: https://img.shields.io/github/stars/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[stars-url]: https://github.com/2100711/ICT3103-TickyTocky/stargazers
[issues-shield]: https://img.shields.io/github/issues/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[issues-url]: https://github.com/2100711/ICT3103-TickyTocky/issues
[license-shield]: https://img.shields.io/github/license/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[license-url]: https://github.com/2100711/ICT3103-TickyTocky/blob/master/LICENSE.md
[Node-logo]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[npm-logo]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/
[JavaScript-logo]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[ExpressJS-url]: https://expressjs.com/
[React]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Mocha]: https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white
[Mocha-url]: https://mochajs.org/
[Chai]: https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white
[Chai-url]: https://www.chaijs.com/
[Sinon]: https://img.shields.io/badge/Sinon-000000?style=for-the-badge&logo=sinon&logoColor=white
[Sinon-url]: https://sinonjs.org/
[Snyk]: https://img.shields.io/badge/Snyk-4C8BF5?style=for-the-badge&logo=snyk&logoColor=white
[Snyk-url]: https://snyk.io/
[OWASP Dependency-Check]: https://img.shields.io/badge/OWASP%20Dependency%20Check-5865F2?style=for-the-badge
[OWASP Dependency-Check-url]: https://plugins.jenkins.io/dependency-check-jenkins-plugin/
[Selenium]: https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white
[Selenium-url]: https://www.selenium.dev/
[Jenkins]: https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white
[Jenkins-url]: https://www.jenkins.io/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[GitHub]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[GitHub-url]: https://github.com/
[AWS]: https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-url]: https://aws.amazon.com/