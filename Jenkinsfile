@Library('conservify') _

conservifyProperties([ disableConcurrentBuilds() ])

timestamps {
    node () {
        try {
            stage ('git') {
                checkout scm
            }

            stage ('build') {
                sh """
export PATH=$PATH:node_modules/.bin

rm -rf node_modules/*/.git

npm --version
node --version
npm install
make
"""
            }

            build job: "fkn-app-android", wait: false
            build job: "fkn-app-ios", wait: false

            notifySuccess()
        }
        catch (Exception e) {
            notifyFailure()
            throw e;
        }
    }
}
