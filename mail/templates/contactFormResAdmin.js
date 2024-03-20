exports.contactUsEmailadmin = (
    email,
    firstname,
    lastname,
    message,
    phoneNo,
    countrycode
  ) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Query Form Response</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href=""><img class="logo"
                    src="https://res.cloudinary.com/dqpjwgdn6/image/upload/v1710480760/virtulearn/qiz31wfq33skjl8flmx1.png" alt="VirtuLearn Logo"></a>
            <div class="message">Query Form Response</div>
            <div class="body">
                <p>Dear Admin,</p>
                <p>You have received following message. Please Respond as soon as possible.
                </p>
                <p>Here are the details:</p>
                <p>Name: ${firstname} ${lastname}</p>
                <p>Email: ${email}</p>
                <p>Phone Number: ${phoneNo}</p>
                <p>Message: ${message}</p>
            </div>
            <div class="support">If you have any further questions or need immediate assistance, please feel free to reach
                out to us at <a href="mailto:virtulearn.noreply@gmail.com">virtulearn.noreply@gmail.com</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`
  }