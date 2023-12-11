const express = require('express');
const registerRoute = require('./routes/register');
const sendEmailRoute = require('./routes/send-email');
const loginRoute = require('./routes/login');
const forgotPasswordRoute = require('./routes/forgot-password');
const verifyEmailRoute = require('./routes/verify-code');
const tutorRegisterRoute = require('./routes/tutor-register');
const studentRegisterRoute = require('./routes/student-register');
const adminLoginRoute = require('./routes/admin-login');
const educationInfoRoute = require('./routes/education-info');
const experienceInfoRoute = require('./routes/experience-info');
const paymentInfoRoute = require('./routes/payment-info');
//const updateEducationRoute = require('./routes/update-education');


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/register', registerRoute);
app.use('/send-email', sendEmailRoute);
app.use('/login', loginRoute);
app.use('/admin-login', adminLoginRoute);
app.use('/forgot-password', forgotPasswordRoute);
app.use('/verify-code', verifyEmailRoute);
app.use('/tutor-register', tutorRegisterRoute);
app.use('/student-register', studentRegisterRoute);
app.use('/education-info', educationInfoRoute);
app.use('/experience-info', experienceInfoRoute);
app.use('/payment-info', paymentInfoRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
