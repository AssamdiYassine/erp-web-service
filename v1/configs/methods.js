const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailjet = require ('node-mailjet')
.connect(process.env.MAILJET_USERNAME, process.env.MAILJET_PASSWORD)
// Models
const User = require('../../models/user');

module.exports = {
  // hashPassword
  hashPassword: async (password) => {
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(password, salt)

      // Re-assign the password with password hash
      return passwordHash;
    } catch (error) {
      throw new Error(error);
    }
  },
  // Generate Token
  generateAuthToken: async (user) => {
    let token = JWT.sign({
      iss: 'DP-TEAM',
      sub: user._id,
      iat: Math.floor(new Date().getTime() / 1000), //current date
      exp: Math.floor(new Date().setDate(new Date().getDate() + 1)/1000) //current date + 1 day ahead
    }, process.env.VERIFY_SECRET);
    return token;
  },
  // Generate Code 
  generateCode: async () => {
    const list = "123456789";
    // const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    var res = "";
    for(var i = 0; i < 6; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }
    return res;
  },
  // Verify Token
  validationToken: async (token) => {
    const { sub } = JWT.verify(token, process.env.VERIFY_SECRET);
    let user = await User.findOne({_id: sub});
    if (user) {
      user.active = true;
      await user.save()
      return user;
    }
    else {
      return {error: true};
    }
  },
  // Generate Password
  generatePassword: async (numLc, numUc, numDigits, numSpecial) => {
    numLc = numLc || 4;
    numUc = numUc || 4;
    numDigits = numDigits || 4;
    numSpecial = numSpecial || 2;
    
    
    
    
    var lcLetters = 'abcdefghijklmnopqrstuvwxyz';
    var ucLetters = lcLetters.toUpperCase();
    var numbers = '0123456789';
    var special = '!?=#*$@+-.';
    
    
    
    var getRand = function(values) {
    return values.charAt(Math.floor(Math.random() * values.length));
    }
    
    
    function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
    };
    
    
    
    var pass = [];
    for(var i = 0; i < numLc; ++i) { pass.push(getRand(lcLetters)) }
    for(var i = 0; i < numUc; ++i) { pass.push(getRand(ucLetters)) }
    for(var i = 0; i < numDigits; ++i) { pass.push(getRand(numbers)) }
    for(var i = 0; i < numSpecial; ++i) { pass.push(getRand(special)) }
    
    
    
    return shuffle(pass).join('');
  },
  //Generate Refference
  generateRef: async () => {

    const d = new Date();
    const shortYear = d.getFullYear();
    const twoDigitMonth = d.getMonth() < 9 ? '0'+(d.getMonth()+1) : d.getMonth()+1;
    const twoDigitYear = shortYear.toString().substr(-2);

    let count = await User.countDocuments();
    count += 6845;
    if(count < 10) {
      count = '00'+count;
    } else if(count > 10 && count < 100) {
      count = '0'+count;
    }

    return 'Mos-'+twoDigitMonth+'-'+twoDigitYear+'-'+count;
  },
  //Generate Matricule
  generateMatricule: async (company) => {

    const d = new Date();
    const shortYear = d.getFullYear();
    const twoDigitDay = String(d.getDate()).padStart(2, '0');
    const twoDigitMonth = d.getMonth() < 9 ? '0'+(d.getMonth()+1) : d.getMonth()+1;
    const twoDigitYear = shortYear.toString().substr(-2);

    let count = await User.countDocuments({ company });
    count += 1;
    if(count < 10) {
      count = '00'+count;
    } else if(count >= 10 && count < 100) {
      count = '0'+count;
    }

    return twoDigitDay+twoDigitMonth+twoDigitYear+count;
  },
  // Send Code Update Email
  sendEMAILConfirmationCode: async ({toUser, code}) => {
    const message = {
      "From": {
        "Email": "contact@mossahamati.com",
        "Name": "MOSSAHAMATI"
      },
      "To": [
        {
          "Email": toUser.email,
          "Name": toUser.username
        }
      ],
      "Subject": "MOSSAHAMATI - Code de vérification",
      "TextPart": "Code de vérification",
      "HTMLPart": `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MOSSAHAMATI</title>
        <!-- <link rel="preconnect" href="https://fonts.gstatic.com"> -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
      </head>
      <body style="background-color: #F9F9F9; font-family: 'Poppins', sans-serif; max-width: 800px; margin: 0 auto; height: 1100px;">
        <div style="width: 700px; height: 307px; margin: 0 auto;">
          <div style="background-color: black; width: 100%; height: 307px;">
            <img src="http://mossahamati.com/media/mail/header.png" width="700" height="307" style="display:block;"/>
          </div>
          <div style="background-color: white; width: 100%; ">
            <div style="padding-top: 60px; padding-left: 50px;">
              <span style="color: black; font-size: 24px;">Bonjour, </span>
            </div>
            <div style="margin-top: 20px; padding-left: 50px;">
              <span style="color: #000000; font-size: 18px;">
                Merci pour votre inscription à MOSSAHAMATI ! Veuillez saisir le code ci-dessous pour confirmer votre inscription.
              </span>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div style="padding: 20px; background-color: #ddd; width: 50%; margin: auto;">
                <span style="font-size: 25px; color: black;  letter-spacing: 5px;">${code}</span>
              </div>
            </div>
            <div style="margin-top: 20px; padding-left: 50px;">
              <span style="color: #000000; font-size: 18px;">
                Ce code est valable pour une durée de 2 heures. 
              </span>
            </div>
            <div style="margin-top: 20px; padding-left: 50px; padding-bottom: 40px;">
              <span style="color: black; font-size: 22px;">
                Merci !
              </span>
              <br />
              <span style="color: black; font-size: 20px; ">
                L'équipe MOSSAHAMATI.
              </span>
            </div>
          </div>
        </div>
      </body>
      </html>`,
      "CustomID": "AppGettingStartedTest"
    }
    return sendEmail(message);
  },
  // Send Reset Password Email
  sendResetPasswordEmail: async ({toUser, code}) => {
    const message = {
      "From": {
        "Email": "contact@mossahamati.com",
        "Name": "MOSSAHAMATI"
      },
      "To": [
        {
          "Email": toUser.email,
          "Name": toUser.username
        }
      ],
      "Subject": "MOSSAHAMATI - Réinitialisation du mot de passe",
      "TextPart": "Réinitialisez votre mot de passe",
      "HTMLPart": `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MOSSAHAMATI</title>
        <!-- <link rel="preconnect" href="https://fonts.gstatic.com"> -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
      </head>
      <body style="background-color: #F9F9F9; font-family: 'Poppins', sans-serif; max-width: 800px; margin: 0 auto; height: 1100px;">
        <div style="width: 700px; height: 307px; margin: 0 auto;">
          <div style="background-color: black; width: 100%; height: 307px;">
            <img src="http://mossahamati.com/media/mail/header.png" width="700" height="307" style="display:block;"/>
          </div>
          <div style="background-color: white; width: 100%; ">
            <div style="padding-top: 60px; padding-left: 50px;">
              <span style="color: black; font-size: 24px;">Réinitialisez votre mot de passe</span>
            </div>
            <div style="margin-top: 20px; padding-left: 50px;">
              <span style="color: #000000; font-size: 18px;">
                Merci de nous avoir contacté.
                <br/>
                Vous avez demandé une réinitialisation du mot de passe associé à votre compte Mossahamati. Si vous avez fait la demande, veuillez coupier le code ci-dessous pour changer votre mot de passe.
              </span>
            </div>
            <div style="margin-top: 20px; padding-left: 50px;">
              <span style="color: #000000; font-size: 18px;">
                Ci-dessous votre code de confirmation :
              </span>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div style="padding: 20px; background-color: #ddd; width: 50%; margin: auto;">
                <span style="font-size: 25px; color: black;  letter-spacing: 5px;">${code}</span>
              </div>
            </div>
            <div style="margin-top: 20px; padding-left: 50px;">
              <span style="color: #000000; font-size: 18px;">
              Si vous n'avez pas fait cette demande, veuillez ignorer cet email. Soyez assuré que votre compte client est sécurisé.
              </span>
            </div>
            <div style="margin-top: 20px; padding-left: 50px; padding-bottom: 40px;">
              <span style="color: black; font-size: 22px;">
                Merci
              </span>
              <br />
              <span style="color: black; font-size: 20px; ">
                L'équipe MOSSAHAMATI
              </span>
            </div>
          </div>
        </div>
      </body>
      </html>`,
      "CustomID": "AppGettingStartedTest"
    }
    return sendEmail(message);
  },
  // Send Update Password Mail
  sendConfirmationUpdatePasswordEmail: async ({toUser}) => {
    const message = {
          "From": {
            "Email": "contact@mossahamati.com",
            "Name": "MOSSAHAMATI"
          },
          "To": [
            {
              "Email": toUser.email,
              "Name": toUser.username
            }
          ],
          "Subject": "MOSSAHAMATI - Changement du mot de passe",
          "TextPart": "Changement de votre mot de passe",
          "HTMLPart": `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MOSSAHAMATI</title>
            <!-- <link rel="preconnect" href="https://fonts.gstatic.com"> -->
            <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
          </head>
          <body style="background-color: #F9F9F9; font-family: 'Poppins', sans-serif; max-width: 800px; margin: 0 auto; height: 1100px;">
            <div style="width: 700px; height: 307px; margin: 0 auto;">
              <div style="background-color: black; width: 100%; height: 307px;">
                <img src="http://mossahamati.com/media/mail/header.png" width="700" height="307" style="display:block;"/>
              </div>
              <div style="background-color: white; width: 100%; ">
                <div style="padding-top: 60px; padding-left: 50px;">
                  <span style="color: black; font-size: 24px;">Bonjour ${toUser.username}</span>
                </div>
                <div style="margin-top: 20px; padding-left: 50px;">
                  <span style="color: #000000; font-size: 18px;">
                    Votre mot de passe a été modifié avec succès !
                    <br/>
                    <br/>
                    Si vous l’avez fait, ne tenez pas compte de cet e-mail.
                    <br/>
                  </span>
                </div>
                <div style="margin-top: 20px; padding-left: 50px; padding-bottom: 40px;">
                  <span style="color: black; font-size: 22px;">
                    Merci
                  </span>
                  <br />
                  <span style="color: black; font-size: 20px; ">
                    L'équipe MOSSAHAMATI
                  </span>
                </div>
              </div>
            </div>
          </body>
          </html>`,
          "CustomID": "AppGettingStartedTest"
    }
    return sendEmail(message);
  },
}

async function sendEmail(message) {
  // const request = await mailjet.post("send", {​​'version': 'v3.1'}​​).request({"Messages":[ message ]}​​);
  const request = await mailjet
  .post("send", {'version': 'v3.1'})
  .request({
      "Messages":[message]
  })
  // return request.then((result) => {​​ console.log(result.body) }​​).catch((err) => {​​ console.log(err.statusCode) }​​)
  return true;
}