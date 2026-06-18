# EduFlow Homepage

This is the standalone marketing homepage project.

## Run locally

```bash
cd homepage
npm install
npm start
```

By default the homepage runs on `http://localhost:3001` and sends login actions to `http://localhost:3000/login` during local development.

To point the login buttons somewhere else:

```bash
REACT_APP_LOGIN_URL=https://your-app-domain.com/login npm start
```
