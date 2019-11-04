user.register = async function (done) {

    try {

         // To check if User exists in Users DB
        let user = await this.findOne({}).select({});
        let newUserFlag = false;

        if(user)
        {
               // To check if User exists in Directory DB
            const regUser = await Directory.getUser(user, user.id);
            if(regUser)
                return done(null,user);
            else
                newUserFlag = true;
        }
        else
        {
            // Enrolling the User in Enrolment DB
            const creds = await Enrolment.enrollUser(AdminUsername, AdminPassword);
            const keypair = await GPG.generateKeypair();

            const myguy = new this({
                    name: 'Some Name'
                    identity: {
                        type: creds['type'],
                        certificate: creds['certificate'],
                        private_key: creds['privateKey'],
                        public_key: creds['publicKey']
                    },
                    keypair: {
                        private_key: keypair.privateKey,
                        public_key: keypair.publicKey
                    }
                });

             // Saving the User in Users DB
             user = await myguy.save();
             newUserFlag = true;
        }

        if(newUserFlag)
        {
             // Saving the User in Directory DB
             const cUser = await Directory.createUser(user);

             const returnUser = await User.findOneAndUpdate({ _id: cUser._id }, {
                    _id: cUser._id,
                    name: cUser.name,
                }, {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    useFindAndModify: false
                });

            return done(null,returnUser);
           
        }


    } catch (error) {
        console.log("Error",error);
    }
   
};